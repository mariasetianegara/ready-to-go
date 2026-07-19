import type { KeyboardEvent } from 'react';

/**
 * `onKeyDown` guard for native buttons. Browsers fire a button's Enter
 * activation on every keydown, so *holding* Enter spam-clicks it. Cancelling
 * the default action on auto-repeat keydowns (`event.repeat`) stops that, while
 * leaving the first press — and Space (which activates on keyup) — untouched.
 */
export function ignoreKeyRepeat(e: KeyboardEvent): void {
  if (e.repeat) e.preventDefault();
}
