export interface PackingItem {
  /** Stable, unique internal id — also the localStorage key. Never rename once live. */
  id: string;
  /** Display label shown on the card. */
  label: string;
  /** Key into ILLUSTRATIONS (src/illustrations/illustrations.tsx). */
  illu: string;
}
