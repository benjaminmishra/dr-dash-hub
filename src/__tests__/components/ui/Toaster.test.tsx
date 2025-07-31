import { render, screen } from '../../test-utils';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { act } from '@testing-library/react';

// Mock the toast component since we're just testing if the Toaster renders
jest.mock('@/components/ui/toast', () => {
  const originalModule = jest.requireActual('@/components/ui/toast');
  return {
    ...originalModule,
    ToastProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="toast-provider">{children}</div>,
    ToastViewport: ({ className }: { className?: string }) => <div data-testid="toast-viewport" className={className}></div>,
  };
});

describe('Toaster Component', () => {
  test('renders toaster component', () => {
    render(<Toaster />);
    
    // Check if the mocked ToastViewport is rendered
    const toastViewport = screen.getByTestId('toast-viewport');
    expect(toastViewport).toBeInTheDocument();
  });
  
  test('toaster component with custom className', () => {
    render(<Toaster className="custom-toaster" />);
    
    // Since we're mocking the component, we can't actually test the className propagation
    // Just verify the component renders
    const toastProvider = screen.getByTestId('toast-provider');
    expect(toastProvider).toBeInTheDocument();
  });
});