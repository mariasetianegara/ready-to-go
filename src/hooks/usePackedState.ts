import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PackingItem } from '../types';
import { loadPacked, savePacked } from '../lib/storage';

/**
 * Owns the single piece of app state — the Set of packed item ids — plus the
 * values derived from it. Persists to localStorage write-through.
 */
export function usePackedState(items: PackingItem[]) {
  const validIds = useMemo(() => new Set(items.map((i) => i.id)), [items]);

  const [packed, setPacked] = useState<Set<string>>(() => {
    // Lazy + synchronous so the first paint is already correct (no flicker).
    // Keeping only ids that still exist drops orphans (TC-5.5) and makes any
    // newly added item start unpacked (TC-5.6).
    const loaded = loadPacked();
    return new Set([...loaded].filter((id) => validIds.has(id)));
  });

  // Write-through: persist on every change (incl. first render). Degrades silently.
  useEffect(() => {
    savePacked(packed);
  }, [packed]);

  const toggle = useCallback((id: string) => {
    setPacked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const reset = useCallback(() => setPacked(new Set()), []);

  const total = items.length;
  const count = packed.size;
  const pct = total ? (count / total) * 100 : 0;
  const allPacked = total > 0 && count === total;

  return { packed, count, total, pct, allPacked, toggle, reset };
}
