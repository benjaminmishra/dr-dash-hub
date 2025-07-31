import { renderHook, act } from '@testing-library/react';
import { useToast } from '@/hooks/use-toast';

beforeEach(() => {
  jest.useFakeTimers();
  jest.resetModules();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('useToast integration', () => {
  test('update and dismiss lifecycle', () => {
    const { result } = renderHook(() => useToast());

    let created: { id: string; update: Function; dismiss: Function };
    act(() => {
      created = result.current.toast({ title: 'Toast' });
    });
    expect(result.current.toasts[0].title).toBe('Toast');

    act(() => {
      created.update({ id: created.id, title: 'Updated' });
    });
    expect(result.current.toasts[0].title).toBe('Updated');

    act(() => {
      result.current.dismiss();
    });
    expect(result.current.toasts[0].open).toBe(false);

    act(() => {
      // simulate closing via onOpenChange callback
      (result.current.toasts[0].onOpenChange as any)(false);
      jest.runAllTimers();
    });
    expect(result.current.toasts).toHaveLength(0);
  });
});
