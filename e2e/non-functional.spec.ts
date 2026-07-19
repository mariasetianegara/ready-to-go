import { test, expect } from '@playwright/test';
import { PACKING_ITEMS } from '../src/data/items';

const N = PACKING_ITEMS.length;
const URL = '/ready-to-go/';

test('all UI copy is English and the document is lang=en (TC-NF.1)', async ({ page }) => {
  await page.goto(URL);

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle('Ready to Go');
  await expect(page.getByRole('heading', { name: 'Ready to Go' })).toBeVisible();
  await expect(page.locator('.counter')).toContainText(`0 / ${N} packed`);
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
  // Every card announces its state with the English aria-label suffix.
  await expect(page.getByRole('button', { name: /— to pack$/ })).toHaveCount(N);
});

test('no console errors across the full happy path (TC-NF.2)', async ({ page }) => {
  // 40 sequential animated card clicks make this the suite's slowest test —
  // webkit under parallel-worker load can exceed the default 30s. Triple it.
  test.slow();
  const problems: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`console.error: ${msg.text()}`);
  });
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));

  await page.goto(URL);

  // Pack everything → celebration.
  const cards = page.locator('.card');
  const count = await cards.count();
  for (let i = 0; i < count; i++) await cards.nth(i).click();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();

  // Dismiss → reset → reload.
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Reset' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.locator('.counter')).toContainText(`0 / ${N} packed`);
  await page.reload();

  expect(problems).toEqual([]);
});
