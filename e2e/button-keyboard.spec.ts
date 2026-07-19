import { test, expect, type Page } from '@playwright/test';
import { PACKING_ITEMS } from '../src/data/items';

const N = PACKING_ITEMS.length;
const URL = '/ready-to-go/';
const ALL_IDS = PACKING_ITEMS.map((i) => i.id);

async function seedPacked(page: Page, ids: string[]) {
  await page.addInitScript(
    (data) => localStorage.setItem(data.key, data.value),
    { key: 'packing.v1.packed', value: JSON.stringify(ids) },
  );
}

// Regression guard for the auto-repeat fix: the key-repeat guard must NOT break
// normal Enter activation of the buttons. (The held-key spam itself isn't
// E2E-simulable — that's covered by the ignoreKeyRepeat unit test.)

test('Enter activates Reset (opens the dialog)', async ({ page }) => {
  await page.goto(URL);
  await page.locator('.card').first().click(); // enable Reset
  await page.getByRole('button', { name: 'Reset' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('Enter activates Cancel (closes the dialog, keeps progress)', async ({ page }) => {
  await page.goto(URL);
  await page.locator('.card').first().click();
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.counter')).toContainText(`1 / ${N} packed`);
});

test('Enter activates Yes (clears progress)', async ({ page }) => {
  await page.goto(URL);
  await page.locator('.card').first().click();
  await page.getByRole('button', { name: 'Reset' }).click();
  await page.getByRole('button', { name: 'Yes' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.counter')).toContainText(`0 / ${N} packed`);
});

test('Enter activates Close (closes the celebration)', async ({ page }) => {
  await seedPacked(page, ALL_IDS.slice(0, -1)); // all but the last
  await page.goto(URL);
  await page.locator('.card').last().click(); // pack the last → celebration
  await page.getByRole('button', { name: 'Close' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.celebrate')).toHaveCount(0);
});
