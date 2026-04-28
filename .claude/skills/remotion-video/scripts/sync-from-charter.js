#!/usr/bin/env node
/**
 * Regenerate src/theme.ts from a company's charter.json.
 *
 * Usage:
 *   node .claude/skills/remotion-video/scripts/sync-from-charter.js
 *   node .claude/skills/remotion-video/scripts/sync-from-charter.js --company dukestrategies
 *
 * Company discovery:
 *   - If --company is provided, use that company
 *   - If only one company exists in client-data/clients/ (excluding _example), use it
 *   - Otherwise, error with a list of available companies
 */

const fs = require("fs");
const path = require("path");

// --- Parse arguments ---
const args = process.argv.slice(2);
const companyFlag = args.indexOf("--company");
const companyArg = companyFlag !== -1 ? args[companyFlag + 1] : null;

const skillDir = path.resolve(__dirname, "..");
const repoRoot = path.resolve(skillDir, "../..");
const companiesDir = path.join(repoRoot, ".claude", "companies");

// --- Discover company ---
function discoverCompany() {
  if (companyArg) return companyArg;
  if (!fs.existsSync(companiesDir)) {
    console.error("Error: client-data/clients/ directory not found");
    process.exit(1);
  }
  const companies = fs
    .readdirSync(companiesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "_example")
    .map((d) => d.name);
  if (companies.length === 1) return companies[0];
  if (companies.length === 0) {
    console.error("Error: No companies found in client-data/clients/");
    process.exit(1);
  }
  console.error(`Error: Multiple companies found. Use --company <name>:`);
  companies.forEach((c) => console.error(`  --company ${c}`));
  process.exit(1);
}

const company = discoverCompany();
const charterPath = path.join(companiesDir, company, "charter.json");

if (!fs.existsSync(charterPath)) {
  console.error(`Error: ${charterPath} not found`);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(charterPath, "utf-8"));
const charter = { ...raw };
const videoSettings = charter.video || {};
const resolution = (videoSettings.resolution || "1920x1080").split("x").map(Number);
const fps = videoSettings.fps || 30;

const theme = `// Auto-generated from ${company}/charter.json — do not edit manually.
// Regenerate with: node .claude/skills/remotion-video/scripts/sync-from-charter.js --company ${company}

export const theme = {
  colors: {
    primary: "${charter.colors.primary}",
    primaryDark: "${adjustColor(charter.colors.primary, -10)}",
    primaryLight: "${adjustColor(charter.colors.primary, 5)}",
    secondary: "${charter.colors.secondary}",
    text: "${charter.colors.text}",
    textDark: "${darken(charter.colors.text, 25)}",
    background: "${charter.colors.background}",
    backgroundAlt: "${charter.colors.backgroundAlt || "#F5F5F5"}",
    white: "#FFFFFF",
    black: "#2D2D2D",
    success: "${charter.colors.success || "#4CAF50"}",
    warning: "${charter.colors.warning || "#FFC107"}",
    info: "#2196F3",
    gradientStart: "${adjustColor(charter.colors.primary, 5)}",
    gradientEnd: "${adjustColor(charter.colors.primary, -10)}",
  },
  fonts: {
    heading: "${charter.fonts.heading.family}, ${charter.fonts.heading.fallback}",
    body: "${charter.fonts.body.family}, ${charter.fonts.body.fallback}",
  },
  fontWeights: {
    normal: ${charter.fonts.body.weight === "normal" ? 400 : 700},
    bold: ${charter.fonts.heading.weight === "bold" ? 700 : 400},
  },
  spacing: { xs: 8, sm: 16, md: 24, lg: 40, xl: 64, xxl: 96 },
  borderRadius: { sm: 4, md: 8, lg: 16, xl: 24 },
  width: ${resolution[0]},
  height: ${resolution[1]},
  fps: ${fps},
} as const;

export const heatmapColors = [
  "${charter.colors.backgroundAlt || "#F5F5F5"}",
  "${adjustColor(charter.colors.primary, 60)}",
  "${adjustColor(charter.colors.primary, 40)}",
  "${adjustColor(charter.colors.primary, 20)}",
  "${charter.colors.primary}",
  "${adjustColor(charter.colors.primary, -10)}",
] as const;
`;

fs.writeFileSync(path.join(skillDir, "src", "theme.ts"), theme);
console.log(`✓ Generated src/theme.ts from ${charterPath}`);

// --- Helpers ---

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function adjustColor(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const factor = amount / 100;
  if (amount > 0) {
    return rgbToHex(r + (255 - r) * factor, g + (255 - g) * factor, b + (255 - b) * factor);
  }
  return rgbToHex(r * (1 + factor), g * (1 + factor), b * (1 + factor));
}

function darken(hex, amount) {
  return adjustColor(hex, -amount);
}
