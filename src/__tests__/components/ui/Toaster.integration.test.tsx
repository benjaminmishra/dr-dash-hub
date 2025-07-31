import { render, screen } from '../../test-utils';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
import { act } from '@testing-library/react';

beforeEach(() => {
  jest.resetModules();
});

describe('Toaster integration', () => {
  test('renders toast added via toast function', () => {
    render(<Toaster />);
    act(() => {
      toast({ title: 'Integration Toast', description: 'Hello' });
    });
    expect(screen.getByText('Integration Toast')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
