import { render, screen, fireEvent } from '../../test-utils';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  test('renders button with default variant', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });
  
  test('renders button with secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    
    const button = screen.getByRole('button', { name: 'Secondary' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-secondary');
  });
  
  test('renders button with destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-destructive');
  });
  
  test('renders button with outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    
    const button = screen.getByRole('button', { name: 'Outline' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('border');
  });
  
  test('renders button with ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    
    const button = screen.getByRole('button', { name: 'Ghost' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('hover:bg-accent');
  });
  
  test('renders button with link variant', () => {
    render(<Button variant="link">Link</Button>);
    
    const button = screen.getByRole('button', { name: 'Link' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('text-primary');
  });
  
  test('renders disabled button', () => {
    render(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
  
  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('renders button with different sizes', () => {
    render(
      <>
        <Button size="default">Default</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">Icon</Button>
      </>
    );
    
    const defaultButton = screen.getByRole('button', { name: 'Default' });
    const smallButton = screen.getByRole('button', { name: 'Small' });
    const largeButton = screen.getByRole('button', { name: 'Large' });
    const iconButton = screen.getByRole('button', { name: 'Icon' });
    
    expect(defaultButton).toHaveClass('h-10');
    expect(smallButton).toHaveClass('h-9');
    expect(largeButton).toHaveClass('h-11');
    expect(iconButton).toHaveClass('h-10 w-10');
  });
  
  test('renders button with custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    const button = screen.getByRole('button', { name: 'Custom' });
    expect(button).toHaveClass('custom-class');
  });
  
  test('renders button as anchor when asChild is true and wrapped in an anchor', () => {
    render(
      <Button asChild>
        <a href="https://example.com">Link Button</a>
      </Button>
    );
    
    const link = screen.getByRole('link', { name: 'Link Button' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveClass('bg-primary');
  });
});