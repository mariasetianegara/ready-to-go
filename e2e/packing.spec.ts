import { test, expect } from '@playwright/test';
import { PACKING_ITEMS } from '../src/data/items';

const N = PACKING_ITEMS.length; // data-driven, not hardcoded

test.beforeEach(async ({ page }) => {
  await page.goto('/ready-to-go/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('renders a card for every item (TC-1.1)', async ({ page }) => {
  await expect(page.locator('.card')).toHaveCount(N);
  await expect(page.getByRole('button', { name: 'Passport' })).toBeVisible();
  await expect(page.locator('svg.illu').first()).toBeVisible();
});

test('counter at 0 / N and progress bar present on load (TC-4.1, TC-4.3)', async ({ page }) => {
  await expect(page.locator('.counter')).toContainText(`0 / ${N} packed`);
  await expect(page.locator('.progress')).toBeVisible();
});

test('pack then unpack updates state + counter (TC-2.1, 2.3, 3.1, 3.2)', async ({ page }) => {
  const card = page.getByRole('button', { name: 'Passport' });
  await expect(card).toHaveAttribute('aria-pressed', 'false');
  await card.click();
  await expect(card).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.counter')).toContainText(`1 / ${N} packed`);
  await card.click();
  await expect(card).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.counter')).toContainText(`0 / ${N} packed`);
});

test('progress bar reflects the packed ratio (TC-2.4)', async ({ page }) => {
  await page.getByRole('button', { name: 'Passport' }).click();
  const width = await page
    .locator('.progress > span')
    .evaluate((el) => (el as HTMLElement).style.width);
  expect(width).toBe(`${(1 / N) * 100}%`);
});

test('no dialog appears when unpacking (TC-3.3)', async ({ page }) => {
  const card = page.getByRole('button', { name: 'Passport' });
  await card.click();
  await card.click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('header stays visible when scrolled (TC-4.2)', async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, 800));
  await expect(page.locator('.header')).toBeInViewport();
});
