import { renderHook } from '@testing-library/react';
import { useScrollLock } from './useScrollLock';

function setViewport(innerWidth: number, clientWidth: number) {
  Object.defineProperty(window, 'innerWidth', { value: innerWidth, configurable: true, writable: true });
  Object.defineProperty(document.documentElement, 'clientWidth', { value: clientWidth, configurable: true });
}

describe('useScrollLock', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    Object.defineProperty(window, 'scrollY', { value: 120, configurable: true, writable: true });
    setViewport(1000, 1000); // no scrollbar by default
  });
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.removeAttribute('style');
  });

  it('does nothing while not locked', () => {
    renderHook(() => useScrollLock(false));
    expect(document.body.style.position).toBe('');
  });

  it('pins the body in place while locked (iOS-safe: fixed + negative top)', () => {
    renderHook(() => useScrollLock(true));
    expect(document.body.style.position).toBe('fixed');
    expect(document.body.style.top).toBe('-120px');
    expect(document.body.style.width).toBe('100%');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('pads the body by the scrollbar width so content does not shift', () => {
    setViewport(1000, 985); // 15px classic scrollbar
    const { unmount } = renderHook(() => useScrollLock(true));
    expect(document.body.style.paddingRight).toBe('15px');
    unmount();
    expect(document.body.style.paddingRight).toBe('');
  });

  it('adds no padding when the scrollbar takes no width (mobile overlay)', () => {
    setViewport(400, 400);
    renderHook(() => useScrollLock(true));
    expect(document.body.style.paddingRight).toBe('0px');
  });

  it('restores body styles and the scroll position on unlock', () => {
    const { unmount } = renderHook(() => useScrollLock(true));
    expect(document.body.style.position).toBe('fixed');

    unmount(); // runs the effect cleanup
    expect(document.body.style.position).toBe('');
    expect(document.body.style.top).toBe('');
    expect(document.body.style.width).toBe('');
    expect(window.scrollTo).toHaveBeenCalledWith(0, 120);
  });
});
