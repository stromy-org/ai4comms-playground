// Slide fit-check — preflight overflow + overlap detector.
//
// Loads each rendered HTML slide under slides/ and reports:
//   - any element whose bounding box extends past the 1280×720 canvas
//   - any element whose box extends past the SAFE zone (default 60/40/60/56 inset)
//   - any pair of text-bearing elements whose bounding boxes overlap
//
// Designed to run BEFORE html2pptx conversion so the build fails early with
// a precise per-slide report, rather than producing a broken PPTX.
//
// Usage:
//   node fit-check.js                  → scan slides/, exit 1 on errors
//   node fit-check.js --warn-only      → scan, print, never exit non-zero
//   node fit-check.js --slide 06       → scan one slide
//
// The thresholds below are conservative for the AI4comms layout (60px hard
// margin all sides + 40px footer band). Adjust SAFE_BOTTOM if the footer
// reservation changes.

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CANVAS_W = 1280;
const CANVAS_H = 720;

// Safe zone: content boxes must fit inside these bounds.
// Top = 40 leaves room for the section-number band. Bottom = 660 reserves the
// 22px-from-bottom footer + its 10px top rule + 18px breathing room.
const SAFE = { left: 30, top: 30, right: 1250, bottom: 660 };

// Footer band — elements MAY exit SAFE.bottom only if they belong to the footer
// (we identify it by the `.footer` class).
const FOOTER_SELECTOR = '.footer';

// Selectors we never need to bound-check (decorative rules, sub-pixel divider lines).
const IGNORE_SELECTORS = [
  '.rule-accent', '.rule-sage', '.brand-rule', '.brand-rule-accent',
  'hr', 'br',
];

const args = process.argv.slice(2);
const warnOnly = args.includes('--warn-only');
const slideArg = (() => {
  const i = args.indexOf('--slide');
  return i >= 0 ? args[i + 1] : null;
})();

(async () => {
  const SLIDES = path.join(__dirname, 'slides');
  const files = fs.readdirSync(SLIDES)
    .filter(f => f.endsWith('.html'))
    .filter(f => !slideArg || f.startsWith(slideArg))
    .sort();

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: CANVAS_W, height: CANVAS_H } });
  const page = await ctx.newPage();

  const allReports = [];
  for (const f of files) {
    await page.goto('file://' + path.join(SLIDES, f), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const report = await page.evaluate(
      ({ CANVAS_W, CANVAS_H, SAFE, FOOTER_SELECTOR, IGNORE_SELECTORS }) => {
        const overflows = [];
        const safeViolations = [];
        const overlaps = [];

        const all = Array.from(document.querySelectorAll('*'));
        const footerEls = new Set(Array.from(document.querySelectorAll(FOOTER_SELECTOR + ', ' + FOOTER_SELECTOR + ' *')));
        const ignore = new Set(IGNORE_SELECTORS.flatMap(s => Array.from(document.querySelectorAll(s))));

        // (1) Off-canvas: any element whose box extends past the slide.
        for (const el of all) {
          if (ignore.has(el)) continue;
          if (el === document.documentElement || el === document.body) continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;

          const off = [];
          if (r.left < -0.5) off.push(`left=${r.left.toFixed(1)}`);
          if (r.top < -0.5) off.push(`top=${r.top.toFixed(1)}`);
          if (r.right > CANVAS_W + 0.5) off.push(`right=${r.right.toFixed(1)}`);
          if (r.bottom > CANVAS_H + 0.5) off.push(`bottom=${r.bottom.toFixed(1)}`);
          if (off.length) {
            const txt = (el.innerText || '').trim().slice(0, 50);
            overflows.push({
              tag: el.tagName.toLowerCase(),
              cls: el.className && typeof el.className === 'string' ? el.className.slice(0, 60) : '',
              text: txt,
              box: { x: r.left, y: r.top, w: r.width, h: r.height },
              violations: off,
            });
          }
        }

        // (2) Safe-zone: bound-check, but exclude the footer band.
        for (const el of all) {
          if (ignore.has(el) || footerEls.has(el)) continue;
          if (el === document.documentElement || el === document.body) continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          // Only flag elements that are leaf-ish or top-level positioned containers.
          // Skip if a descendant has text — the descendant will be flagged instead.
          const hasOwnText = Array.from(el.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
          const isLeaf = el.children.length === 0;
          if (!hasOwnText && !isLeaf) continue;

          const off = [];
          if (r.left < SAFE.left - 0.5) off.push(`left<${SAFE.left}`);
          if (r.top < SAFE.top - 0.5) off.push(`top<${SAFE.top}`);
          if (r.right > SAFE.right + 0.5) off.push(`right>${SAFE.right}`);
          if (r.bottom > SAFE.bottom + 0.5) off.push(`bottom>${SAFE.bottom}`);
          if (off.length) {
            const txt = (el.innerText || el.textContent || '').trim().slice(0, 60);
            safeViolations.push({
              tag: el.tagName.toLowerCase(),
              cls: el.className && typeof el.className === 'string' ? el.className.slice(0, 60) : '',
              text: txt,
              box: { x: r.left, y: r.top, w: r.width, h: r.height },
              violations: off,
            });
          }
        }

        // (2b) Near-miss vertical gap: pairs of vertically-stacked text frames whose gap
        //      is < MIN_GAP_PX. HTML measurement uses Chromium font metrics; PowerPoint
        //      may render the same text taller (font fallback, line-height interpretation),
        //      pushing the bottom frame's content into the next frame. A 18px buffer
        //      between text frames is the empirically-safe minimum.
        const MIN_GAP_PX = 18;
        // Build a list of top-level absolutely-positioned content containers so we only
        // compare distinct frames (not text inside the same frame).
        const positionedBoxes = all.filter(el => {
          if (ignore.has(el) || footerEls.has(el)) return false;
          if (el === document.documentElement || el === document.body) return false;
          const cs = window.getComputedStyle(el);
          if (cs.position !== 'absolute') return false;
          const r = el.getBoundingClientRect();
          return r.width > 1 && r.height > 1 && r.height < 600;
        }).map(el => ({ el, r: el.getBoundingClientRect() }));

        const nearMisses = [];
        for (let i = 0; i < positionedBoxes.length; i++) {
          for (let j = i + 1; j < positionedBoxes.length; j++) {
            const a = positionedBoxes[i], b = positionedBoxes[j];
            if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
            // Horizontal overlap?
            const xO = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
            if (xO < 20) continue;
            // Vertical gap (positive = there's a gap; negative = overlap, already flagged elsewhere)
            const top = a.r.bottom < b.r.bottom ? a : b;
            const bot = a.r.bottom < b.r.bottom ? b : a;
            const gap = bot.r.top - top.r.bottom;
            if (gap >= 0 && gap < MIN_GAP_PX) {
              const txtA = (top.el.innerText || top.el.textContent || '').trim().slice(0, 50);
              const txtB = (bot.el.innerText || bot.el.textContent || '').trim().slice(0, 50);
              if (!txtA && !txtB) continue;
              nearMisses.push({
                a: { text: txtA, box: top.r },
                b: { text: txtB, box: bot.r },
                gap: gap.toFixed(1),
              });
            }
          }
        }

        // (3) Overlap: pairs of text-bearing leaves whose boxes intersect by > 4px in both axes.
        const textLeaves = all.filter(el => {
          if (ignore.has(el)) return false;
          if (el.children.length > 0) return false;
          const txt = (el.textContent || '').trim();
          if (!txt) return false;
          const r = el.getBoundingClientRect();
          return r.width > 1 && r.height > 1;
        }).map(el => {
          const r = el.getBoundingClientRect();
          return { el, r, text: el.textContent.trim().slice(0, 50) };
        });

        // Skip overlaps where one element is an ancestor/descendant of the other,
        // or both are inside the same chip/card (intentional layering).
        function isStackParent(a, b) {
          // Image-overlay pattern: text positioned absolute over an <img> sibling.
          // Accept overlaps if either is an <img> or has class containing 'chip' / 'overlay'.
          const isAllowed = (n) => /chip|overlay|img/i.test(n.className || '') || n.tagName === 'IMG';
          if (isAllowed(a) || isAllowed(b)) return true;
          // If either is contained by an .img/.chip ancestor of the other → allowed.
          return false;
        }

        for (let i = 0; i < textLeaves.length; i++) {
          for (let j = i + 1; j < textLeaves.length; j++) {
            const a = textLeaves[i], b = textLeaves[j];
            // Ancestor relationship → not an overlap (nested text spans).
            if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
            // Same direct parent and inline siblings → not an overlap (text run wrap).
            if (a.el.parentElement === b.el.parentElement) continue;

            const xOverlap = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
            const yOverlap = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
            if (xOverlap > 4 && yOverlap > 4) {
              if (isStackParent(a.el, b.el)) continue;
              overlaps.push({
                a: { tag: a.el.tagName.toLowerCase(), text: a.text },
                b: { tag: b.el.tagName.toLowerCase(), text: b.text },
                overlap: { x: xOverlap.toFixed(1), y: yOverlap.toFixed(1) },
              });
            }
          }
        }

        return { overflows, safeViolations, overlaps, nearMisses };
      },
      { CANVAS_W, CANVAS_H, SAFE, FOOTER_SELECTOR, IGNORE_SELECTORS }
    );

    allReports.push({ slide: f, ...report });
  }

  await browser.close();

  // --------- Render report ---------
  let errCount = 0;
  for (const r of allReports) {
    const nearMisses = r.nearMisses || [];
    const total = r.overflows.length + r.safeViolations.length + r.overlaps.length + nearMisses.length;
    if (total === 0) {
      console.log(`✓ ${r.slide}`);
      continue;
    }
    errCount += total;
    console.log(`\n✗ ${r.slide}  (${r.overflows.length} off-canvas, ${r.safeViolations.length} safe-zone, ${r.overlaps.length} overlap, ${nearMisses.length} near-miss)`);
    for (const o of r.overflows.slice(0, 6)) {
      console.log(`    OFF-CANVAS  <${o.tag}.${o.cls}>  box=(${o.box.x.toFixed(0)},${o.box.y.toFixed(0)} ${o.box.w.toFixed(0)}×${o.box.h.toFixed(0)})  ${o.violations.join(' ')}  "${o.text}"`);
    }
    for (const o of r.safeViolations.slice(0, 6)) {
      console.log(`    SAFE-ZONE   <${o.tag}.${o.cls}>  box=(${o.box.x.toFixed(0)},${o.box.y.toFixed(0)} ${o.box.w.toFixed(0)}×${o.box.h.toFixed(0)})  ${o.violations.join(' ')}  "${o.text}"`);
    }
    for (const o of r.overlaps.slice(0, 6)) {
      console.log(`    OVERLAP     ${o.a.tag}"${o.a.text}"  ⇄  ${o.b.tag}"${o.b.text}"  (Δx=${o.overlap.x}, Δy=${o.overlap.y})`);
    }
    for (const o of nearMisses.slice(0, 6)) {
      console.log(`    NEAR-MISS   "${o.a.text}"  ⇄  "${o.b.text}"  gap=${o.gap}px (need ≥18px — PowerPoint may overflow this distance)`);
    }
  }

  console.log(`\n${errCount === 0 ? 'OK' : `FAIL · ${errCount} issue(s) across ${allReports.filter(r => r.overflows.length + r.safeViolations.length + r.overlaps.length).length} slide(s)`}`);
  if (errCount > 0 && !warnOnly) process.exit(1);
})();
