# User Stories — Ready to Go

All stories are from the perspective of **the user** — the app's single intended user.

The maintainer is out-of-band — the user messages the maintainer when the list needs to change.

## Core Stories

### US-1: See what to pack
**As** the user,
**I want** to see my full packing list as soon as I open the app,
**so that** I don't have to remember what to bring.

**Acceptance:**
- All items from `items.ts` are rendered as cards
- Each item has an SVG illustration + name
- Layout looks great on phone (primary use case) and on desktop
- Number of items is whatever the data file currently contains — no hardcoded count

---

### US-2: Mark an item as packed
**As** the user,
**I want** to tap an item once I've put it in my bag,
**so that** I can see what's left to pack.

**Acceptance:**
- Single tap triggers the flip animation (~420ms)
- Packed state shows: grayed-out illustration, item name still visible, "Packed ✓" sage pill badge top-right
- Animation feels satisfying (not jittery, not too slow)
- Works equally well on touch and mouse

---

### US-3: Unpack an item
**As** the user,
**I want** to tap a packed card to undo it,
**so that** if I made a mistake or removed something, I can fix it.

**Acceptance:**
- Tap on a packed (flipped) card → flips back to unpacked
- Same animation, reversed
- No confirmation dialog (low-stakes action)

---

### US-4: See progress
**As** the user,
**I want** to see how many items I've packed,
**so that** I know how close I am to being done.

**Acceptance:**
- Counter visible at the top of the screen at all times (sticky on scroll)
- Format: "X / N packed" where N is the total number of items in the data file
- A thin progress bar (6px) below the counter visualizes X / N as a percentage
- Both update immediately when an item is packed/unpacked
- Progress bar uses a smooth width transition (~360ms)

---

### US-5: Survive a page reload
**As** the user,
**I want** my packed items to still be marked if I close the browser and come back,
**so that** I don't have to restart from scratch if my phone reboots or I refresh by accident.

**Acceptance:**
- Packed/unpacked state persists in localStorage under key `packing.v1.packed`
- State stored as a JSON-stringified array of packed item ids
- On page load, the saved state is restored before the user sees the cards (no flicker of "all unpacked" then snap to packed)
- Works for the same browser on the same device — cross-device sync is out of scope
- If an item is removed from the data file but still has a saved packed state, the orphan id is ignored gracefully (no errors)
- If an item is added to the data file, it shows as unpacked by default (no errors)
- If localStorage is unavailable (private mode quirks), the app still renders and functions; persistence degrades silently

---

### US-6: Reset for the next trip
**As** the user,
**I want** a way to clear all the checkmarks at once,
**so that** I can use the same list for my next trip without unpacking N cards manually.

**Acceptance:**
- A "Reset" button is visible in the header
- Button is **disabled** (opacity 0.4, no pointer) when count = 0; enabled otherwise
- Tapping the enabled button opens a confirmation modal:
  - Title: "Really reset everything?"
  - Body: "You'll restart from scratch."
  - Buttons: "Cancel" (default) / "Yes" (primary blush)
- Modal dismisses on: tapping Yes, tapping Cancel, pressing Esc, or clicking the scrim
- Confirming (Yes) resets all items to unpacked, clears localStorage state, and closes the modal
- Cancelling (Cancel / Esc / scrim) closes the modal with no state change

---

### US-7: Feel good when done
**As** the user,
**I want** something fun to happen when I've packed everything,
**so that** the app is enjoyable to use and I know I'm done.

**Acceptance:**
- When the counter transitions from <N to N/N, a celebration overlay appears:
  - 🧳 emoji (40px)
  - "Bon voyage!" (DM Serif Display 36)
  - "Everything's in the suitcase." (small muted)
  - "Close" button
  - Confetti (36 pieces, falling from above with horizontal drift and rotation)
- The page behind the celebration is dimmed and blurred (the same scrim treatment as the reset dialog)
- **Blocking** — cards are not interactive while the celebration is shown; after dismiss, normal interaction (including un-packing) resumes
- Triggers only on the *transition* to N/N, not every time the page loads in an N/N state
- Dismisses on: "Close" click only

---

### US-8: Use it accessibly
**As** the user (or anyone),
**I want** the app to respect basic accessibility expectations,
**so that** keyboard users and motion-sensitive users have a good experience too.

**Acceptance:**
- Cards are focusable (`tabIndex=0`), have `role="button"`, and announce `aria-pressed` and a descriptive `aria-label` (including packed state)
- Pressing **Space** or **Enter** on a focused card toggles its packed state
- A visible focus ring (blush) appears on keyboard-focused interactive elements
- When `prefers-reduced-motion: reduce` is set, all transitions and animations collapse to ~0ms (no flip, no confetti motion, just instant state changes)
- No keyboard trap in the modal — Esc always exits
