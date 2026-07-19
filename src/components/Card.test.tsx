import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card } from './Card';
import type { PackingItem } from '../types';

const item: PackingItem = { id: 'passport', label: 'Passport', illu: 'passport' };

describe('Card', () => {
  it('renders the label (present on both faces by design)', () => {
    render(<Card item={item} packed={false} onToggle={() => {}} />);
    expect(screen.getAllByText('Passport')).toHaveLength(2);
  });

  it('is a focusable button with aria-pressed reflecting packed state', () => {
    const { rerender } = render(<Card item={item} packed={false} onToggle={() => {}} />);
    const card = screen.getByRole('button', { name: /Passport/ });
    expect(card).toHaveAttribute('tabindex', '0');
    expect(card).toHaveAttribute('aria-pressed', 'false');
    rerender(<Card item={item} packed onToggle={() => {}} />);
    expect(screen.getByRole('button', { name: /Passport/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('adds the packed class and renders the Packed badge', () => {
    render(<Card item={item} packed onToggle={() => {}} />);
    expect(screen.getByRole('button', { name: /Passport/ })).toHaveClass('packed');
    expect(screen.getByText(/Packed/)).toBeInTheDocument();
  });

  it('calls onToggle(id) on click', async () => {
    const onToggle = vi.fn();
    render(<Card item={item} packed={false} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole('button', { name: /Passport/ }));
    expect(onToggle).toHaveBeenCalledWith('passport');
  });

  it('toggles on Enter and Space when focused', async () => {
    const onToggle = vi.fn();
    render(<Card item={item} packed={false} onToggle={onToggle} />);
    screen.getByRole('button', { name: /Passport/ }).focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onToggle).toHaveBeenCalledTimes(2);
  });

  it('ignores auto-repeat so holding a key does not spam-toggle', () => {
    const onToggle = vi.fn();
    render(<Card item={item} packed={false} onToggle={onToggle} />);
    const card = screen.getByRole('button', { name: /Passport/ });
    // A held key fires repeated keydowns (event.repeat === true) — these must
    // not toggle, otherwise the count ping-pongs while the key is down.
    fireEvent.keyDown(card, { key: 'Enter', repeat: true });
    fireEvent.keyDown(card, { key: ' ', repeat: true });
    expect(onToggle).not.toHaveBeenCalled();
  });
});
