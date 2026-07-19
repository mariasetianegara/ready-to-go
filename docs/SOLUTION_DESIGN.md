# Solution Design — Ready to Go

**Status:** As-built reference. Every locked decision behind the shipped app, kept in sync with the code.
**Audience:** The maintainer — product owner, non-engineer. Plain language on purpose.

> The executable truth is the **tests + code**; this document records the *why* behind them.

---

## 0. Product context (foundational)

- **One user:** a friend of the maintainer — packs from their phone next to a suitcase. Exactly one user; no multi-user state ever.
- **Maintainer:** owns the list. It is edited out-of-band: the user messages the maintainer; she edits the data and redeploys. No in-app editing.
- **State is per-browser, per-device.** Progress lives only in that browser's `localStorage`. A different browser or device = a separate, independent, blank state. A stranger who finds the public repo and opens the app gets their own blank list. Private/incognito mode = wiped on close. Cross-device sync is out of scope by design.
- **Quality bar:** "100% amazing", equally polished and bug-free on phone *and* desktop. Visual cleanliness is the top priority.

---

## 1. Tech stack (locked)

| Area | Decision | Rationale |
|---|---|---|
| Build tool | **Vite** | Fast, standard, first-class TS/React. |
| UI library | **React 18** (pinned; not 19) — D12 | The trickiest logic (esp. the celebration trigger) was validated on React 18; "newest" adds zero product value, exact fidelity reduces risk. |
| Language | **TypeScript** | Type safety; integrity tests. |
| Styling | **Plain CSS**, adopting the design system's `styles.css` as the visual source of truth | One file = no drift from the approved design. No CSS Modules/Tailwind. |
| Fonts | **Self-hosted** `DM Serif Display` + `Nunito` via `@fontsource` packages — D3 | Honors "no runtime API calls"; faster; offline-capable; no flash-of-unstyled-text; privacy. |
| Unit tests | **Vitest + React Testing Library** | Fast, Vite-native; for pure logic + components. |
| E2E tests | **Playwright** | Real-browser behavior. |
| Hosting | **GitHub Pages** project site at `mariasetianegara.github.io/ready-to-go/` | Free static hosting. |
| CI/CD | **GitHub Actions**, strict gate | All unit + all E2E must pass before deploy. |
| Repo | `ready-to-go`, **public**, user `mariasetianegara` | — |
| React StrictMode | **On** — D6 | Good practice; the logic is StrictMode-safe by construction and proven by tests. |
| Environment variables | **None** — E3 | No backend/secrets/API; the base path is a fixed build setting. Zero env vars is correct and safer for a public repo. |

---

## 2. Folder structure (and why)

```
ready-to-go/
├─ docs/                        ← product + design + process docs (committed)
│  ├─ PRD.md · USER_STORIES.md · TEST_CASES.md · SCREEN_INVENTORY.md
│  ├─ SOLUTION_DESIGN.md        ← this file
│  ├─ PROCESS.md                ← how the app was built, end to end
│  └─ design/DESIGN.md          ← the Garden design system (tokens, specs)
├─ public/
│  ├─ favicon.svg · favicon-32.png · apple-touch-icon.png   (D8 — 🧳)
├─ scripts/
│  └─ generate-favicons.mjs     ← rasterizes the emoji favicons
├─ src/
│  ├─ main.tsx                  ← entry; mounts <App/>, imports fonts + global CSS once
│  ├─ App.tsx                   ← composition root: wires hook → components
│  ├─ components/
│  │  ├─ Header.tsx             ← title + counter + progress bar + reset button
│  │  ├─ Card.tsx
│  │  ├─ ResetModal.tsx
│  │  └─ Celebration.tsx
│  ├─ hooks/
│  │  ├─ usePackedState.ts
│  │  └─ useScrollLock.ts       ← iOS-safe body pin while a dialog is open
│  ├─ lib/
│  │  ├─ storage.ts             ← pure load/save; unit-tested
│  │  ├─ celebration.ts         ← the pure trigger rule
│  │  ├─ confetti.ts            ← deterministic pieces; unit-tested
│  │  └─ ignoreKeyRepeat.ts     ← held-key guard shared by all buttons
│  ├─ data/
│  │  └─ items.ts               ← THE editable data (the maintainer edits this)
│  ├─ illustrations/
│  │  └─ illustrations.tsx      ← all 57 SVGs (edit here for new art)
│  ├─ types/
│  │  └─ index.ts
│  └─ styles/
│     └─ styles.css             ← the design system stylesheet
├─ e2e/                         ← Playwright specs (real browser)
├─ src/**/*.test.ts(x)          ← Vitest unit tests, colocated
├─ index.html
├─ vite.config.ts · playwright.config.ts · tsconfig.json
├─ .github/workflows/deploy.yml
├─ .gitignore · .nvmrc · package.json · README.md
```

**Why:** `data/` + `illustrations/` are isolated single files so list changes need *no core code edits* (the out-of-band promise). `lib/` + `hooks/` separate pure logic (fast unit tests) from UI (browser tests). `styles/styles.css` is one file = zero drift from the approved design. Two test locations because two runners with different environments.

---

## 3. State management (exact hook design)

**One real piece of state:** `packed: Set<string>` (item ids). Everything else is **derived**, never stored, so they cannot disagree. **`useState`, not `useReducer`** (two operations only: toggle one / clear all — a reducer is unjustified ceremony).

Implementation lives in `src/lib/storage.ts` + `src/hooks/usePackedState.ts`:

- `loadPacked()` reads `localStorage['packing.v1.packed']`, tolerating missing/malformed/non-array values → empty Set (TC-5.4, TC-5.7); never throws.
- `savePacked(set)` writes through on every change; silently no-ops if storage is unavailable (TC-5.8).
- The hook initializes **lazily and synchronously** so the first paint is already correct — no flicker (TC-5.2) — and reconciles on read: orphan ids are dropped (TC-5.5); items absent from storage stay unpacked (TC-5.6).

**Locked sub-decisions:**
- **G2:** one simple write-through rule (incl. the harmless empty write on first visit). Reset writes `"[]"`, not `removeItem` — fewer code paths, fewer bugs. Reload-after-reset shows all unpacked (TC-6.9) because storage = `[]`.
- **D5:** orphans are filtered on read only; storage self-heals on the next toggle. No storage writes during render.
- Tests assert *observable behavior* (all unpacked after reload), not exact storage bytes.

---

## 4. Celebration trigger logic (exact pattern)

**Behavior:** confetti fires the instant the count crosses **<N → N**; **never** on a fresh load already at N/N; the overlay is **blocking** while visible and dismissed by **"Close" only**; once dismissed, normal interaction (including un-packing) resumes.

The rule is a pure function (`src/lib/celebration.ts`):

```ts
export function shouldCelebrate(prevAllPacked: boolean, allPacked: boolean) {
  return allPacked && !prevAllPacked;
}
```

`App.tsx` keeps a ref of "was it already full?", **initialised FROM the loaded state**, so opening at N/N is not a transition → no celebration on load (TC-7.2).

**Locked sub-decisions:**
- **G1:** the celebration **always** re-fires on every `<N → N` transition (no memory of past dismissals) — the user should always get the confetti.
- **StrictMode-safe by construction:** the ref guard is idempotent, and load-at-full never fires because the ref starts at `allPacked`. Proven by TC-7.1/7.2.
- **Blocking** is a markup/CSS concern: a full-viewport overlay intercepts pointer events while shown; **D11**: it is rendered only when shown (not hidden-but-present); **G8**: full focus trap, focus restored on close. Dismiss = Close only; Escape deliberately does **not** dismiss it (an intentional divergence from the reset dialog — see §12).
- **Confetti:** deterministic — fixed seed `1729`, **36 pieces**, six pastel colours, ±220px drift, 540° rotation. Identical every run; tests never flake on randomness.

---

## 5. Illustrations

- `src/illustrations/illustrations.tsx` exports `ILLUSTRATIONS: Record<string, ReactElement>` (D2 — ready-made elements).
- **All 57** icons (40 referenced + spares) are **final hand-drawn SVG art** (D1) — no AI generation; 64×64 viewBox, monoline 1.6px stroke, max two pastel fills (`.blush` / `.sage` / `.clay`).
- Integrity unit test (extends TC-1.3): every `item.illu` resolves to a key in `ILLUSTRATIONS`, with a plain-English failure message (`item 'x' references missing illustration 'y'`).

---

## 6. Items typing

- `src/types/index.ts`: `interface PackingItem { id: string; label: string; illu: string }`.
- `src/data/items.ts`: `export const PACKING_ITEMS: PackingItem[]` — category comments kept (array order = DOM + keyboard tab order, TC-8.1).
- **D4:** `illu` typed as `string` **plus** a friendly integrity unit test, *not* strict `keyof` typing. Rationale: a plain-English failure is actionable for a non-engineer; keeps the data file decoupled and editable.
- **Id-stability rule:** ids were chosen before launch; **never rename an id once real users exist** (it silently orphans saved progress). Pre-launch renames are safe (no users). Also stated in the README.

---

## 7. Vite base path

- `vite.config.ts`: `base: '/ready-to-go/'` — **always**, dev *and* prod (D7), incl. the dev server and Playwright.
- **Why:** GitHub Pages serves under the `/ready-to-go/` sub-folder; a wrong base = blank page with no error. Dev/prod parity makes any base bug fail a test instead of surprising production. Local URL becomes `localhost:5173/ready-to-go/` — purely cosmetic, zero downside.

---

## 8. Playwright config

- `webServer` runs the **production build**: `vite build && vite preview`; `baseURL` includes `/ready-to-go/` (D9). Rationale: tests the *exact* artifact that ships; no dev-only React noise → reliable "no console errors" (TC-NF.2); catches base/asset bugs.
- **Unit tests do not run "against a server"** — they test logic directly in milliseconds. Only E2E uses the server, and only against the production build.
- **5 browser configurations** (D10, E1): Chromium-desktop, WebKit-desktop, Firefox-desktop, WebKit-mobile (iPhone 13 preset), Chromium-mobile (Pixel 5 preset). WebKit coverage is mandatory — every browser on an iOS device runs the WebKit engine, so Apple-device compatibility lives or dies there; Firefox included because it's the engine most likely to reveal a visual quirk and visual cleanliness is paramount.
- Built-in switches cover the awkward cases: `reducedMotion: 'reduce'` (TC-8.6); an init-script to break `localStorage` (TC-5.8).
- E2E specs live in `e2e/`.

---

## 9. GitHub Actions workflow

`.github/workflows/deploy.yml`, two jobs:

1. **`test`** — checkout → setup Node → `npm ci` → Vitest → `playwright install --with-deps` → Playwright (builds + previews internally) → upload Playwright report artifact.
2. **`deploy`** — `needs: test` (← **this line is the strict gate**) → `npm ci` → `npm run build` → upload Pages artifact → `actions/deploy-pages`. `permissions: pages: write, id-token: write`; `concurrency`; environment `github-pages`.

- Triggers: tests on **pull_request + push to `main`**; deploy only on **push to `main`**.
- **G7 — Branch protection:** on `main`: *require a pull request before merging* (no direct pushes), *require status checks (unit + E2E) to pass before merging*, *include administrators / no bypass*. **No human-approval requirement** (a solo maintainer can't self-approve; the green check is the gate). Net effect: shipping a broken list to the user is **structurally impossible**.
- **G4 — walking skeleton:** the very first deploy is a minimal skeleton pushed through the *real* pipeline to the live URL **before the app lands**, to prove deployment when nothing can be wrong and de-risk the end of the project.

---

## 10. Component breakdown

Principle: **state lives in one place (the hook), flows down as read-only props, changes flow up via callbacks.** No component owns shared state.

| Component | Inputs | Callbacks out | Responsibility |
|---|---|---|---|
| **App** | — | — | Composition root; runs `usePackedState`, owns `showReset`/`showCelebration` + transition effect; renders the rest. |
| **Header** | `count, total, pct` | `onReset` | Title, "X / N packed" (bold numerator, tabular figures), 6px progress bar (width = pct%), ghost "Reset" (disabled at 0). |
| **Card** | `item, packed` | `onToggle(id)` | Flip wrapper + front/back faces; illustration; label; "Packed ✓" badge on back; `role="button"`, `tabIndex=0`, `aria-pressed`, `aria-label`; Space/Enter toggles; held-key auto-repeat guarded. |
| **ResetModal** | `open` | `onConfirm, onCancel` | Scrim + modal; title/body/buttons; Esc + scrim-click = cancel; rendered only when open (D11); focus moved in, trapped, restored on close (G8); background scroll locked. |
| **Celebration** | `show` | `onDismiss` | **Blocking** overlay over a dimmed, blurred scrim (same treatment as ResetModal); confetti (from `confetti.ts`) + banner; rendered only when shown (D11); full focus trap, restore (G8); dismissed by "Close" only; background scroll locked. |
| **Pure modules** | — | — | `storage.ts`, `confetti.ts`, `shouldCelebrate()`, `ignoreKeyRepeat()` — the fast unit-test surface. |

**Micro-copy / semantics — locked values (G5):**
- Card `aria-label`: `"{label} — packed"` when packed / `"{label} — to pack"` when not (em dash, those exact words).
- Reset modal: `role="dialog"`, `aria-modal="true"`, labelled by its title.
- Celebration banner: `role="status"`, `aria-live="polite"`; 🧳 `aria-hidden`.
- Progress bar: `aria-hidden` (the "X / N packed" text is the accessible source of truth — avoids double-announcing).
- All illustrations + the 🧳: `aria-hidden` (decorative; the label carries meaning).
- Confetti: deterministic (seed 1729, 36 pieces).
- `index.html` head: `lang="en"`, `<title>Ready to Go</title>`, `theme-color #f1ede4`, mobile viewport incl. `viewport-fit=cover`.

### Canonical copy (locked) — render exactly

| Element | String | Notes |
|---|---|---|
| App title | `Ready to Go` | DM Serif Display |
| Counter | `{count} / {total} packed` | numerator bold; tabular figures; **`packed` is fixed — never varies** (ratio idiom; G3) |
| Packed badge | `Packed ✓` | sage pill |
| Reset button | `Reset` | ghost; disabled at 0/N |
| Modal title | `Really reset everything?` | |
| Modal body | `You'll restart from scratch.` | |
| Modal buttons | `Cancel` · `Yes` | Yes = primary blush |
| Celebration | 🧳 · `Bon voyage!` · `Everything's in the suitcase.` · `Close` | "Bon voyage" is standard English usage — a deliberate choice |
| Card aria-label | `{label} — packed` / `{label} — to pack` | em dash; G5 |

---

## 11. Implementation order (TDD, mapped to TEST_CASES groups)

Each step: write failing test → watch fail → implement → watch pass → commit.

| # | Step | Test cases | Why here |
|---|---|---|---|
| 0 | Scaffold + smoke test + **walking-skeleton deploy** | — | Prove toolchain + the whole pipeline live before features (G4). |
| 1 | Port data + illustrations | TC-1.3 (+integrity) | Everything depends on it; fastest tests. |
| 2 | localStorage logic + reconciliation | TC-5.3–5.7 | The irreversible data core — lock early. |
| 3 | Render cards + header | TC-1.1, 4.1, 4.3, 4.4 | Static screen before interaction. |
| 4 | Pack/unpack + counter + progress | TC-2.x, 3.x, 4.2 | Core interaction. |
| 5 | Persistence E2E (reload) | TC-5.1, 5.2, 5.8 | Both halves now exist. |
| 6 | Reset flow + modal (+focus mgmt) | TC-6.1–6.9 | — |
| 7 | Celebration (blocking) | TC-7.1–7.4 | Hardest logic, isolated. |
| 8 | Accessibility + focus management | TC-8.1–8.6 | Keyboard, aria, reduced-motion, trap/restore. |
| 9 | Responsive + non-functional sweep | TC-1.2, NF.1–NF.3 | Cross-cutting; worst-case narrow screen shown for visual review (G6). |
| 10 | Final CI gate green + Pages deploy verified | — | (Skeleton already live since step 0.) |

**G6 (layout):** reproduce `styles.css` faithfully (no pre-emptive small-screen safeguard). Guarantee **360px**; the longest-label worst case is shown for visual sign-off.

---

## 12. Deliberate choices to guard (as-built)

Decisions that could look like accidents later — documented so nobody "fixes" them:

| Choice | Rationale |
|---|---|
| **The celebration is Escape-proof.** The reset dialog dismisses on Cancel / Esc / scrim (an easy-to-escape *decision*); the celebration dismisses on Close only (a deliberate *moment*). | Consistency by default, divergence by intent — same-concern controls behave the same; different intent is documented. |
| **"Bon voyage!"** as the celebration heading. | Standard English usage; the warmest phrase for the moment. |
| **The flip is a 2D two-phase squash (`scaleX`), not a real 3D rotation.** The app originally used a 3D `rotateY` flip; at 40 cards its GPU-layer requirements (perspective / preserve-3d / backface-visibility, with or without `will-change`) blanked cards during ordinary scrolling and window resizing. The 2D squash keeps cards in normal paint flow — the artifact family is **eliminated**, not mitigated. Do not reintroduce 3D flip machinery. | Same satisfying feel, verified correct at every frame mid-animation; everyday scrolling and resizing must stay clean. |
| **Card focus ring is an inset box-shadow on the faces; buttons use a classic outline.** | The card wrapper's aspect-ratio box has a fractional height and the faces render on a pixel-snapped GPU flip layer — an outline around the wrapper could show a hairline gap and an uneven bottom stroke at some widths/display scalings. Painting the ring on the face raster keeps it pixel-attached at every scale. |

---

## 13. Decision ledger (quick index)

D1 all 57 icons ported · D2 ready-made elements · D3 self-hosted fonts (@fontsource) · D4 `string` illu + integrity test · D5 orphan self-heal on next tap · D6 StrictMode on · D7 base path everywhere · D8 🧳 emoji favicon (SVG + PNG + apple-touch-icon; iOS can't render emoji SVG favicons) · D9 E2E vs prod build · D10 5 browser configs · D11 render-only-when-open · D12 React 18 · E1 5 configs · E3 no env vars · **G1** celebration always re-fires on `<N→N` · **G2** write `[]`, simple write-through · **G3** counter is fixed `"X / N packed"` · **G4** walking-skeleton deploy early · **G5** micro-copy locked · **G6** faithful layout + worst-case narrow review; guarantee 360px · **G7** branch protection, no bypass · **G8** focus management on both popups · celebration **blocking**, Close-only · confetti fixed seed.

---

## 14. Open / deferred (not blocking)

- **Full WCAG accessibility audit:** deferred post-MVP. Basic a11y + G8 focus management are in.
- **Permanently out of scope (no v2 commitment):** cross-device sync, multi-list/multi-trip, in-app item editing, dark mode, per-item quantity/notes, accounts/backend.
- **Analytics:** none. If ever added, it will be a privacy-first cookieless tool (no consent banner needed), injected at a single point.
