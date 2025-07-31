import { render, screen } from '../../test-utils';
import { Toast, ToastAction, ToastProvider, ToastViewport } from '@/components/ui/toast';

describe('Toast Component', () => {
  test('renders toast with title and description', () => {
    render(
      <ToastProvider>
        <Toast>
          <div className="grid gap-1">
            <div className="text-sm font-semibold">Toast Title</div>
            <div className="text-sm opacity-90">Toast Description</div>
          </div>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    
    expect(screen.getByText('Toast Title')).toBeInTheDocument();
    expect(screen.getByText('Toast Description')).toBeInTheDocument();
  });
  
  test('renders toast with action', () => {
    const handleAction = jest.fn();
    
    render(
      <ToastProvider>
        <Toast>
          <div className="grid gap-1">
            <div className="text-sm font-semibold">Toast with Action</div>
          </div>
          <ToastAction altText="Try again" onClick={handleAction}>
            Try again
          </ToastAction>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    
    expect(screen.getByText('Toast with Action')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });
  
  test('renders toast with variant', () => {
    render(
      <ToastProvider>
        <Toast variant="destructive">
          <div className="grid gap-1">
            <div className="text-sm font-semibold">Error Toast</div>
          </div>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    
    const toast = screen.getByText('Error Toast').closest('[role="status"]');
    expect(toast).toHaveClass('bg-destructive');
  });
  
  test('renders toast with custom className', () => {
    render(
      <ToastProvider>
        <Toast className="custom-toast-class">
          <div className="grid gap-1">
            <div className="text-sm font-semibold">Custom Toast</div>
          </div>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    
    const toast = screen.getByText('Custom Toast').closest('[role="status"]');
    expect(toast).toHaveClass('custom-toast-class');
  });
});