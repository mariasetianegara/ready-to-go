// Toolchain smoke test — proves Vitest + JSX + jest-dom wiring end to end.
import { render, screen } from '@testing-library/react';

describe('toolchain', () => {
  it('renders JSX and asserts through jest-dom', () => {
    render(<h1>Ready to Go</h1>);
    expect(screen.getByRole('heading', { name: 'Ready to Go' })).toBeInTheDocument();
  });
});
