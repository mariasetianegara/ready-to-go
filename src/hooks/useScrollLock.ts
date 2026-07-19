import { useLayoutEffect } from 'react';

/**
 * Locks background scroll while `locked` is true, then restores the exact
 * scroll position when it goes false.
 *
 * Pins <body> with `position: fixed` + a negative `top` (instead of plain
 * `overflow: hidden`, which iOS Safari ignores for touch scrolling). The
 * negative top keeps the page visually in place; on unlock we remove the
 * styles and scroll back to where the user was.
 *
 * Removing the scrollbar frees its width and would shift the content sideways
 * on desktop, so we pad the body by the scrollbar's width while locked (0 on
 * mobile overlay scrollbars — a no-op there).
 *
 * Reset modal and celebration are mutually exclusive, so no nested-lock
 * counting is needed.
 */
export function useScrollLock(locked: boolean): void {
  // Layout effect so the lock applies *before* paint — no unlocked frame, and
  // the body is pinned synchronously when the dialog appears.
  useLayoutEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;
    // Width the scrollbar occupies — measured before pinning, while it's still
    // present. 0 when there's no space-taking scrollbar (e.g. mobile overlays).
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    body.style.paddingRight = `${scrollbarWidth}px`; // fill the gap the scrollbar left → no content shift

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
