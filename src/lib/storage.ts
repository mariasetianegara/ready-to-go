// The only code that talks to localStorage. Pure, defensive, never throws.

export const STORAGE_KEY = 'packing.v1.packed';

/** Read the saved packed-item ids. Returns an empty Set on anything unexpected. */
export function loadPacked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set(); // nothing saved (TC-5.4)
    const parsed: unknown = JSON.parse(raw); // throws on malformed → caught (TC-5.7)
    if (!Array.isArray(parsed)) return new Set(); // wrong shape
    return new Set(parsed.filter((x): x is string => typeof x === 'string')); // (TC-5.3)
  } catch {
    return new Set(); // localStorage unavailable / malformed
  }
}

/** Write the packed-item ids. Silently no-ops if localStorage is unavailable (TC-5.8). */
export function savePacked(packed: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...packed]));
  } catch {
    // private-mode quirk / quota — degrade silently; the app keeps working.
  }
}
