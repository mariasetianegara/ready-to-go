import { test, expect, type Page } from '@playwright/test';
import { PACKING_ITEMS } from '../src/data/items';

const URL = '/ready-to-go/';
const ALL_IDS = PACKING_ITEMS.map((i) => i.id);

async function seedPacked(page: Page, ids: string[]) {
  await page.addInitScript(
    (data) => localStorage.setItem(data.key, data.value),
    { key: 'packing.v1.packed', value: JSON.stringify(ids) },
  );
}

// Background scroll lock is a desktop/pointer concern here; mobile devices have
// a fixed emulated viewport and use touch, so skip them (verified on-device).
test('reset modal locks background scroll and restores position on close', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'), 'desktop scroll concern');
  await page.setViewportSize({ width: 500, height: 600 }); // tall, scrollable
  await page.goto(URL);
  await page.locator('.card').first().click(); // pack one so Reset is enabled
  await page.evaluate(() => window.scrollTo(0, 250));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0); // wait for scroll to apply
  const before = await page.evaluate(() => window.scrollY);

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).position)).toBe('fixed'); // pinned
  await page.mouse.wheel(0, 400);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0); // can't scroll while pinned

  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  // restored (±1px — browsers round scroll position differently)
  await expect
    .poll(() => page.evaluate((b) => Math.abs(window.scrollY - b), before))
    .toBeLessThanOrEqual(1);
});

test('celebration locks background scroll and restores position on close', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'), 'desktop scroll concern');
  await seedPacked(page, ALL_IDS.slice(0, -1)); // all but the last item
  await page.setViewportSize({ width: 500, height: 600 });
  await page.goto(URL);
  const lastCard = page.locator('.card').last();
  await lastCard.scrollIntoViewIfNeeded(); // deterministic scroll to the bottom card (settles WebKit)
  const before = await page.evaluate(() => window.scrollY);
  expect(before).toBeGreaterThan(0);

  await lastCard.click(); // already in view → packs the last item → celebration
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).position)).toBe('fixed'); // pinned
  await page.mouse.wheel(0, -400);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.locator('.celebrate')).toHaveCount(0);
  // restored (±1px — browsers round scroll position differently)
  await expect
    .poll(() => page.evaluate((b) => Math.abs(window.scrollY - b), before))
    .toBeLessThanOrEqual(1);
});

test('opening a dialog does not shift page content sideways (scrollbar compensation)', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'), 'desktop scrollbar concern');
  // Viewport wider than the grid's max-width so it's centered (a shift would
  // move it), and tall enough that the page scrolls (so a scrollbar exists).
  await page.setViewportSize({ width: 1300, height: 600 });
  await page.goto(URL);
  const card = page.locator('.card').first();
  await card.click(); // enable Reset
  const before = (await card.boundingBox())!.x;

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const during = (await card.boundingBox())!.x;
  expect(Math.abs(during - before)).toBeLessThanOrEqual(1); // content didn't move sideways
});
