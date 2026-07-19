import { test, expect } from '@playwright/test';

const URL = '/ready-to-go/';

// TC-1.2 — the grid column count tracks the viewport width, with no horizontal
// scroll at any size. Viewport-resize is a desktop concern, so skip mobile
// device projects (their viewport is fixed to the emulated device).
const CASES = [
  { width: 360, cols: 2 },
  { width: 600, cols: 3 },
  { width: 900, cols: 4 },
  { width: 1200, cols: 5 },
];

for (const { width, cols } of CASES) {
  test(`grid shows ${cols} columns at ${width}px with no horizontal scroll (TC-1.2)`, async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name.startsWith('mobile'), 'viewport resize is a desktop concern');

    await page.setViewportSize({ width, height: 800 });
    await page.goto(URL);

    const trackCount = await page
      .locator('.grid')
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(trackCount).toBe(cols);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1); // allow sub-pixel rounding
  });
}
