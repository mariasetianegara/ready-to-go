import { test, expect, type Page } from '@playwright/test';
import { PACKING_ITEMS } from '../src/data/items';

const N = PACKING_ITEMS.length;
const URL = '/ready-to-go/';

test.beforeEach(async ({ page }) => {
  await page.goto(URL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

async function packTwoThenOpenReset(page: Page) {
  await page.getByRole('button', { name: 'Passport' }).click();
  await page.getByRole('button', { name: 'Keys' }).click();
  await expect(page.locator('.counter')).toContainText(`2 / ${N} packed`);
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
}

test('Reset opens the dialog with the right content (TC-6.3, 6.4)', async ({ page }) => {
  await packTwoThenOpenReset(page);
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Really reset everything?');
  await expect(dialog).toContainText("You'll restart from scratch.");
  await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Yes' })).toBeVisible();
});

test('Yes clears everything and closes (TC-6.5)', async ({ page }) => {
  await packTwoThenOpenReset(page);
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.counter')).toContainText(`0 / ${N} packed`);
});

test('Cancel closes and keeps progress (TC-6.6)', async ({ page }) => {
  await packTwoThenOpenReset(page);
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.counter')).toContainText(`2 / ${N} packed`);
});

test('Esc closes and keeps progress (TC-6.7)', async ({ page }) => {
  await packTwoThenOpenReset(page);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.counter')).toContainText(`2 / ${N} packed`);
});

test('scrim click closes and keeps progress (TC-6.8)', async ({ page }) => {
  await packTwoThenOpenReset(page);
  await page.locator('.scrim').click({ position: { x: 5, y: 5 } }); // outside the card
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.counter')).toContainText(`2 / ${N} packed`);
});

test('a confirmed reset persists after reload (TC-6.9)', async ({ page }) => {
  await packTwoThenOpenReset(page);
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.locator('.counter')).toContainText(`0 / ${N} packed`);
  await page.reload();
  await expect(page.locator('.counter')).toContainText(`0 / ${N} packed`);
});
