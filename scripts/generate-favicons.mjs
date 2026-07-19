// Rasterizes the suitcase emoji into PNG favicons.
// iOS browsers don't reliably render emoji SVG favicons, so we ship PNG
// companions (a 32px favicon + a 180px apple-touch-icon) alongside favicon.svg.
// Run: node scripts/generate-favicons.mjs
import { chromium } from '@playwright/test';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const targets = [
  { file: 'public/favicon-32.png', size: 32, bg: 'transparent' },
  { file: 'public/apple-touch-icon.png', size: 180, bg: '#f1ede4' }, // opaque for iOS
];

const browser = await chromium.launch();
try {
  for (const { file, size, bg } of targets) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(
      `<!doctype html><meta charset="utf-8"><body style="margin:0;width:${size}px;height:${size}px;` +
        `display:flex;align-items:center;justify-content:center;background:${bg};` +
        `font-size:${Math.round(size * 0.78)}px;line-height:1">🧳</body>`,
    );
    await page.screenshot({ path: join(root, file), omitBackground: bg === 'transparent' });
    await page.close();
    console.log(`wrote ${file} (${size}x${size})`);
  }
} finally {
  await browser.close();
}
