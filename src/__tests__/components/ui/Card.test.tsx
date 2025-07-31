import { render, screen } from '../../test-utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

describe('Card Component', () => {
  test('renders basic card', () => {
    render(
      <Card>
        <div>Card Content</div>
      </Card>
    );
    
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });
  
  test('renders card with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });
  
  test('renders card with custom className', () => {
    render(
      <Card className="custom-card-class">
        <div>Card Content</div>
      </Card>
    );
    
    const card = screen.getByText('Card Content').parentElement;
    expect(card).toHaveClass('custom-card-class');
  });
  
  test('renders card header with custom className', () => {
    render(
      <Card>
        <CardHeader className="custom-header-class">
          <div>Header Content</div>
        </CardHeader>
      </Card>
    );
    
    const header = screen.getByText('Header Content').parentElement;
    expect(header).toHaveClass('custom-header-class');
  });
  
  test('renders card content with custom className', () => {
    render(
      <Card>
        <CardContent className="custom-content-class">
          <div>Content</div>
        </CardContent>
      </Card>
    );
    
    const content = screen.getByText('Content').parentElement;
    expect(content).toHaveClass('custom-content-class');
  });
  
  test('renders card footer with custom className', () => {
    render(
      <Card>
        <CardFooter className="custom-footer-class">
          <div>Footer Content</div>
        </CardFooter>
      </Card>
    );
    
    const footer = screen.getByText('Footer Content').parentElement;
    expect(footer).toHaveClass('custom-footer-class');
  });
  
  test('renders card title with custom className', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle className="custom-title-class">Title</CardTitle>
        </CardHeader>
      </Card>
    );
    
    const title = screen.getByText('Title');
    expect(title).toHaveClass('custom-title-class');
  });
  
  test('renders card description with custom className', () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription className="custom-desc-class">Description</CardDescription>
        </CardHeader>
      </Card>
    );
    
    const description = screen.getByText('Description');
    expect(description).toHaveClass('custom-desc-class');
  });
});