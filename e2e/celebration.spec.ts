import { test, expect, type Page } from '@playwright/test';
import { PACKING_ITEMS } from '../src/data/items';

const N = PACKING_ITEMS.length;
const URL = '/ready-to-go/';
const ALL_IDS = PACKING_ITEMS.map((i) => i.id);

// Seed localStorage before the app boots so we control the starting state.
// (.card #0 maps to PACKING_ITEMS[0]; seeding ALL_IDS.slice(1) leaves exactly
// that first card unpacked, so one click crosses the list into all-packed.)
async function seedPacked(page: Page, ids: string[]) {
  await page.addInitScript(
    (data) => localStorage.setItem(data.key, data.value),
    { key: 'packing.v1.packed', value: JSON.stringify(ids) },
  );
}

test('packing the final item fires the celebration (TC-7.1)', async ({ page }) => {
  await seedPacked(page, ALL_IDS.slice(1));
  await page.goto(URL);
  await expect(page.locator('.celebrate')).toHaveCount(0); // not yet (D11)

  await page.locator('.card').first().click();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Bon voyage/ })).toBeVisible();
});

test('opening already at N/N does NOT celebrate (TC-7.2)', async ({ page }) => {
  await seedPacked(page, ALL_IDS);
  await page.goto(URL);
  await expect(page.locator('.counter')).toContainText(`${N} / ${N} packed`);
  await expect(page.getByRole('button', { name: 'Close' })).toHaveCount(0);
});

test('the celebration is blocking — cards behind it cannot be toggled (TC-7.3)', async ({ page }) => {
  await seedPacked(page, ALL_IDS.slice(1));
  await page.goto(URL);
  await page.locator('.card').first().click();
  await expect(page.locator('.celebrate')).toBeVisible();

  // A normal click on a card is intercepted by the full-viewport overlay.
  let intercepted = false;
  try {
    await page.locator('.card').nth(1).click({ timeout: 1500 });
  } catch {
    intercepted = true;
  }
  expect(intercepted).toBe(true);
  await expect(page.locator('.counter')).toContainText(`${N} / ${N} packed`); // unchanged
  await expect(page.locator('.celebrate')).toBeVisible(); // still up
});

test('Close dismisses, keeps progress, and lets interaction resume (TC-7.4)', async ({ page }) => {
  await seedPacked(page, ALL_IDS.slice(1));
  await page.goto(URL);
  await page.locator('.card').first().click();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();

  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.locator('.celebrate')).toHaveCount(0);
  await expect(page.locator('.counter')).toContainText(`${N} / ${N} packed`); // progress kept

  // After dismiss, a card un-packs normally.
  await page.locator('.card').first().click();
  await expect(page.locator('.counter')).toContainText(`${N - 1} / ${N} packed`);
});

test('re-fires on a fresh <N→N crossing after a dismiss (G1)', async ({ page }) => {
  await seedPacked(page, ALL_IDS.slice(1));
  await page.goto(URL);
  await page.locator('.card').first().click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.locator('.celebrate')).toHaveCount(0);

  await page.locator('.card').first().click(); // unpack -> N-1
  await expect(page.locator('.counter')).toContainText(`${N - 1} / ${N} packed`);
  await page.locator('.card').first().click(); // repack -> N again
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
});
