import { reducer } from '@/hooks/use-toast';

describe('useToast reducer', () => {
  test('ADD_TOAST adds a toast', () => {
    const state = { toasts: [] };
    const toast = { id: '1', open: true } as any;
    const newState = reducer(state, { type: 'ADD_TOAST', toast });
    expect(newState.toasts).toHaveLength(1);
    expect(newState.toasts[0]).toEqual(toast);
  });

  test('UPDATE_TOAST updates an existing toast', () => {
    const state = { toasts: [{ id: '1', title: 'old', open: true }] } as any;
    const updated = reducer(state, { type: 'UPDATE_TOAST', toast: { id: '1', title: 'new' } });
    expect(updated.toasts[0].title).toBe('new');
  });

  test('DISMISS_TOAST marks toast closed', () => {
    const state = { toasts: [{ id: '1', open: true }] } as any;
    const dismissed = reducer(state, { type: 'DISMISS_TOAST', toastId: '1' });
    expect(dismissed.toasts[0].open).toBe(false);
  });

  test('DISMISS_TOAST without id closes all', () => {
    const state = { toasts: [{ id: '1', open: true }, { id: '2', open: true }] } as any;
    const dismissed = reducer(state, { type: 'DISMISS_TOAST' });
    expect(dismissed.toasts.every(t => !t.open)).toBe(true);
  });

  test('REMOVE_TOAST removes single toast', () => {
    const state = { toasts: [{ id: '1' }, { id: '2' }] } as any;
    const removed = reducer(state, { type: 'REMOVE_TOAST', toastId: '1' });
    expect(removed.toasts).toHaveLength(1);
    expect(removed.toasts[0].id).toBe('2');
  });

  test('REMOVE_TOAST without id clears all', () => {
    const state = { toasts: [{ id: '1' }, { id: '2' }] } as any;
    const removed = reducer(state, { type: 'REMOVE_TOAST' });
    expect(removed.toasts).toHaveLength(0);
  });
});
