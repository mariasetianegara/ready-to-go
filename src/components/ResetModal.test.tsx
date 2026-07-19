import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResetModal } from './ResetModal';

describe('ResetModal', () => {
  it('renders nothing when closed (D11)', () => {
    render(<ResetModal open={false} onConfirm={() => {}} onCancel={() => {}} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders title, body and both buttons when open (TC-6.4)', () => {
    render(<ResetModal open onConfirm={() => {}} onCancel={() => {}} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('heading', { name: /Really reset everything/ })).toBeInTheDocument();
    expect(screen.getByText("You'll restart from scratch.")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
  });

  it('calls onConfirm when Yes is clicked', async () => {
    const onConfirm = vi.fn();
    render(<ResetModal open onConfirm={onConfirm} onCancel={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: 'Yes' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('cancels via Cancel, Esc, and scrim click — all the same outcome', async () => {
    const onCancel = vi.fn();
    render(<ResetModal open onConfirm={() => {}} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByRole('dialog').parentElement!); // the scrim
    expect(onCancel).toHaveBeenCalledTimes(3);
  });

  it('does NOT cancel when clicking inside the modal card', () => {
    const onCancel = vi.fn();
    render(<ResetModal open onConfirm={() => {}} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('moves focus into the dialog on open and restores it on close (G8)', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    const { rerender } = render(<ResetModal open onConfirm={() => {}} onCancel={() => {}} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    rerender(<ResetModal open={false} onConfirm={() => {}} onCancel={() => {}} />);
    expect(trigger).toHaveFocus();
    trigger.remove();
  });
});
