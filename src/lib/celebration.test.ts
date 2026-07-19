import { shouldCelebrate } from './celebration';

// The whole trigger rule in one pure function: fire ONLY on the moment the
// list crosses from "not all packed" into "all packed".
describe('shouldCelebrate', () => {
  it('fires on the <N→N transition (TC-7.1)', () => {
    expect(shouldCelebrate(false, true)).toBe(true);
  });

  it('does NOT fire when it was already full — e.g. opening at N/N (TC-7.2)', () => {
    expect(shouldCelebrate(true, true)).toBe(false);
  });

  it('does NOT fire while still incomplete', () => {
    expect(shouldCelebrate(false, false)).toBe(false);
  });

  it('does NOT fire when dropping back below N', () => {
    expect(shouldCelebrate(true, false)).toBe(false);
  });
});
