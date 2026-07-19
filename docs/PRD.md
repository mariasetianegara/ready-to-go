# PRD — Ready to Go (Packing List App)

## Problem
This app has exactly one intended user: a friend who consistently forgets items when packing for trips. They've used a static packing list before and found it useful, but a paper or notes-app list doesn't track what's already in the bag, so they lose their place and forget things last minute anyway.

## User
One user. Singular.
- The friend described above — packs from their phone, probably standing next to a half-open suitcase
- Not a power user; the app should feel obvious

## Maintainer
The maintainer (me) owns the list content and ships updates. The user doesn't edit the list in-app — they ask, and the maintainer updates the data file and redeploys.

## Goal
Help the user pack reliably by showing them the same trusted list every trip, letting them mark items as packed, and surviving the inevitable browser refresh in the middle of packing.

## In Scope (MVP)
- A single screen displaying the items as a grid of cards (title: **"Ready to Go"**)
- The list is **data-driven**, loaded from a separate file (`src/data/items.ts`) — not hardcoded into components
- Counter and progress bar derive their total from the data file (currently 40 items)
- Each card: SVG illustration + item name
- Tap a card → flip animation (~420ms, a two-phase squash) → card shows packed state with grayed-out illustration, item name still visible, and a "Packed ✓" badge
- Tap a packed card → flips back to unpacked
- Sticky header containing:
  - App title "Ready to Go"
  - Counter: "X / N packed" (tabular figures, X bolded)
  - Thin progress bar (6px) showing X/N as a percentage
  - "Reset" button (ghost style; disabled at 0/N)
- Reset confirmation modal: "Really reset everything?" with body "You'll restart from scratch." and Yes / Cancel buttons
- Modal dismisses on: Yes, Cancel, Esc key, or scrim click
- Celebration at 100% packed: confetti (36 pieces) + banner with 🧳 → "Bon voyage!" → "Everything's in the suitcase." → "Close" button
- Celebration triggers **only on the transition** from <N packed to =N packed (not on page load at N/N)
- Celebration is a **blocking** overlay while shown; dismissed on "Close" click only (after dismiss, normal interaction including un-packing resumes)
- localStorage persistence — checks survive page reload on same browser
- Keyboard support: cards are focusable; Space/Enter toggles
- `prefers-reduced-motion: reduce` collapses animations to ~0ms
- Mobile-first responsive design; equally polished on phone and desktop
- All copy in English ("Bon voyage!" is standard English usage and a deliberate choice)
- Hosted on GitHub Pages as a static site

## Out of Scope (v1)
- Editing the packing list from within the app — changes go through the maintainer, who edits the data file and redeploys
- Hierarchical categories or filtering (items are flat; implicit categories exist in `items.ts` as comments only)
- Quantity per item ("3 pairs of socks")
- Per-item notes
- Multi-trip support / multiple lists
- Cross-device sync (single-browser localStorage is fine)
- Accounts, auth, anything backend
- Native mobile app
- Dark mode
- Full accessibility audit (basic keyboard + reduced-motion is included; full WCAG audit is later)

## Success Criteria
1. The user opens the app, sees a list that looks great on their phone, and starts tapping without needing instructions.
2. They can pack a full trip, close the browser, reopen it the next day, and their progress is still there.
3. The visual quality bar is "100% amazing" — polished animations, consistent illustration style, no broken states. Bug-free on first delivery.
4. Equally polished on phone and desktop.
5. They laugh at least once because of the confetti / celebration.

## Constraints
- Static site, no backend, no API calls at runtime
- All copy in English
- Free hosting (GitHub Pages)
- Single-user app — no need to scale, no need for multi-user state
- List length is dynamic — code must not break or look weird if list grows or shrinks
- All 40 illustrations are inline SVG (final hand-drawn art); no raster images, no AI image generation

## Data Model

The packing list lives in `src/data/items.ts`:

```ts
export const PACKING_ITEMS: PackingItem[] = [
  { id: 'passport', label: 'Passport', illu: 'passport' },
  { id: 'toothbrush', label: 'Toothbrush', illu: 'toothbrush' },
  // ...
];
```

- `id` — stable, unique string. Used as the localStorage key reference. Never reuse or rename an id once the app is live.
- `label` — display name shown on the card.
- `illu` — key into the inline SVG illustration library (`src/illustrations/illustrations.tsx`).

To add/remove/rename items, the maintainer edits `items.ts` (and `illustrations.tsx` if a new drawing is needed) and redeploys. No core code changes.

## Persistence

- localStorage key: `packing.v1.packed`
- Value: JSON-stringified array of packed item ids, e.g. `["passport","toothbrush"]`
- Loaded on mount; defaults to empty if absent or invalid
- Saved write-through on every change
- Orphaned ids (in storage but not in `items.ts`) are filtered out gracefully
- New ids (in `items.ts` but not in storage) default to unpacked

## Out-of-Band Process
List changes (add/remove items, change names, swap illustrations) are handled outside the app: the user messages the maintainer; the maintainer updates `items.ts` (and illustrations if needed) and redeploys.
