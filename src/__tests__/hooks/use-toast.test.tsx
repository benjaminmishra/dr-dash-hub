import { renderHook, act } from '@testing-library/react';
import { useToast } from '@/hooks/use-toast';
import { ToastActionElement } from '@/components/ui/toast';

// Don't mock the toast hook, we want to test the actual implementation
jest.unmock('@/hooks/use-toast');

describe('useToast Hook', () => {
  beforeEach(() => {
    // Reset the toast state between tests
    jest.clearAllMocks();
  });

  test('toast function returns expected toast object', () => {
    const { result } = renderHook(() => useToast());
    
    // Call the toast function with various parameters
    let toast;
    act(() => {
      toast = result.current.toast({
        title: 'Test Title',
        description: 'Test Description',
        variant: 'default',
      });
    });
    
    // Check if the returned toast object has the expected properties
    expect(toast).toHaveProperty('id');
    expect(toast).toHaveProperty('dismiss');
    expect(toast).toHaveProperty('update');
    
    // The toast function doesn't return the toast properties, only control functions
    // Let's check if the toast was added to the state
    expect(result.current.toasts.length).toBeGreaterThan(0);
    const addedToast = result.current.toasts[0];
    expect(addedToast.title).toBe('Test Title');
    expect(addedToast.description).toBe('Test Description');
  });
  
  test('toast function with action', () => {
    const { result } = renderHook(() => useToast());
    
    const action: ToastActionElement = {
      altText: 'Test Alt Text',
      onClick: jest.fn(),
      children: 'Action',
    } as any;
    
    let toast;
    act(() => {
      toast = result.current.toast({
        title: 'Test Title',
        description: 'Test Description',
        action,
      });
    });
    
    // Check if the action was added to the toast in the state
    const addedToast = result.current.toasts[0];
    expect(addedToast.action).toBe(action);
  });
  
  test('toast function with different variants', () => {
    const { result } = renderHook(() => useToast());
    
    let destructiveToast;
    
    act(() => {
      destructiveToast = result.current.toast({
        title: 'Error',
        description: 'Operation failed',
        variant: 'destructive',
      });
    });
    
    // Check the variant in the state
    expect(result.current.toasts[0].variant).toBe('destructive');
  });
  
  test('dismiss function', () => {
    const { result } = renderHook(() => useToast());
    
    // Create a toast
    let toast;
    act(() => {
      toast = result.current.toast({
        title: 'Test Title',
      });
    });
    
    // Get the initial count of toasts
    const initialCount = result.current.toasts.length;
    
    // Dismiss the toast
    act(() => {
      result.current.dismiss(toast.id);
    });
    
    // The toast should be marked as closed but not removed immediately
    expect(result.current.toasts.length).toBe(initialCount);
    expect(result.current.toasts[0].open).toBe(false);
  });
  
  test('toast function with custom duration', () => {
    const { result } = renderHook(() => useToast());
    
    let toast;
    act(() => {
      toast = result.current.toast({
        title: 'Test Title',
        description: 'Test Description',
        duration: 5000,
      });
    });
    
    // Check if the duration was added to the toast in the state
    const addedToast = result.current.toasts[0];
    expect(addedToast.duration).toBe(5000);
  });
});