# Ready to Go 🧳

A single-screen packing checklist built for exactly one user — a friend who always forgets something when packing. Tap a card to mark an item packed (it flips); progress is saved in the browser. Static site, no backend.

**Live:** https://mariasetianegara.github.io/ready-to-go/

Built product-docs-first with a strict TDD + CI discipline — the full paper trail lives in [`docs/`](docs/):

- [PROCESS.md](docs/PROCESS.md) — how the app went from idea to live, end to end
- [PRD](docs/PRD.md) · [User stories](docs/USER_STORIES.md) · [Test cases](docs/TEST_CASES.md) · [Screen inventory](docs/SCREEN_INVENTORY.md)
- [Solution design](docs/SOLUTION_DESIGN.md) — every locked technical decision, and why
- [Design system](docs/design/DESIGN.md) — tokens, component specs, and the hand-drawn SVG art rules

## Run locally

```bash
npm install
npm run dev        # dev server → http://localhost:5173/ready-to-go/
npm run build      # type-check + production build into dist/
npm run preview    # preview the production build locally
npm run test:unit  # unit tests (Vitest)
npm run test:e2e   # end-to-end tests (Playwright, 5 browser configs)
```

Node version is pinned in `.nvmrc`.

## Editing the packing list

The list is data-driven from **`src/data/items.ts`**. Each entry:

```ts
{ id: 'passport', label: 'Passport', illu: 'passport' }
```

- **`id`** — internal identifier; the key to a user's saved progress. **Never rename or reuse an `id`** — changing it silently wipes that item's saved checkmark. A new item gets a brand-new, unique `id`.
- **`label`** — the name shown on the card.
- **`illu`** — which drawing to use; must match a key in `src/illustrations/illustrations.tsx`.

Need a new drawing? Add it under a new key in `src/illustrations/illustrations.tsx`, then reference that key in `illu`. (Several spare drawings already exist.)

The count ("X / N") is derived from the list — nothing is hard-coded to a specific length.

**Safety net:** if an item references a drawing that doesn't exist, a unit test fails (`item '…' references missing illustration '…'`) and the CI gate blocks the deploy.

## Shipping a change

`main` is protected — no direct pushes. Every change goes through a pull request:

1. Branch, commit, open a PR.
2. CI runs tests + build automatically. **Wait for the green check.**
3. Green → **Merge** → the site redeploys automatically (~3 min).
4. Red → open the failed check, fix, push again.

A red check can't be merged, so a broken build can't reach the live site.

## Tech

Vite · React 18 · TypeScript · plain CSS (Garden design system) · Vitest + Testing Library · Playwright · GitHub Actions → GitHub Pages.

## `npm audit`

Advisories that appear over time affect the local dev/test tooling only, never the deployed static site. Don't run `npm audit fix --force` casually — it can introduce breaking changes; review before upgrading.
