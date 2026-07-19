import type { KeyboardEvent } from 'react';
import { ignoreKeyRepeat } from './ignoreKeyRepeat';

const fakeEvent = (repeat: boolean) =>
  ({ repeat, preventDefault: vi.fn() }) as unknown as KeyboardEvent & {
    preventDefault: ReturnType<typeof vi.fn>;
  };

describe('ignoreKeyRepeat', () => {
  it('cancels an auto-repeat keydown so a held key does not re-fire the button', () => {
    const e = fakeEvent(true);
    ignoreKeyRepeat(e);
    expect(e.preventDefault).toHaveBeenCalledTimes(1);
  });

  it('leaves the first (non-repeat) keydown untouched', () => {
    const e = fakeEvent(false);
    ignoreKeyRepeat(e);
    expect(e.preventDefault).not.toHaveBeenCalled();
  });
});
