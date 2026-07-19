import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Walking skeleton — proves the toolchain + CI → Pages pipeline end to end.
// The real app replaces this entry in the next change.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <h1>Ready to Go</h1>
  </StrictMode>,
);
