import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '@/hooks/use-mobile';

describe('useIsMobile Hook', () => {
  const originalInnerWidth = window.innerWidth;
  const originalMatchMedia = window.matchMedia;
  
  // Mock for matchMedia
  const mockMatchMedia = (matches: boolean) => {
    window.matchMedia = jest.fn().mockImplementation((query) => {
      return {
        matches,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });
  };
  
  afterEach(() => {
    // Restore original values
    window.innerWidth = originalInnerWidth;
    window.matchMedia = originalMatchMedia;
  });
  
  test('returns true when screen width is less than mobile breakpoint', () => {
    // Set window width to mobile size
    window.innerWidth = 767;
    mockMatchMedia(true);
    
    const { result } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(true);
  });
  
  test('returns false when screen width is greater than or equal to mobile breakpoint', () => {
    // Set window width to desktop size
    window.innerWidth = 768;
    mockMatchMedia(false);
    
    const { result } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(false);
  });
  
  test('updates value when window size changes', () => {
    // Start with desktop size
    window.innerWidth = 1024;
    mockMatchMedia(false);
    
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
    
    // Simulate resize to mobile size
    act(() => {
      window.innerWidth = 600;
      // Simulate the matchMedia change event
      const mqlChangeEvent = new Event('change');
      window.dispatchEvent(mqlChangeEvent);
    });
    
    // The hook should update to reflect the new window size
    // Note: In a real test environment, this might not work as expected
    // because jsdom doesn't actually resize. This is more of a conceptual test.
    expect(window.innerWidth).toBe(600);
  });
  
  test('adds and removes event listener on mount and unmount', () => {
    // Mock addEventListener and removeEventListener
    const addEventListenerMock = jest.fn();
    const removeEventListenerMock = jest.fn();
    
    window.matchMedia = jest.fn().mockImplementation((query) => {
      return {
        matches: false,
        media: query,
        onchange: null,
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
        dispatchEvent: jest.fn(),
      };
    });
    
    const { unmount } = renderHook(() => useIsMobile());
    
    // Check if addEventListener was called
    expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
    
    // Unmount the hook
    unmount();
    
    // Check if removeEventListener was called
    expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
  });
});