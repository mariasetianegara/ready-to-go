import { test, expect } from '@playwright/test';

const URL = '/ready-to-go/';
const BLUSH = 'rgb(225, 164, 168)'; // --blush #e1a4a8

// Keyboard users must see an on-brand focus ring (--blush), not the UA's black
// outline. On cards the ring is an INSET box-shadow painted on the faces (an
// outline around the aspect-ratio wrapper could show a hairline gap + uneven
// stroke at fractional heights / display scalings — see styles.css). This is a
// desktop/keyboard concern, so it's skipped on mobile.
test('keyboard Tab draws the inset blush focus ring on a card, both faces', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'), 'keyboard focus is a desktop concern');

  await page.goto(URL);

  // Tab into the page until a card receives focus (the header's only button is
  // disabled at 0/N, so this lands on the first card quickly).
  let onCard = false;
  for (let i = 0; i < 5 && !onCard; i++) {
    await page.keyboard.press('Tab');
    onCard = await page.evaluate(() => document.activeElement?.classList.contains('card') ?? false);
  }
  expect(onCard).toBe(true);

  const ring = await page.evaluate(() => {
    const card = document.activeElement as HTMLElement;
    const face = card.querySelector<HTMLElement>('.face.front')!;
    return {
      cardOutline: getComputedStyle(card).outlineStyle, // no outline — the ring is inset
      faceShadow: getComputedStyle(face).boxShadow,
    };
  });
  expect(ring.cardOutline).toBe('none');
  expect(ring.faceShadow).toContain('inset');
  expect(ring.faceShadow).toContain('2px');
  expect(ring.faceShadow).toContain(BLUSH);

  // The packed (back) face carries the same ring — pack the focused card and
  // re-check, since that face renders rotated on the flip layer.
  await page.keyboard.press('Space');
  await expect(page.locator('.card').first()).toHaveAttribute('aria-pressed', 'true');
  const backShadow = await page.evaluate(() => {
    const card = document.activeElement as HTMLElement;
    const back = card.querySelector<HTMLElement>('.face.back')!;
    return getComputedStyle(back).boxShadow;
  });
  expect(backShadow).toContain('inset');
  expect(backShadow).toContain(BLUSH);
});
