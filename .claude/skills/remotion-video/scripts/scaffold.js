#!/usr/bin/env node
/**
 * Scaffold a new Remotion video project with optional brand integration.
 *
 * Usage:
 *   node .claude/skills/remotion-video/scripts/scaffold.js workspace/my-video
 *   node .claude/skills/remotion-video/scripts/scaffold.js workspace/my-video --company dukestrategies
 *
 * Company discovery:
 *   - If --company is provided, use that company's brand data
 *   - If only one company exists in client-data/clients/ (excluding _example), use it
 *   - Otherwise, scaffold a generic (unbranded) project
 *
 * Creates:
 *   workspace/my-video/
 *   ├── package.json
 *   ├── tsconfig.json
 *   ├── remotion.config.ts
 *   ├── .remotion-project       (marker file for workspace conventions)
 *   ├── public/                 (logo assets if branded)
 *   └── src/
 *       ├── Root.tsx
 *       ├── theme.ts            (generated from charter.json or generic defaults)
 *       ├── lib/
 *       │   └── animations.ts
 *       ├── components/         (branded, animations, diagrams, charts)
 *       └── scenes/             (empty, ready for your scenes)
 */

const fs = require("fs");
const path = require("path");

// --- Parse arguments ---
const args = process.argv.slice(2);
const targetDir = args.find((a) => !a.startsWith("--"));
const companyFlag = args.indexOf("--company");
const companyArg = companyFlag !== -1 ? args[companyFlag + 1] : null;

if (!targetDir) {
  console.error("Usage: node scaffold.js <target-dir> [--company <name>]");
  process.exit(1);
}

const skillDir = path.resolve(__dirname, "..");
const repoRoot = path.resolve(skillDir, "../..");
const companiesDir = path.join(repoRoot, ".claude", "companies");
const absTarget = path.resolve(targetDir);

// --- Discover company ---
function discoverCompany() {
  if (companyArg) return companyArg;
  if (!fs.existsSync(companiesDir)) return null;
  const companies = fs
    .readdirSync(companiesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "_example")
    .map((d) => d.name);
  if (companies.length === 1) return companies[0];
  return null;
}

const company = discoverCompany();
const brandDir = company ? path.join(companiesDir, company, "brand") : null;
const charterPath = brandDir ? path.join(brandDir, "charter.json") : null;
const hasCharter = charterPath && fs.existsSync(charterPath);

if (company) {
  console.log(`\n→ Brand: ${company}${hasCharter ? "" : " (no charter.json found, using defaults)"}`);
} else {
  console.log("\n→ No company detected — scaffolding generic (unbranded) project");
}

// --- Create directories ---
const dirs = [
  "",
  "public",
  "src",
  "src/lib",
  "src/components/branded",
  "src/components/animations",
  "src/components/diagrams",
  "src/components/charts",
  "src/scenes",
  "out",
];
dirs.forEach((d) => fs.mkdirSync(path.join(absTarget, d), { recursive: true }));

// --- Write .remotion-project marker ---
fs.writeFileSync(path.join(absTarget, ".remotion-project"), `company=${company || ""}\n`);

// --- Copy logo assets to public/ (if branded) ---
if (brandDir) {
  ["logo.png", "logo_white.png", "logo_grey.svg", "logo.svg"].forEach((f) => {
    const src = path.join(brandDir, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(absTarget, "public", f));
    }
  });
}

// --- Copy src/ tree from skill ---
function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const s = path.join(srcDir, entry.name);
    const d = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}
copyDir(path.join(skillDir, "src"), path.join(absTarget, "src"));

// --- Generate theme.ts from charter or defaults ---
if (hasCharter) {
  const charter = JSON.parse(fs.readFileSync(charterPath, "utf-8"));
  const videoSettings = charter.video || {};
  const resolution = (videoSettings.resolution || "1920x1080").split("x").map(Number);
  const fps = videoSettings.fps || 30;

  const themeContent = `// Auto-generated from ${company}/charter.json — do not edit manually.
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
  fs.writeFileSync(path.join(absTarget, "src", "theme.ts"), themeContent);
} else {
  const themeContent = `// Generic theme — no company brand data found.
// To brand this project, create client-data/clients/<name>/charter.json
// then run: node .claude/skills/remotion-video/scripts/sync-from-charter.js --company <name>

export const theme = {
  colors: {
    primary: "#3B82F6",
    primaryDark: "#2563EB",
    primaryLight: "#60A5FA",
    secondary: "#E5E7EB",
    text: "#374151",
    textDark: "#1F2937",
    background: "#FFFFFF",
    backgroundAlt: "#F9FAFB",
    white: "#FFFFFF",
    black: "#111827",
    success: "#10B981",
    warning: "#F59E0B",
    info: "#3B82F6",
    gradientStart: "#60A5FA",
    gradientEnd: "#2563EB",
  },
  fonts: {
    heading: "system-ui, -apple-system, sans-serif",
    body: "system-ui, -apple-system, sans-serif",
  },
  fontWeights: { normal: 400, bold: 700 },
  spacing: { xs: 8, sm: 16, md: 24, lg: 40, xl: 64, xxl: 96 },
  borderRadius: { sm: 4, md: 8, lg: 16, xl: 24 },
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

export const heatmapColors = [
  "#F9FAFB", "#DBEAFE", "#BFDBFE", "#93C5FD", "#3B82F6", "#2563EB",
] as const;
`;
  fs.writeFileSync(path.join(absTarget, "src", "theme.ts"), themeContent);
}

// --- Generate package.json ---
const pkg = {
  name: path.basename(absTarget),
  version: "1.0.0",
  private: true,
  scripts: {
    studio: "remotion studio src/Root.tsx",
    render: `remotion render src/Root.tsx ${toPascalCase(path.basename(absTarget))} out/video.mp4`,
    build: `remotion render src/Root.tsx ${toPascalCase(path.basename(absTarget))} out/video.mp4`,
  },
};
fs.writeFileSync(path.join(absTarget, "package.json"), JSON.stringify(pkg, null, 2) + "\n");

// --- Generate tsconfig.json ---
const tsconfig = {
  compilerOptions: {
    target: "ES2020",
    module: "commonjs",
    lib: ["ES2020", "DOM"],
    jsx: "react-jsx",
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    resolveJsonModule: true,
    outDir: "./dist",
    rootDir: "./src",
  },
  include: ["src/**/*"],
  exclude: ["node_modules", "dist"],
};
fs.writeFileSync(path.join(absTarget, "tsconfig.json"), JSON.stringify(tsconfig, null, 2) + "\n");

// --- Generate remotion.config.ts ---
fs.writeFileSync(
  path.join(absTarget, "remotion.config.ts"),
  `import { Config } from "@remotion/cli/config";\n\nConfig.setVideoImageFormat("jpeg");\nConfig.setOverwriteOutput(true);\n`
);

// --- Generate Root.tsx shell ---
const compositionId = toPascalCase(path.basename(absTarget));
fs.writeFileSync(
  path.join(absTarget, "src", "Root.tsx"),
  `import React from "react";
import { Composition, registerRoot } from "remotion";
import { theme } from "./theme";

// TODO: Import your main video component
// import { MyVideo } from "./MyVideo";

const Placeholder: React.FC = () => (
  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
    backgroundColor: theme.colors.backgroundAlt, fontFamily: theme.fonts.heading, color: theme.colors.text, fontSize: 36 }}>
    Replace me with your video component
  </div>
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="${compositionId}"
        component={Placeholder}
        durationInFrames={150}
        fps={theme.fps}
        width={theme.width}
        height={theme.height}
      />
    </>
  );
};

registerRoot(RemotionRoot);
`
);

console.log(`\n✓ Scaffolded Remotion project at ${absTarget}${company ? ` (branded: ${company})` : " (generic)"}`);
console.log(`\nNext steps:`);
console.log(`  1. Ensure Remotion deps are installed: npm install remotion @remotion/cli @remotion/transitions @remotion/paths`);
console.log(`  2. Create scenes in src/scenes/`);
console.log(`  3. Build your video composition in src/Root.tsx`);
console.log(`  4. Preview: cd ${targetDir} && npx remotion studio src/Root.tsx`);
console.log(`  5. Render:  cd ${targetDir} && npx remotion render src/Root.tsx ${compositionId} out/video.mp4\n`);

// --- Helpers ---

function toPascalCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

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
