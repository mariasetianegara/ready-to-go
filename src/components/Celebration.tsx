import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { CONFETTI } from '../lib/confetti';
import { useScrollLock } from '../hooks/useScrollLock';
import { ignoreKeyRepeat } from '../lib/ignoreKeyRepeat';

interface CelebrationProps {
  show: boolean;
  onDismiss: () => void;
}

export function Celebration({ show, onDismiss }: CelebrationProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  useScrollLock(show); // blocking overlay — freeze the page behind it

  useEffect(() => {
    if (!show) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusables = rootRef.current
      ? Array.from(rootRef.current.querySelectorAll<HTMLElement>('button'))
      : [];
    focusables[0]?.focus(); // move focus onto Close

    // Close-only: Escape must NOT dismiss the blocking overlay. We still trap
    // Tab so keyboard focus can't slip back to the cards behind it (G8).
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus({ preventScroll: true }); // restore focus, no scroll jump
    };
  }, [show]);

  if (!show) return null; // D11: only in the DOM when shown

  return (
    <div className="celebrate show" ref={rootRef}>
      <div className="confetti" aria-hidden="true">
        {CONFETTI.map((c, i) => (
          <i
            key={i}
            style={
              {
                left: c.left,
                width: `${c.w}px`,
                height: `${c.h}px`,
                background: c.bg,
                transform: `rotate(${c.rot})`,
                animationDelay: c.delay,
                animationDuration: c.dur,
                '--dx': c.dx,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="celebrate-banner" role="status" aria-live="polite">
        <span className="luggage" aria-hidden="true">
          🧳
        </span>
        <h2>Bon voyage!</h2>
        <p>Everything's in the suitcase.</p>
        <button
          type="button"
          className="btn celebrate-dismiss"
          onClick={onDismiss}
          onKeyDown={ignoreKeyRepeat}
        >
          Close
        </button>
      </div>
    </div>
  );
}
