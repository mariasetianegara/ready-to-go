import { useEffect, useRef } from 'react';
import { useScrollLock } from '../hooks/useScrollLock';
import { ignoreKeyRepeat } from '../lib/ignoreKeyRepeat';

interface ResetModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ResetModal({ open, onConfirm, onCancel }: ResetModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  // Keep a live ref to onCancel so the effect only depends on `open`
  // (avoids re-running — and re-stealing focus — on every render).
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  useScrollLock(open); // freeze the page behind the dialog while it's open

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusables = modalRef.current
      ? Array.from(modalRef.current.querySelectorAll<HTMLElement>('button'))
      : [];
    focusables[0]?.focus(); // move focus into the dialog

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancelRef.current();
        return;
      }
      // Trap Tab / Shift+Tab within the dialog's buttons.
      if (e.key === 'Tab' && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus({ preventScroll: true }); // restore focus, no scroll jump
    };
  }, [open]);

  if (!open) return null; // D11: only in the DOM when open

  return (
    <div className="scrim open" onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-title"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="reset-title">Really reset everything?</h2>
        <p>You'll restart from scratch.</p>
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onCancel} onKeyDown={ignoreKeyRepeat}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onConfirm}
            onKeyDown={ignoreKeyRepeat}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
