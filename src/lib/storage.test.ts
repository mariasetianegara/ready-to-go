import { STORAGE_KEY, loadPacked, savePacked } from './storage';

beforeEach(() => localStorage.clear());

describe('loadPacked', () => {
  it('uses the locked storage key', () => {
    expect(STORAGE_KEY).toBe('packing.v1.packed');
  });

  it('returns the saved ids as a Set (TC-5.3)', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['passport', 'toothbrush']));
    expect(loadPacked()).toEqual(new Set(['passport', 'toothbrush']));
  });

  it('returns an empty Set when nothing is saved (TC-5.4)', () => {
    expect(loadPacked()).toEqual(new Set());
  });

  it('returns an empty Set on malformed JSON, without throwing (TC-5.7)', () => {
    localStorage.setItem(STORAGE_KEY, 'not json {');
    expect(() => loadPacked()).not.toThrow();
    expect(loadPacked()).toEqual(new Set());
  });

  it('returns an empty Set when saved JSON is not an array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ oops: 1 }));
    expect(loadPacked()).toEqual(new Set());
  });

  it('ignores non-string entries in the saved array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['passport', 5, null, 'keys']));
    expect(loadPacked()).toEqual(new Set(['passport', 'keys']));
  });
});

describe('savePacked', () => {
  it('writes the set as a JSON array of ids', () => {
    savePacked(new Set(['a', 'b']));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(['a', 'b']);
  });

  it('does not throw if localStorage is unavailable (TC-5.8 unit-level)', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('disabled');
    });
    expect(() => savePacked(new Set(['a']))).not.toThrow();
    spy.mockRestore();
  });
});
