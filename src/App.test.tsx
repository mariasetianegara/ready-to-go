import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { PACKING_ITEMS } from './data/items';
import { savePacked } from './lib/storage';

beforeEach(() => localStorage.clear());

// Seed localStorage as if everything except `exceptId` were already packed,
// so a single click can cross the list into "all packed".
function seedAllExcept(exceptId: string) {
  savePacked(new Set(PACKING_ITEMS.filter((i) => i.id !== exceptId).map((i) => i.id)));
}

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Ready to Go' })).toBeInTheDocument();
  });

  it('renders one card per item, data-driven (TC-1.1)', () => {
    render(<App />);
    const cards = screen.getAllByRole('button', { name: /to pack|packed/ });
    expect(cards).toHaveLength(PACKING_ITEMS.length);
  });

  it('shows the counter at 0 / N on first load (TC-4.3)', () => {
    render(<App />);
    expect(screen.getByText(/packed/)).toHaveTextContent(`0 / ${PACKING_ITEMS.length} packed`);
  });

  it('opens the reset dialog and Yes clears everything (TC-6.3, 6.5)', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /Passport/ })); // pack one
    await userEvent.click(screen.getByRole('button', { name: 'Reset' })); // open dialog
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Yes' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByText(/packed/)).toHaveTextContent(`0 / ${PACKING_ITEMS.length} packed`);
  });
});

describe('App — celebration trigger', () => {
  const passport = PACKING_ITEMS.find((i) => i.label === 'Passport')!;
  const last = new RegExp(`^${passport.label} — `); // the one card left to pack

  it('fires the celebration when the last item is packed (TC-7.1)', async () => {
    seedAllExcept(passport.id);
    render(<App />);
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull(); // not yet

    await userEvent.click(screen.getByRole('button', { name: last }));
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Bon voyage/ })).toBeInTheDocument();
  });

  it('does NOT fire on load when already at N/N (TC-7.2)', () => {
    savePacked(new Set(PACKING_ITEMS.map((i) => i.id))); // everything already packed
    render(<App />);
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it('Close dismisses without clearing progress, and does not re-fire while still full (TC-7.4)', async () => {
    seedAllExcept(passport.id);
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: last }));

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull(); // gone
    // Progress untouched — still all packed.
    expect(screen.getByText(/packed/)).toHaveTextContent(
      `${PACKING_ITEMS.length} / ${PACKING_ITEMS.length} packed`,
    );
  });

  it('re-fires on every fresh <N→N crossing after a dismiss (G1)', async () => {
    seedAllExcept(passport.id);
    render(<App />);
    const packed = new RegExp(`^${passport.label} — packed$`);

    await userEvent.click(screen.getByRole('button', { name: last }));
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    // Unpack one, then repack it — should celebrate again.
    await userEvent.click(screen.getByRole('button', { name: packed }));
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: last }));
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});
