import { useEffect, useRef, useState } from 'react';
import { PACKING_ITEMS } from './data/items';
import { usePackedState } from './hooks/usePackedState';
import { shouldCelebrate } from './lib/celebration';
import { Card } from './components/Card';
import { Header } from './components/Header';
import { ResetModal } from './components/ResetModal';
import { Celebration } from './components/Celebration';

export default function App() {
  const { packed, count, total, pct, allPacked, toggle, reset } = usePackedState(PACKING_ITEMS);
  const [showReset, setShowReset] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Remember whether the list was already full, seeded FROM the loaded state so
  // opening at N/N is not a transition (no celebration on load, TC-7.2). The
  // celebration then re-fires on every fresh <N→N crossing (G1).
  const wasAllPacked = useRef(allPacked);
  useEffect(() => {
    if (shouldCelebrate(wasAllPacked.current, allPacked)) setShowCelebration(true);
    if (!allPacked) setShowCelebration(false); // dropped below N → ensure it's hidden
    wasAllPacked.current = allPacked;
  }, [allPacked]);

  return (
    <div className="app">
      <Header count={count} total={total} pct={pct} onReset={() => setShowReset(true)} />

      <main className="grid-wrap">
        <div className="grid">
          {PACKING_ITEMS.map((item) => (
            <Card
              key={item.id}
              item={item}
              packed={packed.has(item.id)}
              onToggle={toggle}
            />
          ))}
        </div>
      </main>

      <ResetModal
        open={showReset}
        onConfirm={() => {
          reset();
          setShowReset(false);
        }}
        onCancel={() => setShowReset(false)}
      />

      <Celebration show={showCelebration} onDismiss={() => setShowCelebration(false)} />
    </div>
  );
}
