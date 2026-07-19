import { test, expect } from '@playwright/test';

// Pipeline smoke test — the page is served at the project base path with the
// right title and a visible top-level heading. True for the walking skeleton
// and for the full app alike.
test('the app serves at the base path with its title and heading', async ({ page }) => {
  await page.goto('/ready-to-go/');
  await expect(page).toHaveTitle('Ready to Go');
  await expect(page.getByRole('heading', { level: 1, name: 'Ready to Go' })).toBeVisible();
});
