import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('renders the title and the "X / N packed" counter', () => {
    render(<Header count={3} total={40} pct={7.5} onReset={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Ready to Go' })).toBeInTheDocument();
    expect(screen.getByText(/packed/)).toHaveTextContent('3 / 40 packed');
  });

  it('disables Reset when count is 0', () => {
    render(<Header count={0} total={40} pct={0} onReset={() => {}} />);
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled();
  });

  it('enables Reset when count > 0', () => {
    render(<Header count={1} total={40} pct={2.5} onReset={() => {}} />);
    expect(screen.getByRole('button', { name: 'Reset' })).toBeEnabled();
  });
});
