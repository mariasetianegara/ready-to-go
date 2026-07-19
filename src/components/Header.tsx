import { ignoreKeyRepeat } from '../lib/ignoreKeyRepeat';

interface HeaderProps {
  count: number;
  total: number;
  pct: number;
  onReset: () => void;
}

export function Header({ count, total, pct, onReset }: HeaderProps) {
  const canReset = count > 0;
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-row">
          <h1 className="app-title">Ready to Go</h1>
          <span className="counter">
            <b>{count}</b> / {total} packed
          </span>
        </div>
        <div className="progress-row">
          <div className="progress" aria-hidden="true">
            <span style={{ width: `${pct}%` }} />
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onReset}
            onKeyDown={ignoreKeyRepeat}
            disabled={!canReset}
            style={canReset ? undefined : { opacity: 0.4, cursor: 'default' }}
          >
            Reset
          </button>
        </div>
      </div>
    </header>
  );
}
