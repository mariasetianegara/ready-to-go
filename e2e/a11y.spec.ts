import { test, expect } from '@playwright/test';
import { PACKING_ITEMS } from '../src/data/items';

const N = PACKING_ITEMS.length;
const URL = '/ready-to-go/';

// US-8: Accessibility. The focus-ring appearance (the other half of TC-8.1)
// lives in focus-ring.spec.ts.

test('Tab moves focus through cards in DOM order (TC-8.1)', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'), 'keyboard navigation is a desktop concern');
  await page.goto(URL);
  // Reset is disabled at 0/N (not focusable), so the first Tab lands on card 0.
  await page.keyboard.press('Tab');
  await expect(page.locator('.card').nth(0)).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('.card').nth(1)).toBeFocused();
});

test('Space toggles a focused card and updates the counter (TC-8.2)', async ({ page }) => {
  await page.goto(URL);
  const first = page.locator('.card').first();
  await first.focus();
  await expect(first).toHaveAttribute('aria-pressed', 'false');
  await page.keyboard.press('Space');
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.counter')).toContainText(`1 / ${N} packed`);
});

test('Enter toggles a focused card and updates the counter (TC-8.3)', async ({ page }) => {
  await page.goto(URL);
  const first = page.locator('.card').first();
  await first.focus();
  await page.keyboard.press('Enter');
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.counter')).toContainText(`1 / ${N} packed`);
});

test('aria-pressed reflects packed state (TC-8.4)', async ({ page }) => {
  await page.goto(URL);
  const passport = page.getByRole('button', { name: /Passport/ });
  await expect(passport).toHaveAttribute('aria-pressed', 'false');
  await passport.click();
  await expect(passport).toHaveAttribute('aria-pressed', 'true');
});

test('aria-label describes the card and its state (TC-8.5)', async ({ page }) => {
  await page.goto(URL);
  const passport = page.getByRole('button', { name: /Passport/ });
  await expect(passport).toHaveAttribute('aria-label', 'Passport — to pack');
  await passport.click();
  await expect(passport).toHaveAttribute('aria-label', 'Passport — packed');
});

test('prefers-reduced-motion collapses the flip animation (TC-8.6)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(URL);
  const first = page.locator('.card').first();

  // The flip lives on the faces (two-phase scaleX). Both its duration AND its
  // second-half delay must collapse, or reduced-motion users would wait 210ms
  // for the new face to appear.
  const t = await first.locator('.face.front').evaluate((el) => {
    const s = getComputedStyle(el);
    return { durations: s.transitionDuration, delays: s.transitionDelay };
  });
  const toSeconds = (v: string) =>
    v.trim().endsWith('ms') ? parseFloat(v) / 1000 : parseFloat(v);
  for (const d of t.durations.split(',')) expect(toSeconds(d)).toBeLessThan(0.05);
  for (const d of t.delays.split(',')) expect(toSeconds(d)).toBeLessThan(0.05);

  // Packing still works, just without the animation.
  await first.click();
  await expect(first).toHaveAttribute('aria-pressed', 'true');
});
