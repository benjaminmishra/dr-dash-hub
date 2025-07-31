import { render, screen, fireEvent } from '../test-utils';
import { TLDRCard, TLDRData } from '@/components/TLDRCard';

describe('TLDRCard Component', () => {
  const mockData: TLDRData = {
    id: 'test-id',
    topic: 'Test Topic',
    date: '2025-01-23T08:00:00Z',
    summary: 'This is a test summary for the TLDR card component.',
    sources: [
      'https://example.com/source1',
      'https://example.com/source2'
    ]
  };

  test('renders card with correct data', () => {
    render(<TLDRCard data={mockData} />);
    
    // Check if topic is rendered
    expect(screen.getByText('Test Topic')).toBeInTheDocument();
    
    // Check if date is formatted and rendered correctly
    expect(screen.getByText(/January 23, 2025/)).toBeInTheDocument();
    
    // Check if summary is rendered
    expect(screen.getByText('This is a test summary for the TLDR card component.')).toBeInTheDocument();
    
    // Check if sources button is rendered with correct count
    expect(screen.getByText('Sources (2)')).toBeInTheDocument();
  });

  test('toggles sources visibility when sources button is clicked', () => {
    render(<TLDRCard data={mockData} />);
    
    // Sources should be hidden initially
    expect(screen.queryByText('https://example.com/source1')).not.toBeInTheDocument();
    expect(screen.queryByText('https://example.com/source2')).not.toBeInTheDocument();
    
    // Click on the sources button
    fireEvent.click(screen.getByText('Sources (2)'));
    
    // Sources should be visible now
    expect(screen.getByText('https://example.com/source1')).toBeInTheDocument();
    expect(screen.getByText('https://example.com/source2')).toBeInTheDocument();
    
    // Click on the sources button again
    fireEvent.click(screen.getByText('Sources (2)'));
    
    // Sources should be hidden again
    expect(screen.queryByText('https://example.com/source1')).not.toBeInTheDocument();
    expect(screen.queryByText('https://example.com/source2')).not.toBeInTheDocument();
  });

  test('renders card without sources section when no sources are provided', () => {
    const dataWithoutSources: TLDRData = {
      ...mockData,
      sources: undefined
    };
    
    render(<TLDRCard data={dataWithoutSources} />);
    
    // Check if topic and summary are still rendered
    expect(screen.getByText('Test Topic')).toBeInTheDocument();
    expect(screen.getByText('This is a test summary for the TLDR card component.')).toBeInTheDocument();
    
    // Sources button should not be rendered
    expect(screen.queryByText('Sources')).not.toBeInTheDocument();
  });

  test('renders card with empty sources array', () => {
    const dataWithEmptySources: TLDRData = {
      ...mockData,
      sources: []
    };
    
    render(<TLDRCard data={dataWithEmptySources} />);
    
    // Sources button should not be rendered when sources array is empty
    expect(screen.queryByText('Sources (0)')).not.toBeInTheDocument();
  });

  test('source links have correct attributes', () => {
    render(<TLDRCard data={mockData} />);
    
    // Click on the sources button to show sources
    fireEvent.click(screen.getByText('Sources (2)'));
    
    // Get all source links
    const sourceLinks = screen.getAllByRole('link');
    
    // Check if there are two links
    expect(sourceLinks).toHaveLength(2);
    
    // Check if links have correct attributes
    sourceLinks.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
    
    // Check specific href values
    expect(sourceLinks[0]).toHaveAttribute('href', 'https://example.com/source1');
    expect(sourceLinks[1]).toHaveAttribute('href', 'https://example.com/source2');
  });
});