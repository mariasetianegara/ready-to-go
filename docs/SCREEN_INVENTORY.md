# Screen Inventory — Ready to Go

This app has **one screen** with several states. No navigation, no routing.

## Screen: Main Packing List

### Layout regions
1. **Header** (sticky on scroll, backdrop-blur background)
   - App title: **"Ready to Go"** (DM Serif Display 24/28px)
   - Counter: "X / N packed" (tabular figures, X bolded) — top-right
   - Progress bar (6px, ~360ms width transition) — below title row
   - "Reset" button (ghost) — next to progress bar; disabled at 0/N

2. **Main content**
   - Responsive grid of cards
     - `< 560px`: 2 columns, 12px gap
     - `≥ 560px`: 3 columns, 16px gap
     - `≥ 820px`: 4 columns, 16px gap
     - `≥ 1100px`: 5 columns, 16px gap
   - Container max-width: 1200px, side padding: 16px
   - Number of cards = length of `items.ts` (dynamic)
   - 32px of breathing room closes the page below the last row

### States

| State | Trigger | Visual |
|---|---|---|
| **Initial load (first visit)** | No localStorage data | All N cards in unpacked state, counter "0 / N packed", progress bar empty, Reset disabled |
| **Initial load (returning)** | localStorage has data | Cards restored to saved state, counter and progress bar reflect saved count, no animation flicker |
| **Item being packed** | User taps/Space/Enter on an unpacked card | Flip animation (~420ms), card transitions to packed state, counter increments, progress bar grows |
| **Item being unpacked** | User taps/Space/Enter on a packed card | Reverse flip animation, card transitions to unpacked, counter decrements, progress bar shrinks |
| **Partially packed** | 1 ≤ packed < N | Mix of packed and unpacked cards, counter and progress bar reflect current count, Reset enabled |
| **All packed (transition)** | Counter just hit N / N | Celebration overlay enters over a dimmed, blurred scrim (blocking — cards not interactive until dismissed): confetti + 🧳 + "Bon voyage!" + "Everything's in the suitcase." + "Close" button |
| **All packed (steady state)** | Already at N / N on load | No celebration (avoids firing on every page load) |
| **Reset confirmation modal** | User taps enabled Reset | Scrim + modal: "Really reset everything?" / "You'll restart from scratch." / "Cancel" / "Yes" |
| **Reset modal dismiss (no change)** | Cancel / Esc / scrim click | Modal closes, state unchanged |
| **Post-reset** | User confirms Yes | All cards return to unpacked, counter "0 / N", progress bar empty, localStorage cleared, modal closes |
| **Celebration dismiss** | Close click only (blocking overlay) | Celebration overlay disappears |
| **Reduced motion** | `prefers-reduced-motion: reduce` | All transitions collapse to ~0ms throughout |

### Interaction notes
- All interactions optimized for touch (large tap targets, generous spacing)
- Mouse hover on cards (desktop only): subtle 2px lift + stronger shadow
- Mouse active on cards: scale(0.985)
- Cards are focusable (`tabIndex=0`), with `role="button"`, `aria-pressed`, `aria-label`
- Space and Enter on a focused card toggle packed state
- Visible blush focus ring on keyboard focus (painted inset on the card face; outline on buttons)
- Modal: Esc and scrim click both dismiss
- All animations smooth at 60fps — no jank
