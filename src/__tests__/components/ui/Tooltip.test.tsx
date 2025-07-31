import { render, screen } from '../../test-utils';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

describe('Tooltip component', () => {
  test('renders trigger and content', () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText('Trigger')).toBeInTheDocument();
    expect(screen.getAllByText('Tooltip text').length).toBeGreaterThan(0);
  });
});
