import { render, screen } from '@testing-library/react';
import React from 'react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

describe('Components -> Tooltip', () => {
  it('renders without crashing', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <span data-testid="trigger">Hover me</span>
          </TooltipTrigger>
          <TooltipContent data-testid="tooltip-content">Tooltip Text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    const trigger = screen.getByTestId('trigger');

    expect(trigger).toBeInTheDocument();
  });
});
