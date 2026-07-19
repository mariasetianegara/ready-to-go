# How This App Was Built — Process Notes

Ready to Go is a deliberately small app built with a deliberately rigorous process. This page documents that process end to end, so it can be repeated on bigger things. The product owner is a non-engineer PM; an AI pair (Claude) did the hands-on engineering under her direction — every decision below was made, reviewed, or explicitly approved by a human.

## The pipeline: idea → live

Three stages, each producing a written artifact **before** the next stage starts:

1. **Product thinking → business docs.** What problem, for whom, what exactly ships: [PRD](PRD.md), [user stories](USER_STORIES.md), [test cases](TEST_CASES.md), [screen inventory](SCREEN_INVENTORY.md). Writing the test cases *before* any code exists turns "done" into something checkable.
2. **Design → design system.** Aesthetic direction, tokens (color / type / spacing / motion), component specs, and the full hand-drawn SVG illustration set: [DESIGN.md](design/DESIGN.md). High fidelity, locked before implementation.
3. **Solution design → locked decisions.** Stack, folder structure, the state model, the trickiest logic (the celebration trigger), the testing strategy, and the CI gate — all decided and written down in [SOLUTION_DESIGN.md](SOLUTION_DESIGN.md) before scaffolding. Building against locked decisions beats re-litigating them mid-build.

Then the build itself.

## Build principles

**Walking skeleton first.** The very first deploy was a trivial page pushed through the *real* pipeline — CI, then GitHub Pages, verified live. The riskiest part of a project (infrastructure) got de-risked on day one, when nothing could be wrong yet.

**A strict, structural quality gate.** `main` is a protected branch: no direct pushes, merges only via pull request, and a PR can only merge when CI is green — unit tests *and* end-to-end tests across five browser configurations (three desktop engines + two mobile devices). Deployment only runs from `main`. Consequence: a broken build cannot reach the live site. Not "shouldn't" — *can't*.

**TDD, honestly.** For each feature: write the failing test (from the pre-written test cases), watch it fail, implement, watch it pass, commit. A failing test is never weakened or deleted to get to green — either the code is wrong or the test is, and that's a decision, not a shortcut.

**Pseudocode before code for non-trivial logic.** Anything with real state/conditions/effects (the persistence hook, the celebration trigger, the modal dismiss flow) was first written as numbered plain-language pseudocode and approved by the product owner. A non-engineer can catch a wrong approach in plain language before it becomes code. Pure rendering components skip this.

**Human checkpoints at the moments automation can't judge.** Automated tests verify behavior; they can't tell you a focus ring is ugly, a narrow-screen layout feels cramped, or a held-down key makes the UI stutter. The product owner eyeballed the app at every "delight" moment — and those reviews caught real issues the suite never would have.

**Determinism over randomness.** The confetti uses a fixed seed: identical on every run, and tests never flake on randomness. Anything tested or visual prefers deterministic behavior.

**Data-driven content.** The packing list is data (`src/data/items.ts`), not markup. The UI works for any list length; editing the list requires zero code changes — and an integrity test fails with a plain-English message if an item points at a drawing that doesn't exist.

## The per-change ritual

Every change, no matter how small, walks the same path:

1. Branch off `main`.
2. Non-trivial logic? Plain-language pseudocode, approved first.
3. Failing test → implementation → green.
4. Open a PR; CI runs unit + build + Playwright across 5 browser configs.
5. Merge only on the green check → auto-deploys to the live URL (~3 min).
6. Visual/delight change? Product-owner eyeball before it counts as done.

## Why it's worth it for a 40-card checklist

The app is small; the *habits* are not. The point of practicing walking skeletons, structural gates, TDD, and written decision records on a small app is that they're second nature when the stakes are higher. And even here they paid rent: the gate caught real regressions before deploy, the integrity test catches every typo'd illustration key, and the docs in this folder mean any future maintainer — human or AI — can pick the project up cold.
