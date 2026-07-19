import { act, renderHook } from '@testing-library/react';
import { usePackedState } from './usePackedState';
import { STORAGE_KEY } from '../lib/storage';
import type { PackingItem } from '../types';

const items: PackingItem[] = [
  { id: 'passport', label: 'Passport', illu: 'passport' },
  { id: 'keys', label: 'Keys', illu: 'keys' },
  { id: 'phone', label: 'Phone', illu: 'phone' },
];

beforeEach(() => localStorage.clear());

describe('usePackedState', () => {
  it('starts empty with no saved state', () => {
    const { result } = renderHook(() => usePackedState(items));
    expect(result.current.count).toBe(0);
    expect(result.current.total).toBe(3);
    expect(result.current.allPacked).toBe(false);
  });

  it('restores saved packed ids on init', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['passport', 'keys']));
    const { result } = renderHook(() => usePackedState(items));
    expect(result.current.packed).toEqual(new Set(['passport', 'keys']));
    expect(result.current.count).toBe(2);
  });

  it('drops orphan ids not in items (TC-5.5)', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['passport', 'ghost-item']));
    const { result } = renderHook(() => usePackedState(items));
    expect(result.current.packed).toEqual(new Set(['passport']));
    expect(result.current.count).toBe(1);
  });

  it('treats items not present in storage as unpacked (TC-5.6)', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['passport']));
    const { result } = renderHook(() => usePackedState(items));
    expect(result.current.packed.has('phone')).toBe(false);
  });

  it('toggle adds then removes, writing through to storage', () => {
    const { result } = renderHook(() => usePackedState(items));
    act(() => result.current.toggle('passport'));
    expect(result.current.count).toBe(1);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toContain('passport');
    act(() => result.current.toggle('passport'));
    expect(result.current.count).toBe(0);
  });

  it('reset clears all packed state and storage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['passport', 'keys']));
    const { result } = renderHook(() => usePackedState(items));
    act(() => result.current.reset());
    expect(result.current.count).toBe(0);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([]);
  });

  it('derives pct and allPacked', () => {
    const { result } = renderHook(() => usePackedState(items));
    act(() => result.current.toggle('passport'));
    expect(result.current.pct).toBeCloseTo(100 / 3);
    act(() => {
      result.current.toggle('keys');
      result.current.toggle('phone');
    });
    expect(result.current.allPacked).toBe(true);
    expect(result.current.pct).toBe(100);
  });
});
