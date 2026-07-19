// Garden-style illustrations — fine outline + soft pastel fills.
// These ARE the final hand-drawn SVG art — no AI step. All in a 64×64 viewBox, monoline 1.6px stroke,
// rounded caps/joins, max two pastel fills per icon.
//
// Inheriting CSS rules (set in styles.css):
//   svg.illu { stroke: var(--ink); stroke-width: 1.6; fill: none;
//              stroke-linecap: round; stroke-linejoin: round; }
//   svg.illu .blush { fill: var(--blush); stroke: none; }
//   svg.illu .sage  { fill: var(--sage); stroke: none; }
//   svg.illu .clay  { fill: var(--clay); stroke: none; }

// Tiny helper to keep markup readable
import type { ReactElement, ReactNode } from 'react';

const I = (children: ReactNode): ReactElement => (
  <svg className="illu" viewBox="0 0 64 64" aria-hidden="true">{children}</svg>
);

export const ILLUSTRATIONS: Record<string, ReactElement> = {
  // ─── Documents / personal ───
  passport: I(<>
    <rect className="blush" x="16" y="8" width="32" height="48" rx="3"/>
    <rect x="16" y="8" width="32" height="48" rx="3"/>
    <circle cx="32" cy="26" r="6"/>
    <path d="M22 42h20M22 47h14"/>
  </>),
  idcard: I(<>
    <rect className="sage" x="8" y="18" width="48" height="30" rx="4"/>
    <rect x="8" y="18" width="48" height="30" rx="4"/>
    <circle cx="20" cy="32" r="5"/>
    <path d="M30 28h18M30 33h14M30 38h16"/>
  </>),
  ticket: I(<>
    <path className="blush" d="M10 22a4 4 0 0 1 4-4h36a4 4 0 0 1 4 4v4a4 4 0 0 0 0 8v4a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4v-4a4 4 0 0 0 0-8z"/>
    <path d="M10 22a4 4 0 0 1 4-4h36a4 4 0 0 1 4 4v4a4 4 0 0 0 0 8v4a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4v-4a4 4 0 0 0 0-8z"/>
    <path d="M34 22v4M34 32v4M34 42v0" strokeDasharray="2 3"/>
  </>),
  wallet: I(<>
    <rect className="clay" x="8" y="18" width="48" height="30" rx="4"/>
    <rect x="8" y="18" width="48" height="30" rx="4"/>
    <path d="M8 26h48"/>
    <circle cx="46" cy="36" r="3" className="blush"/>
    <circle cx="46" cy="36" r="3"/>
  </>),
  keys: I(<>
    <circle className="sage" cx="22" cy="32" r="9"/>
    <circle cx="22" cy="32" r="9"/>
    <circle cx="22" cy="32" r="3"/>
    <path d="M31 32h22M44 32v6M50 32v4"/>
  </>),

  // ─── Tech ───
  charger: I(<>
    <rect className="blush" x="22" y="10" width="20" height="26" rx="3"/>
    <rect x="22" y="10" width="20" height="26" rx="3"/>
    <path d="M28 36v6M36 36v6"/>
    <path d="M22 50c0 6 4 8 10 8s10-2 10-8"/>
  </>),
  cable: I(<>
    <rect className="clay" x="26" y="6" width="12" height="10" rx="2"/>
    <rect x="26" y="6" width="12" height="10" rx="2"/>
    <path d="M32 16c0 12-14 12-14 24s14 12 14 24"/>
    <rect x="28" y="52" width="8" height="6" rx="1.5"/>
  </>),
  earbuds: I(<>
    <circle className="blush" cx="20" cy="22" r="7"/>
    <circle cx="20" cy="22" r="7"/>
    <circle className="blush" cx="44" cy="22" r="7"/>
    <circle cx="44" cy="22" r="7"/>
    <path d="M20 29v10c0 4 4 6 4 12M44 29v10c0 4-4 6-4 12"/>
  </>),
  adapter: I(<>
    <rect className="sage" x="14" y="18" width="36" height="28" rx="5"/>
    <rect x="14" y="18" width="36" height="28" rx="5"/>
    <circle cx="26" cy="30" r="1.5" fill="currentColor"/>
    <circle cx="38" cy="30" r="1.5" fill="currentColor"/>
    <path d="M22 38h20"/>
  </>),
  camera: I(<>
    <rect className="clay" x="8" y="20" width="48" height="30" rx="5"/>
    <rect x="8" y="20" width="48" height="30" rx="5"/>
    <path d="M22 20l3-5h14l3 5"/>
    <circle className="blush" cx="32" cy="35" r="8"/>
    <circle cx="32" cy="35" r="8"/>
    <circle cx="32" cy="35" r="3"/>
  </>),

  // ─── Vision / head ───
  glasses: I(<>
    <circle className="clay" cx="20" cy="34" r="10"/>
    <circle className="clay" cx="44" cy="34" r="10"/>
    <circle cx="20" cy="34" r="10"/>
    <circle cx="44" cy="34" r="10"/>
    <path d="M30 34h4M10 28l-4-4M54 28l4-4"/>
  </>),
  sunglasses: I(<>
    <circle className="blush" cx="20" cy="34" r="10"/>
    <circle className="blush" cx="44" cy="34" r="10"/>
    <circle cx="20" cy="34" r="10"/>
    <circle cx="44" cy="34" r="10"/>
    <path d="M30 34h4"/>
  </>),
  cap: I(<>
    <path className="sage" d="M10 38c4-12 14-18 22-18s18 6 22 18z"/>
    <path d="M10 38c4-12 14-18 22-18s18 6 22 18z"/>
    <path d="M6 42h52"/>
    <path d="M32 20v8"/>
  </>),

  // ─── Bath / care ───
  toothbrush: I(<>
    <rect className="blush" x="26" y="44" width="12" height="12" rx="3"/>
    <rect x="26" y="44" width="12" height="12" rx="3"/>
    <rect x="29" y="6" width="6" height="40" rx="3"/>
    <path d="M27 48h10M27 52h10"/>
  </>),
  toothpaste: I(<>
    <path className="sage" d="M16 24h32v22a8 8 0 0 1-8 8H24a8 8 0 0 1-8-8z"/>
    <path d="M16 24h32v22a8 8 0 0 1-8 8H24a8 8 0 0 1-8-8z"/>
    <rect x="24" y="14" width="16" height="10" rx="2"/>
    <path d="M28 14v-4h8v4"/>
  </>),
  deodorant: I(<>
    <rect className="clay" x="20" y="22" width="24" height="34" rx="3"/>
    <rect x="20" y="22" width="24" height="34" rx="3"/>
    <rect x="24" y="10" width="16" height="12" rx="2"/>
    <path d="M22 32h20"/>
  </>),
  shampoo: I(<>
    <path className="blush" d="M16 24h32v28a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4z"/>
    <path d="M16 24h32v28a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4z"/>
    <path d="M22 12h20v12H22z"/>
    <path d="M26 30h12"/>
  </>),
  razor: I(<>
    <path className="sage" d="M16 8h32v10H16z"/>
    <path d="M16 8h32v10H16z"/>
    <path d="M20 18h24v6H20z"/>
    <rect x="30" y="24" width="4" height="34" rx="2"/>
  </>),
  sunscreen: I(<>
    <path className="blush" d="M14 22h36v30a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z"/>
    <path d="M14 22h36v30a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z"/>
    <rect x="22" y="12" width="20" height="10" rx="2"/>
    <circle cx="32" cy="40" r="5"/>
    <path d="M32 32v2M32 46v2M24 40h2M38 40h2"/>
  </>),
  pills: I(<>
    <rect className="blush" x="8" y="22" width="48" height="20" rx="10" transform="rotate(-15 32 32)"/>
    <rect x="8" y="22" width="48" height="20" rx="10" transform="rotate(-15 32 32)"/>
    <path d="M22 17l12 30" transform="rotate(-15 32 32)" />
  </>),
  towel: I(<>
    <path className="sage" d="M14 12h36v40H14z"/>
    <path d="M14 12h36v40H14z"/>
    <path d="M18 18h28M18 22h28M18 26h28"/>
    <path d="M14 46h36"/>
  </>),

  // ─── Clothing ───
  socks: I(<>
    <path className="blush" d="M22 8v22c0 4-10 8-10 18 0 5 4 8 9 8 6 0 12-2 14-8l9-16V8z"/>
    <path d="M22 8v22c0 4-10 8-10 18 0 5 4 8 9 8 6 0 12-2 14-8l9-16V8z"/>
    <path d="M22 16h22"/>
  </>),
  underwear: I(<>
    <path className="clay" d="M8 22h48v6c0 10-10 22-24 22S8 38 8 28z"/>
    <path d="M8 22h48v6c0 10-10 22-24 22S8 38 8 28z"/>
    <path d="M8 28h48"/>
  </>),
  tshirt: I(<>
    <path className="blush" d="M14 16l8-6h6c0 4 2 6 4 6s4-2 4-6h6l8 6-6 8-4-2v28H24V22l-4 2z"/>
    <path d="M14 16l8-6h6c0 4 2 6 4 6s4-2 4-6h6l8 6-6 8-4-2v28H24V22l-4 2z"/>
  </>),
  sweater: I(<>
    <path className="sage" d="M14 18l10-8h6c0 3 1 4 2 4s2-1 2-4h6l10 8-4 10-6-2v28c0 2-1 4-4 4H24c-3 0-4-2-4-4V26l-6 2z"/>
    <path d="M14 18l10-8h6c0 3 1 4 2 4s2-1 2-4h6l10 8-4 10-6-2v28c0 2-1 4-4 4H24c-3 0-4-2-4-4V26l-6 2z"/>
    <path d="M28 30h8M28 38h8"/>
  </>),
  pants: I(<>
    <path className="clay" d="M16 8h32v8l-4 40h-8l-4-26-4 26h-8l-4-40z"/>
    <path d="M16 8h32v8l-4 40h-8l-4-26-4 26h-8l-4-40z"/>
    <path d="M16 16h32"/>
  </>),
  pyjamas: I(<>
    <path className="blush" d="M12 14l8-4h24l8 4-4 8H16z"/>
    <path d="M12 14l8-4h24l8 4-4 8H16z"/>
    <path d="M16 22h32v14a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4z"/>
    <path d="M20 40v14h10v-14M34 40v14h10v-14"/>
  </>),
  swim: I(<>
    <path className="blush" d="M10 16h44v8c-4 8-4 14-10 30h-10l-2-18-2 18H20c-6-16-6-22-10-30z"/>
    <path d="M10 16h44v8c-4 8-4 14-10 30h-10l-2-18-2 18H20c-6-16-6-22-10-30z"/>
  </>),
  jacket: I(<>
    <path className="sage" d="M10 18l12-8h4l6 8 6-8h4l12 8-4 12-6-2v26H20V28l-6 2z"/>
    <path d="M10 18l12-8h4l6 8 6-8h4l12 8-4 12-6-2v26H20V28l-6 2z"/>
    <path d="M32 18v36"/>
    <circle cx="32" cy="30" r="1.2" fill="currentColor"/>
    <circle cx="32" cy="40" r="1.2" fill="currentColor"/>
  </>),

  // ─── Footwear ───
  shoes: I(<>
    <path className="clay" d="M6 38c10-2 12-12 22-12 14 0 14 12 30 12v6c0 2-2 4-4 4H10c-2 0-4-2-4-4z"/>
    <path d="M6 38c10-2 12-12 22-12 14 0 14 12 30 12v6c0 2-2 4-4 4H10c-2 0-4-2-4-4z"/>
    <path d="M28 32c0 4 4 6 8 6"/>
  </>),
  flipflops: I(<>
    <path className="blush" d="M16 14c-6 0-10 4-10 10s4 8 6 14 2 14 6 14 8-8 8-14V20c0-4-4-6-10-6z"/>
    <path d="M16 14c-6 0-10 4-10 10s4 8 6 14 2 14 6 14 8-8 8-14V20c0-4-4-6-10-6z"/>
    <path d="M14 18l4 4M18 18l-4 4"/>
  </>),

  // ─── Carry / hydrate / read ───
  backpack: I(<>
    <path className="sage" d="M16 22c0-8 6-14 16-14s16 6 16 14v32a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4z"/>
    <path d="M16 22c0-8 6-14 16-14s16 6 16 14v32a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4z"/>
    <rect x="22" y="32" width="20" height="14" rx="2"/>
    <path d="M22 22h20"/>
  </>),
  bottle: I(<>
    <rect className="blush" x="22" y="18" width="20" height="38" rx="6"/>
    <rect x="22" y="18" width="20" height="38" rx="6"/>
    <rect x="26" y="8" width="12" height="10" rx="2"/>
    <path d="M22 32h20"/>
  </>),
  book: I(<>
    <path className="clay" d="M10 14c10-4 18-4 22 0v40c-4-4-12-4-22 0z"/>
    <path className="blush" d="M54 14c-10-4-18-4-22 0v40c4-4 12-4 22 0z"/>
    <path d="M10 14c10-4 18-4 22 0v40c-4-4-12-4-22 0zM54 14c-10-4-18-4-22 0v40c4-4 12-4 22 0z"/>
    <path d="M32 14v40"/>
  </>),
  notebook: I(<>
    <path className="sage" d="M14 8h36v48H14z"/>
    <path d="M14 8h36v48H14z"/>
    <circle cx="14" cy="16" r="2"/>
    <circle cx="14" cy="26" r="2"/>
    <circle cx="14" cy="36" r="2"/>
    <circle cx="14" cy="46" r="2"/>
    <path d="M22 22h22M22 28h22M22 34h14"/>
  </>),

  // ─── Money ───
  cash: I(<>
    <rect className="sage" x="6" y="22" width="52" height="22" rx="2"/>
    <rect x="6" y="22" width="52" height="22" rx="2"/>
    <circle cx="32" cy="33" r="6"/>
    <path d="M14 33h2M48 33h2"/>
    <path d="M30 30v6M34 30v6"/>
  </>),

  // ─── Phone / laptop / accessories ───
  phone: I(<>
    <rect className="clay" x="20" y="6" width="24" height="52" rx="4"/>
    <rect x="20" y="6" width="24" height="52" rx="4"/>
    <path d="M28 11h8"/>
    <circle cx="32" cy="52" r="1.6" fill="currentColor"/>
  </>),
  laptop: I(<>
    <rect className="clay" x="10" y="14" width="44" height="28" rx="2"/>
    <rect x="10" y="14" width="44" height="28" rx="2"/>
    <path d="M4 46h56l-4 6H8z"/>
    <path d="M14 18h36v20H14z" className="blush"/>
    <path d="M14 18h36v20H14z"/>
    <path d="M27 49h10"/>
  </>),
  laptopcharger: I(<>
    <rect className="clay" x="16" y="22" width="28" height="20" rx="3"/>
    <rect x="16" y="22" width="28" height="20" rx="3"/>
    <path d="M44 30c6 0 10-2 14-4M44 34c6 0 10 2 14 4"/>
    <path d="M16 38c-4 6-6 10-12 14"/>
    <circle cx="30" cy="32" r="1.6" fill="currentColor"/>
  </>),
  hub: I(<>
    <rect className="blush" x="6" y="22" width="42" height="20" rx="3"/>
    <rect x="6" y="22" width="42" height="20" rx="3"/>
    <rect x="11" y="28" width="6" height="8" rx="1"/>
    <rect x="21" y="28" width="6" height="8" rx="1"/>
    <rect x="31" y="28" width="6" height="8" rx="1"/>
    <path d="M48 32c6 0 8 0 10-4"/>
  </>),
  mouse: I(<>
    <path className="clay" d="M32 8c-8 0-14 6-14 14v22c0 6 6 12 14 12s14-6 14-12V22c0-8-6-14-14-14z"/>
    <path d="M32 8c-8 0-14 6-14 14v22c0 6 6 12 14 12s14-6 14-12V22c0-8-6-14-14-14z"/>
    <path d="M32 10v18"/>
    <path d="M18 28h28"/>
  </>),

  // ─── Health ───
  retainer: I(<>
    <path className="blush" d="M10 22c0 14 8 30 22 30s22-16 22-30"/>
    <path d="M10 22c0 14 8 30 22 30s22-16 22-30"/>
    <path d="M16 24c2 12 8 22 16 22s14-10 16-22"/>
    <path d="M22 26l3 4M30 28l3 4M38 28l3 4"/>
  </>),
  contacts: I(<>
    <rect className="blush" x="6" y="22" width="20" height="20" rx="10"/>
    <rect x="6" y="22" width="20" height="20" rx="10"/>
    <circle cx="16" cy="32" r="3"/>
    <rect className="sage" x="38" y="22" width="20" height="20" rx="10"/>
    <rect x="38" y="22" width="20" height="20" rx="10"/>
    <circle cx="48" cy="32" r="3"/>
    <path d="M26 32h12"/>
  </>),

  // ─── Hygiene & care ───
  perfume: I(<>
    <path className="blush" d="M20 24h24v30a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4z"/>
    <path d="M20 24h24v30a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4z"/>
    <rect x="28" y="16" width="8" height="8"/>
    <rect x="36" y="12" width="14" height="6" rx="1"/>
    <path d="M22 36h20"/>
  </>),
  hairbrush: I(<>
    <rect className="blush" x="22" y="6" width="20" height="28" rx="10"/>
    <rect x="22" y="6" width="20" height="28" rx="10"/>
    <circle cx="28" cy="14" r="1.2" fill="currentColor"/>
    <circle cx="36" cy="14" r="1.2" fill="currentColor"/>
    <circle cx="32" cy="20" r="1.2" fill="currentColor"/>
    <circle cx="28" cy="26" r="1.2" fill="currentColor"/>
    <circle cx="36" cy="26" r="1.2" fill="currentColor"/>
    <rect x="29" y="34" width="6" height="24" rx="3"/>
  </>),
  hairtie: I(<>
    <circle className="blush" cx="32" cy="32" r="22"/>
    <circle cx="32" cy="32" r="22"/>
    <circle cx="32" cy="32" r="10" fill="var(--bg)"/>
    <circle cx="32" cy="32" r="10"/>
    <path d="M14 22c4-2 12-4 18-2M50 42c-4 2-12 4-18 2M22 50c-2-4-2-12 0-18M42 14c2 4 2 12 0 18"/>
  </>),
  hairproducts: I(<>
    <path className="sage" d="M22 22h20v32a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z"/>
    <path d="M22 22h20v32a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z"/>
    <path d="M28 22v-6h8v6"/>
    <rect x="32" y="6" width="4" height="10" rx="1"/>
    <path d="M36 8h6"/>
    <path d="M26 36h12M26 42h8"/>
  </>),
  facemoist: I(<>
    <path className="blush" d="M22 22h20v30a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z"/>
    <path d="M22 22h20v30a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z"/>
    <rect x="26" y="14" width="12" height="8" rx="1.5"/>
    <path d="M26 32h12M26 38h8"/>
  </>),
  bodymoist: I(<>
    <rect className="clay" x="12" y="22" width="40" height="32" rx="4"/>
    <rect x="12" y="22" width="40" height="32" rx="4"/>
    <rect x="16" y="14" width="32" height="8" rx="2"/>
    <path d="M20 36c4-2 8-2 12 0s8 2 12 0"/>
  </>),
  eyesun: I(<>
    <path className="blush" d="M22 24h20v26a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z"/>
    <path d="M22 24h20v26a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z"/>
    <rect x="26" y="16" width="12" height="8" rx="2"/>
    <path d="M24 40c2-3 6-4 8-4s6 1 8 4c-2 3-6 4-8 4s-6-1-8-4z"/>
    <circle cx="32" cy="40" r="1.6" fill="currentColor"/>
  </>),

  // ─── Clothing (additions) ───
  outfits: I(<>
    <rect className="blush" x="10" y="14" width="44" height="10" rx="2"/>
    <rect x="10" y="14" width="44" height="10" rx="2"/>
    <rect className="sage" x="10" y="28" width="44" height="10" rx="2"/>
    <rect x="10" y="28" width="44" height="10" rx="2"/>
    <rect className="clay" x="10" y="42" width="44" height="10" rx="2"/>
    <rect x="10" y="42" width="44" height="10" rx="2"/>
  </>),
  gymclothes: I(<>
    <path className="sage" d="M22 12l-6 6 6 4v30a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V22l6-4-6-6h-6c-2 4-4 4-4 4s-2 0-4-4z"/>
    <path d="M22 12l-6 6 6 4v30a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V22l6-4-6-6h-6c-2 4-4 4-4 4s-2 0-4-4z"/>
    <path d="M28 30h8"/>
  </>),
  sneakers: I(<>
    <path className="blush" d="M4 42c2-2 4-12 16-12 8 0 12 4 16 6s20 0 22 6v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/>
    <path d="M4 42c2-2 4-12 16-12 8 0 12 4 16 6s20 0 22 6v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/>
    <path d="M14 36l4 4M20 34l4 4M26 33l4 4"/>
    <path d="M4 46h56"/>
  </>),
  duffel: I(<>
    <path className="sage" d="M6 24h52v22a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z"/>
    <path d="M6 24h52v22a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z"/>
    <path d="M22 24c0-4 4-6 10-6s10 2 10 6"/>
    <path d="M22 18h2M40 18h2"/>
    <path d="M6 34h52"/>
  </>),

  // ─── Power bank — rectangular brick with lightning + LED bar ───
  powerbank: I(<>
    <rect className="clay" x="14" y="14" width="36" height="36" rx="4"/>
    <rect x="14" y="14" width="36" height="36" rx="4"/>
    <path d="M32 22l-5 9h6l-5 9" strokeLinejoin="miter"/>
    <rect x="20" y="44" width="14" height="3" rx="1.5"/>
  </>),

  // ─── Body sunblock — taller bottle, sun on side ───
  bodysun: I(<>
    <path className="sage" d="M20 18h24v36a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4z"/>
    <path d="M20 18h24v36a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4z"/>
    <rect x="26" y="8" width="12" height="10" rx="2"/>
    <circle cx="32" cy="36" r="4"/>
    <path d="M32 28v2M32 42v2M26 36h2M38 36h2M27.5 31.5l1.5 1.5M36.5 31.5l-1.5 1.5M27.5 40.5l1.5-1.5M36.5 40.5l-1.5-1.5"/>
  </>),

  // ─── Umbrella — canopy with hook handle ───
  umbrella: I(<>
    <path className="blush" d="M4 32c0-12 12-22 28-22s28 10 28 22z"/>
    <path d="M4 32c0-12 12-22 28-22s28 10 28 22z"/>
    <path d="M18 32c2-10 8-18 14-18M46 32c-2-10-8-18-14-18"/>
    <path d="M32 10v-4"/>
    <path d="M32 32v18c0 4-2 6-6 6s-6-2-6-4"/>
  </>),
};
