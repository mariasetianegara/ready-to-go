# Ready to Go — Design System

**Direction:** Garden — soft botanical risograph
**Aesthetic:** Cute, playful, clean. Sage + blush + ivory. Warm but not saccharine.
**Title (chosen):** *Ready to Go* — confident, simple.
**Language:** English throughout ("Bon voyage!" in the celebration is standard English usage, kept deliberately).
**Targets:** mobile-first single-screen web app; phone-primary, desktop-equally-polished. Hosted on GitHub Pages.

---

## 1. Color tokens

All values are CSS custom properties; reference them via `var(--…)` from anywhere in the stylesheet.

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#f1ede4` | Page background (Ivory). Subtle warm cream. |
| `--surface` | `#fbf8f1` | Cards, header — slightly lifted off `--bg` (Linen). |
| `--surface-2` | `#ffffff` | Modal only. Highest elevation. |
| `--ink` | `#2a3326` | Primary text and outlines. A deep green-tinted near-black. Never pure black. |
| `--ink-muted` | `#7d8a72` | Secondary text — counter, packed labels. |
| `--ink-faint` | `#b5b09e` | Tertiary text / hint. Avoid using for anything actionable. |
| `--rule` | `#e3decf` | Default border on cards, buttons, header divider (Clay). |
| `--rule-soft` | `#ece6d4` | Softer rule; used in the inner shadow of cards. |
| `--blush` | `#e1a4a8` | Primary accent. Progress bar fill, primary CTA, focus ring. |
| `--blush-deep` | `#b97b80` | Pressed/hover state of primary CTA. |
| `--blush-soft` | `#f3d9db` | Tinted accent surface. |
| `--sage` | `#c9d8b5` | Success — packed badge background. |
| `--sage-deep` | `#324123` | Success ink — packed badge text. Strong contrast on `--sage`. |
| `--clay` | `#e3decf` | Tertiary illustration fill. Identical to `--rule`. |
| `--packed-bg` | `#ebe7dc` | Background of a packed card (the "back" face). Reads dimmer than `--surface`. |
| `--packed-rule` | `#ddd7c5` | Border of a packed card. |
| `--scrim` | `rgba(42, 51, 38, 0.36)` | Modal scrim. Tinted to match `--ink`. |

**No orange anywhere.** No bright reds. Confetti is allowed to use one warm yellow (`#e8c576`) and a dusty blue (`#a8c4d8`) at celebration time — that's the only place a non-system color lives.

---

## 2. Typography

Two faces — DM Serif Display for the display register, Nunito for everything else. Both have full Latin Extended coverage. Self-hosted via `@fontsource` packages (no font CDN at runtime).

| Token | Family / weight | Size | Use |
|---|---|---|---|
| Display | DM Serif Display, 400 | 36–56px | Celebration banner ("Bon voyage!"), large hero moments. |
| App title | DM Serif Display, 400 | 24px (28px desktop) | Header app title. |
| H2 (modal) | DM Serif Display, 400 | 22px | Modal title. |
| H3 | Nunito, 700 | 18–20px | Section headings (if needed). |
| Body / label | Nunito, 600 | 15px (16 desktop) | Card labels, buttons. |
| Small | Nunito, 600 | 13px | Counter, modal body. |
| Mini | Nunito, 700 | 11px | "Packed ✓" badge, micro-meta. |

**Letter-spacing:** `-0.01em` on display sizes. `0` on body. `0.02em` on the packed badge for confidence.
**Line-height:** `1` on display, `1.2` on labels (multi-line is rare but allowed — `text-wrap: pretty` keeps the wrap clean), `1.45` on body.

---

## 3. Spacing scale

Strict 4-pt grid. Use tokens; don't hand-pick values.

| Token | Value | Notes |
|---|---|---|
| `--s-1` | 4 | hairline / inline icon gap |
| `--s-2` | 8 | tight |
| `--s-3` | 12 | card-internal gap; grid gap (mobile) |
| `--s-4` | 16 | grid gap (≥560), page side padding |
| `--s-5` | 20 | section spacing |
| `--s-6` | 24 | modal interior |
| `--s-8` | 32 | big section break; bottom-of-app breathing room |
| `--s-12` | 48 | rarely; large vertical rhythm |
| `--s-16` | 64 | largest step; reserved |

---

## 4. Border radius

| Token | Value | Use |
|---|---|---|
| `--r-sm` | 8 | small inline chips |
| `--r-md` | 12 | — |
| `--r-lg` | 16 | **cards** |
| `--r-xl` | 20 | modal |
| `--r-pill` | 999 | buttons, badges, progress bar |

---

## 5. Shadow tokens

Soft, never harsh. Always uses a green-tinted shadow rather than pure black for warmth.

```css
--shadow-card:       0 1px 0 var(--rule-soft), 0 4px 12px -6px rgba(50, 60, 38, 0.12);
--shadow-card-hover: 0 1px 0 #e5dfc8,          0 12px 24px -10px rgba(50, 60, 38, 0.18);
--shadow-press:      0 1px 0 var(--rule-soft), 0 2px 6px  -3px rgba(50, 60, 38, 0.12);
--shadow-modal:      0 24px 60px -20px rgba(42, 51, 38, 0.35), 0 1px 0 rgba(255,255,255,0.7) inset;
--shadow-header:     0 1px 0 var(--rule);
```

---

## 6. Motion / animation tokens

The flip is the signature motion. Don't shorten it below 380ms — the satisfaction comes from the deliberateness.

| Token | Duration | Easing | Use |
|---|---|---|---|
| `--t-flip` | **420ms total** (2 × `--t-flip-half` 210ms) | in `cubic-bezier(0.7, 0, 1, 1)` · out `cubic-bezier(0, 0, 0.3, 1)` | **Card flip** between unpacked ↔ packed — a 2D two-phase squash (`scaleX`). |
| `--t-hover` | 180ms | `cubic-bezier(0.2, 0.7, 0.3, 1)` | Card lift on desktop hover; button bg/border. |
| `--t-press` | 120ms | `cubic-bezier(0.2, 0.7, 0.3, 1)` | Card / button `scale(0.985)` on press. |
| `--t-modal` | 220ms | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Modal scrim + lift-in. Progress bar fill. |
| `--t-celebrate` | 800ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Celebration banner gentle overshoot. |
| Confetti | 2.6s avg | `cubic-bezier(0.2, 0.6, 0.3, 1)` | 36 pieces, randomized delay 0–0.6s, dx ±220px, falls past viewport bottom. |

All motion is suppressed under `@media (prefers-reduced-motion: reduce)`.

### Flip mechanics (explicit)
```css
.face      { transform: scaleX(1); }   /* visible resting face          */
.face.back { transform: scaleX(0); }   /* hidden at zero width          */
/* packing: front shrinks first (ease-in, 210ms),
   then back grows (ease-out, 210ms, delayed by half) — and vice versa */
.card.packed .face.front { transform: scaleX(0); }
.card.packed .face.back  { transform: scaleX(1); }
```
The flip is a **2D two-phase squash**: the visible face scales X to 0 over the first half, then the other face scales X from 0 over the second half. Deliberately **no 3D machinery** (`perspective` / `preserve-3d` / `backface-visibility` / `rotateY`): at 40 instances those force every card onto composited GPU layers, which blanked cards during scrolling and window resizing. Hover/press transforms live on the **wrapper** and flip transforms on the **faces** — different elements, so they compose instead of overwriting each other.

Both faces share the same dimensions and illustration. The back face is dimmer (illu opacity 0.55, ink muted), has a desaturated background (`--packed-bg`), and shows the "Packed ✓" badge top-right.

---

## 7. Card component

**Aspect ratio:** `1 / 1.16` — slightly taller than wide. Reads as a label-under-illustration unit.
**Front (unpacked):**
- Background `--surface`, border `--rule`, radius `--r-lg` (16), shadow `--shadow-card`.
- Padding: 16 / 12 / 12 (top / sides / bottom).
- Illustration slot fills the top 70% with the SVG centered at 70/70.
- Label below: Nunito 600, 15px mobile / 16 desktop, `text-wrap: pretty`.
- Hover (desktop only): lifts 2px, shadow strengthens.
- Press: `scale(0.985)`.

**Back (packed):**
- Background `--packed-bg`, border `--packed-rule`.
- Illustration dimmed (stroke → `--ink-muted`, fills mixed 35–55% toward bg, opacity 0.55).
- Label color `--ink-muted` (no strikethrough — keep it dignified).
- Badge top-right: pill, `--sage` bg, `--sage-deep` text, "Packed ✓", Nunito 700 11px.

**Tap / keyboard:** `role="button"`, `tabIndex={0}`, toggles on Space/Enter. `aria-pressed` reflects packed state. `aria-label` includes packed / to pack.
**Keyboard focus ring:** a 2px `--blush` ring painted **inset on the card face** (both faces), keyboard-only via `:focus-visible`. Inset (not an outline around the wrapper) so the ring stays pixel-attached to the rendered card at every width and display scaling.

---

## 8. Button component

Three variants, all share radius `--r-pill`, font Nunito 600 13/15, transition `--t-hover`.

| Variant | bg | border | text | Use |
|---|---|---|---|---|
| `.btn` (default) | `--surface` | `--rule` | `--ink` | Modal "Cancel", celebration "Close". |
| `.btn-primary` | `--blush` | transparent | `#3a1e22` | Modal "Yes", confirm destructive. |
| `.btn-ghost` | transparent | transparent | `--ink-muted` | Header "Reset". |

Pressed: `scale(0.97)`. Disabled (ghost): opacity 0.4, no pointer.
**Keyboard focus ring:** 2px `--blush` outline, keyboard-only via `:focus-visible`; offset 3px on `.btn-ghost` and `.btn-primary` (so the ring doesn't merge into a transparent or blush-filled button), 0 on the default `.btn`.

---

## 9. Header

Sticky top. Mobile-first. Backdrop-blurred translucent `--bg`.

- Row 1: app title left (DM Serif Display 24), counter right ("12 / 40 packed", tabular figures, bolded numerator).
- Row 2: progress bar (6px tall, `--rule` track, `--blush` fill, 360ms ease-out width transition) + "Reset" ghost button on the right.
- Bottom border: `1px solid --rule`. No drop shadow.

Disabled "Reset" when count is zero — visually faded to 0.4, no pointer.

---

## 10. Reset modal

- Scrim: `--scrim` over full viewport, `backdrop-filter: blur(4px)`, opacity transitions 220ms.
- Modal card: `--surface-2` bg, `--r-xl` radius (20), `--shadow-modal`, max-width 340px, padded `--s-6`.
- Lifts 8px on enter with `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Title: "Really reset everything?" — DM Serif Display 22, no caps.
- Subtitle: "You'll restart from scratch."
- Actions row: equal-width [Cancel] [Yes], 12px gap. Yes is `.btn-primary`.
- Closes on: ESC, scrim click, either button.

---

## 11. Celebration

Triggered when `packed.size === items.length` AND the previous value was less than full (one-shot per transition).

- Fixed overlay, vertically centered, over a scrim: same treatment as the reset modal — `--scrim` tint + `backdrop-filter: blur(4px)` so the packed grid doesn't clutter the moment.
- Banner: surface-2 card, `--r-xl`, `--shadow-modal`, vertical stack: 🧳 (40px) → "Bon voyage!" (DM Serif Display 36) → "Everything's in the suitcase." (Nunito 600, ink-muted) → "Close" button.
- Enter motion: `scale(0.92) translateY(20px) → 1 / 0` with `--t-celebrate-ease` (gentle overshoot).
- Confetti: 36 pieces, deterministic seed, colors limited to: blush, blush-soft, blush-deep, sage, dusty-blue `#a8c4d8`, soft-yellow `#e8c576`. Fall from −40px to 110vh with horizontal drift ±220px and 540° rotation.
- **Blocking** overlay while shown; dismissed on "Close" only (after dismiss, normal interaction resumes).

---

## 12. Layout

Single max-width container at **1200px**. Side padding **16px** always (matches grid gap). The grid is the only thing that responds:

| Breakpoint | Columns | Grid gap |
|---|---|---|
| < 560px | 2 | 12 |
| ≥ 560px | 3 | 16 |
| ≥ 820px | 4 | 16 |
| ≥ 1100px | 5 | 16 |

Header content stretches to the same max-width and shares the same side padding. No special tablet/desktop chrome — same UI scales up. The page closes with 32px of breathing room below the last card row.

---

## 13. Illustrations

**The inline SVGs in `src/illustrations/illustrations.tsx` ARE the final art (40 referenced + spares).** Hand-drawn; no AI-generation step; no swap-out planned. New items follow the same rules.

- **Style:** fine monoline outline + one or two soft pastel fills per item. Risograph / botanical-line feel.
- **Palette per illustration:** `--ink` stroke (1.6px, `stroke-linecap: round`, `stroke-linejoin: round`), fill from one of `--blush`, `--sage`, `--clay` via the CSS classes `.blush`, `.sage`, `.clay` on a child element. Max two fills per item.
- **Viewbox:** 64×64. Subject occupies ~70% of canvas, centered.
- **No gradients, no textures, no detailed shading.**
- **Must be recognizable at 48×48** on a small phone.
- **Adding a new icon:** append to `ILLUSTRATIONS` in `src/illustrations/illustrations.tsx` under a new key, then reference that key in the `illu` field of the corresponding entry in `src/data/items.ts`. The base CSS already wires stroke/fill from the parent class hooks — no per-icon styling required.

---

## 14. Out of scope

Multi-screen flows · settings / accounts · item editing UI · dark mode (the palette would support a clean inversion) · full accessibility audit (basic a11y is built in).

---

## 15. Where the design lives in the app

```
docs/design/DESIGN.md                  ← this file — tokens + component specs
src/styles/styles.css                  ← the design system implemented as CSS
src/illustrations/illustrations.tsx    ← the final SVG art library
```

The design system was implemented directly into the app's stylesheet; the tokens and specs above describe exactly what ships.
