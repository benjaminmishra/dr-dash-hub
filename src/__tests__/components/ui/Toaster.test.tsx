import { render, screen } from '../../test-utils';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { act } from '@testing-library/react';

// Create a test component that uses the toast hook
const TestComponent = () => {
  const { toast } = useToast();
  
  const showToast = () => {
    toast({
      title: 'Test Toast',
      description: 'This is a test toast message',
    });
  };
  
  return (
    <div>
      <button onClick={showToast}>Show Toast</button>
      <Toaster />
    </div>
  );
};

describe('Toaster Component', () => {
  test('renders toaster component', () => {
    render(<Toaster />);
    
    // The toaster component should be in the document
    const toaster = document.querySelector('[role="region"][aria-label="Notifications"]');
    expect(toaster).toBeInTheDocument();
  });
  
  test('toaster component with custom className', () => {
    render(<Toaster className="custom-toaster" />);
    
    const toaster = document.querySelector('[role="region"][aria-label="Notifications"]');
    expect(toaster).toHaveClass('custom-toaster');
  });
});