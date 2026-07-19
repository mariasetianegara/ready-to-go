# Test Cases — Ready to Go

Test cases derived from user stories. Drives TDD: write these as Playwright (E2E) or Vitest (unit) tests *before* implementing the corresponding feature.

## Conventions
- **[E2E]** = Playwright test against the running app
- **[Unit]** = Vitest test against a pure function or hook
- Each test references the User Story it validates
- Tests should be data-driven from `items.ts`, not hardcoded to N=40

---

## US-1: See what to pack

### TC-1.1 [E2E] — All items render on load
**Given** the app is loaded with `items.ts` containing N items,
**When** the page finishes loading,
**Then** N cards are visible in the DOM, each with the correct name and SVG illustration.

### TC-1.2 [E2E] — Layout responds to viewport
**Given** the app is loaded,
**When** viewport width is set to 360px / 600px / 900px / 1200px,
**Then** the grid shows 2 / 3 / 4 / 5 columns respectively, with no horizontal scroll.

### TC-1.3 [Unit] — Items module loads from data file
**Given** `items.ts` is the source of truth,
**When** the items module is imported,
**Then** it returns an array, every entry has `id`, `label`, `illu` fields, and all `id`s are unique.

---

## US-2: Mark an item as packed

### TC-2.1 [E2E] — Tapping unpacked card flips it
**Given** an unpacked card is visible,
**When** the user clicks/taps it,
**Then** the card flips and shows the packed state ("Packed ✓" badge visible, illustration dimmed, item name still visible).

### TC-2.2 [E2E] — Packed state is visually distinct
**Given** a card is in the packed state,
**Then** its background uses `--packed-bg` and the "Packed ✓" sage pill is rendered top-right.

### TC-2.3 [E2E] — Counter increments on pack
**Given** the counter shows "0 / N packed",
**When** the user packs one item,
**Then** the counter shows "1 / N packed".

### TC-2.4 [E2E] — Progress bar reflects ratio
**Given** k items packed out of N,
**Then** the progress bar fill width is `(k / N) * 100%` (within a 1% tolerance for sub-pixel rounding).

---

## US-3: Unpack an item

### TC-3.1 [E2E] — Tapping packed card flips it back
**Given** a card is in the packed state,
**When** the user clicks/taps it,
**Then** the card flips back to the unpacked state.

### TC-3.2 [E2E] — Counter decrements on unpack
**Given** k items are packed (k ≥ 1) and the counter shows "k / N packed",
**When** the user unpacks one item,
**Then** the counter shows "k−1 / N packed".

### TC-3.3 [E2E] — No confirmation dialog on unpack
**Given** a card is in the packed state,
**When** the user taps it,
**Then** no modal/dialog appears; the flip happens immediately.

---

## US-4: See progress

### TC-4.1 [E2E] — Counter and progress bar visible on initial load
**Given** the page loads,
**Then** a counter element is in the DOM with text matching "X / N packed", and a progress bar is in the DOM.

### TC-4.2 [E2E] — Header sticky on scroll
**Given** the page has scrollable content,
**When** the user scrolls down,
**Then** the header (with counter and progress bar) remains visible at the top of the viewport.

### TC-4.3 [E2E] — Counter total matches data file
**Given** `items.ts` contains N items,
**Then** the counter shows "0 / N packed" on first load (no localStorage).

### TC-4.4 [Unit] — Counter computes from state
**Given** a state Set with k items marked packed out of N total,
**Then** the counter component renders "k / N packed".

---

## US-5: Survive a page reload

### TC-5.1 [E2E] — Packed state persists across reload
**Given** the user packs items A and B,
**When** the page is reloaded,
**Then** items A and B are still shown as packed, and the counter reflects "2 / N packed".

### TC-5.2 [E2E] — No flicker of unpacked state on reload
**Given** items are saved as packed in localStorage,
**When** the page loads,
**Then** packed items render in packed state on first paint (no visible flicker from unpacked → packed).

### TC-5.3 [Unit] — localStorage hook reads existing state
**Given** localStorage `packing.v1.packed` contains `["passport","toothbrush"]`,
**When** the persistence hook initializes,
**Then** it returns a Set containing exactly those two ids.

### TC-5.4 [Unit] — localStorage hook handles missing data
**Given** localStorage is empty,
**When** the persistence hook initializes,
**Then** it returns an empty Set (no errors thrown).

### TC-5.5 [Unit] — Orphaned localStorage state is ignored
**Given** localStorage contains an id that no longer exists in `items.ts`,
**When** the hook resolves state,
**Then** the orphaned id is filtered out and no error is shown to the user.

### TC-5.6 [Unit] — New items default to unpacked
**Given** `items.ts` contains a new id not present in localStorage,
**When** the hook resolves state,
**Then** the new item appears as unpacked.

### TC-5.7 [Unit] — Invalid JSON in localStorage is handled
**Given** localStorage `packing.v1.packed` contains malformed JSON,
**When** the hook initializes,
**Then** it falls back to an empty Set and does not crash the app.

### TC-5.8 [E2E] — Works when localStorage is unavailable
**Given** localStorage is disabled (private mode quirk simulated),
**When** the app loads,
**Then** the app still renders and is usable, even if persistence is degraded.

---

## US-6: Reset for the next trip

### TC-6.1 [E2E] — Reset button visible in header
**Given** the page is loaded,
**Then** a "Reset" button is visible in the header.

### TC-6.2 [E2E] — Reset button disabled at 0/N
**Given** count = 0,
**Then** the "Reset" button has reduced opacity and clicking it does not open the modal.

### TC-6.3 [E2E] — Reset button enabled when count > 0
**Given** at least one item is packed,
**Then** the "Reset" button is interactive and tapping it opens the modal.

### TC-6.4 [E2E] — Reset modal content
**Given** the user opens the modal,
**Then** it contains "Really reset everything?" as title, "You'll restart from scratch." as body, and "Cancel" + "Yes" buttons.

### TC-6.5 [E2E] — Confirming reset clears all packed state
**Given** several items are packed,
**When** the user confirms (Yes),
**Then** all cards return to unpacked, the counter shows "0 / N packed", and the modal closes.

### TC-6.6 [E2E] — Cancelling reset preserves progress (Cancel button)
**Given** the user is in the reset confirmation modal with k items packed (k ≥ 1),
**When** the user taps "Cancel",
**Then** the modal closes and all k items remain packed.

### TC-6.7 [E2E] — Esc key dismisses modal without resetting
**Given** the user has the reset modal open,
**When** the user presses Esc,
**Then** the modal closes with no state change.

### TC-6.8 [E2E] — Scrim click dismisses modal without resetting
**Given** the user has the reset modal open,
**When** the user clicks on the scrim (outside the modal),
**Then** the modal closes with no state change.

### TC-6.9 [E2E] — Reset clears localStorage
**Given** the user confirms a reset,
**When** the page is reloaded,
**Then** all items are unpacked (state was actually cleared, not just visually reset).

---

## US-7: Feel good when done

### TC-7.1 [E2E] — Celebration triggers at N/N
**Given** N-1 items are already packed,
**When** the user packs the last item,
**Then** the celebration overlay appears with 🧳, "Bon voyage!", "Everything's in the suitcase.", a "Close" button, and confetti animation.

### TC-7.2 [E2E] — Celebration does NOT trigger on load at N/N
**Given** all N items are already packed in localStorage,
**When** the page is freshly loaded,
**Then** no celebration appears.

### TC-7.3 [E2E] — Celebration is blocking
**Given** the celebration is showing,
**When** the user taps a card behind the overlay,
**Then** nothing happens — the overlay blocks interaction; only "Close" dismisses it.

### TC-7.4 [E2E] — Close button dismisses celebration
**Given** the celebration is showing,
**When** the user clicks "Close",
**Then** the celebration disappears (and items remain packed).

---

## US-8: Accessibility

### TC-8.1 [E2E] — Cards are keyboard-focusable
**Given** the page is loaded,
**When** the user presses Tab,
**Then** focus moves through cards in DOM order with a visible focus ring.

### TC-8.2 [E2E] — Space toggles packed state on focused card
**Given** an unpacked card has focus,
**When** the user presses Space,
**Then** the card transitions to packed state and the counter increments.

### TC-8.3 [E2E] — Enter toggles packed state on focused card
**Given** an unpacked card has focus,
**When** the user presses Enter,
**Then** the card transitions to packed state and the counter increments.

### TC-8.4 [E2E] — aria-pressed reflects packed state
**Given** a card,
**Then** `aria-pressed="false"` when unpacked and `aria-pressed="true"` when packed.

### TC-8.5 [E2E] — aria-label describes the card
**Given** a card for "Passport",
**Then** the `aria-label` includes the item name and packed state ("Passport — packed" / "Passport — to pack").

### TC-8.6 [E2E] — prefers-reduced-motion collapses animations
**Given** the browser is configured with `prefers-reduced-motion: reduce`,
**When** the user packs a card,
**Then** the card transitions to packed state with ~0ms animation (no visible flip).

---

## Non-functional / regression

### TC-NF.1 [E2E] — All copy is English
**Given** the page is loaded,
**Then** the document declares `lang="en"`, the title and heading read "Ready to Go", the counter matches "X / N packed", the "Reset" button is visible, and every card's aria-label carries the English state suffix ("— to pack" / "— packed").

### TC-NF.2 [E2E] — No console errors on happy path
**Given** the user packs all items, sees the celebration, dismisses it, resets, and reloads,
**Then** no errors are logged to the browser console.

### TC-NF.3 [E2E] — Adding/removing items from data file works without code changes
**Given** `items.ts` is updated to add or remove an item,
**When** the build/deploy is rerun,
**Then** the app renders correctly and the counter denominator updates automatically.
