import { test, expect } from '@playwright/test';

// Locks in the cross-platform favicon set so iOS support can't silently regress.
// (Whether iOS actually paints the icon is browser-chrome behavior — verified manually.)
test('favicon links present for all platforms, and the apple-touch-icon loads', async ({ page }) => {
  await page.goto('/ready-to-go/');

  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveCount(1);
  await expect(page.locator('link[rel="icon"][type="image/png"]')).toHaveCount(1);

  const apple = page.locator('link[rel="apple-touch-icon"]');
  await expect(apple).toHaveCount(1);

  // The iOS-critical PNG must actually be served at its resolved path.
  const href = await apple.getAttribute('href');
  const resp = await page.request.get(new URL(href!, page.url()).toString());
  expect(resp.ok()).toBeTruthy();
});
