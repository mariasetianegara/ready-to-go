import { PACKING_ITEMS } from './items';
import { ILLUSTRATIONS } from '../illustrations/illustrations';

// TC-1.3 — the items data is well-formed and data-driven (not hardcoded to N).
// Plus an integrity check: every item's illustration key resolves to a drawing.
describe('packing items data', () => {
  it('is a non-empty array (TC-1.3)', () => {
    expect(Array.isArray(PACKING_ITEMS)).toBe(true);
    expect(PACKING_ITEMS.length).toBeGreaterThan(0);
  });

  it('every item has a non-empty id, label, and illu (TC-1.3)', () => {
    for (const item of PACKING_ITEMS) {
      expect(item.id, `empty id on ${JSON.stringify(item)}`).toBeTruthy();
      expect(item.label, `empty label on '${item.id}'`).toBeTruthy();
      expect(item.illu, `empty illu on '${item.id}'`).toBeTruthy();
    }
  });

  it('all ids are unique (TC-1.3)', () => {
    const ids = PACKING_ITEMS.map((i) => i.id);
    expect(new Set(ids).size, 'duplicate id found').toBe(ids.length);
  });

  it("every item's illu resolves to an illustration (integrity / D4)", () => {
    for (const item of PACKING_ITEMS) {
      expect(
        ILLUSTRATIONS[item.illu],
        `item '${item.id}' references missing illustration '${item.illu}'`,
      ).toBeDefined();
    }
  });
});
