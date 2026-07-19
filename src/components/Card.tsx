import type { PackingItem } from '../types';
import { ILLUSTRATIONS } from '../illustrations/illustrations';

interface CardProps {
  item: PackingItem;
  packed: boolean;
  onToggle: (id: string) => void;
}

export function Card({ item, packed, onToggle }: CardProps) {
  const illu = ILLUSTRATIONS[item.illu];
  const label = (
    <div className="label">
      <span className="lbl">{item.label}</span>
    </div>
  );
  return (
    <div
      className={packed ? 'card packed' : 'card'}
      role="button"
      tabIndex={0}
      aria-pressed={packed}
      aria-label={`${item.label} — ${packed ? 'packed' : 'to pack'}`}
      onClick={() => onToggle(item.id)}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (e.repeat) return; // ignore auto-repeat from a held key (no spam-toggle)
          onToggle(item.id);
        }
      }}
    >
      <div className="card-flip">
        {/* Front — unpacked */}
        <div className="face front">
          <div className="illu-slot">{illu}</div>
          {label}
        </div>
        {/* Back — packed */}
        <div className="face back">
          <span className="badge">Packed ✓</span>
          <div className="illu-slot">{illu}</div>
          {label}
        </div>
      </div>
    </div>
  );
}
