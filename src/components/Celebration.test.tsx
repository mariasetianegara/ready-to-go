import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Celebration } from './Celebration';

describe('Celebration', () => {
  it('renders nothing when not shown (D11 — render only when open)', () => {
    const { container } = render(<Celebration show={false} onDismiss={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the luggage, banner copy and Close when shown', () => {
    render(<Celebration show onDismiss={() => {}} />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Bon voyage!');
    expect(screen.getByText("Everything's in the suitcase.")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('announces politely for screen readers (role=status)', () => {
    render(<Celebration show onDismiss={() => {}} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders the 36 deterministic confetti pieces', () => {
    const { container } = render(<Celebration show onDismiss={() => {}} />);
    expect(container.querySelectorAll('.confetti i')).toHaveLength(36);
  });

  it('moves focus to Close when shown, and restores it on close (G8)', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const { rerender } = render(<Celebration show onDismiss={() => {}} />);
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();

    rerender(<Celebration show={false} onDismiss={() => {}} />);
    expect(trigger).toHaveFocus();
    trigger.remove();
  });

  it('dismisses on Close click', async () => {
    const onDismiss = vi.fn();
    render(<Celebration show onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does NOT dismiss on Escape — Close only (TC-7.3)', async () => {
    const onDismiss = vi.fn();
    render(<Celebration show onDismiss={onDismiss} />);
    await userEvent.keyboard('{Escape}');
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
