import { test, expect } from '@playwright/test';
import { PACKING_ITEMS } from '../src/data/items';

const N = PACKING_ITEMS.length;
const URL = '/ready-to-go/';

test('packed items survive a reload (TC-5.1)', async ({ page }) => {
  await page.goto(URL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.getByRole('button', { name: 'Passport' }).click();
  await page.getByRole('button', { name: 'Keys' }).click();
  await expect(page.locator('.counter')).toContainText(`2 / ${N} packed`);

  await page.reload();
  await expect(page.getByRole('button', { name: 'Passport' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Keys' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.counter')).toContainText(`2 / ${N} packed`);
});

test('packed cards render packed on first paint after reload (TC-5.2)', async ({ page }) => {
  await page.goto(URL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.getByRole('button', { name: 'Passport' }).click();
  await page.reload();
  // Lazy synchronous init => the card is already packed on first paint (no unpacked flash).
  await expect(page.getByRole('button', { name: 'Passport' })).toHaveAttribute('aria-pressed', 'true');
});

test('app still renders and works when localStorage is unavailable (TC-5.8)', async ({ page }) => {
  // Simulate a private-mode quirk where localStorage throws.
  await page.addInitScript(() => {
    const blocked = () => {
      throw new Error('localStorage blocked');
    };
    Storage.prototype.getItem = blocked;
    Storage.prototype.setItem = blocked;
  });
  await page.goto(URL);

  await expect(page.locator('.card')).toHaveCount(N);
  await expect(page.locator('.counter')).toContainText(`0 / ${N} packed`);
  // In-session packing still works (just not persisted).
  await page.getByRole('button', { name: 'Passport' }).click();
  await expect(page.locator('.counter')).toContainText(`1 / ${N} packed`);
});
