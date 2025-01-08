import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';

describe('Components -> Collapsible', () => {
  it('renders without crashing', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger data-testid="trigger">Toggle Content</CollapsibleTrigger>
        <CollapsibleContent data-testid="content">This is collapsible content</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByTestId('trigger');
    const content = screen.getByTestId('content');

    expect(trigger).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it('collapses content by default when `open` is false', () => {
    render(
      <Collapsible open={false}>
        <CollapsibleTrigger data-testid="trigger">Toggle Content</CollapsibleTrigger>
        <CollapsibleContent data-testid="content">This is collapsible content</CollapsibleContent>
      </Collapsible>,
    );

    const content = screen.getByTestId('content');

    expect(content).toHaveAttribute('data-state', 'closed');
  });

  it('shows content by default when `open` is true', () => {
    render(
      <Collapsible open>
        <CollapsibleTrigger data-testid="trigger">Toggle Content</CollapsibleTrigger>
        <CollapsibleContent data-testid="content">This is collapsible content</CollapsibleContent>
      </Collapsible>,
    );

    const content = screen.getByTestId('content');

    expect(content).toHaveAttribute('data-state', 'open');
  });

  it('toggles content visibility when trigger is clicked', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger data-testid="trigger">Toggle Content</CollapsibleTrigger>
        <CollapsibleContent data-testid="content">This is collapsible content</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByTestId('trigger');
    const content = screen.getByTestId('content');

    // Initially closed
    expect(content).toHaveAttribute('data-state', 'closed');

    // Open after click
    fireEvent.click(trigger);

    expect(content).toHaveAttribute('data-state', 'open');

    // Close after another click
    fireEvent.click(trigger);

    expect(content).toHaveAttribute('data-state', 'closed');
  });

  it('applies custom className to trigger and content', () => {
    render(
      <Collapsible>
        {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
        <CollapsibleTrigger data-testid="trigger" className="custom-trigger">
          Toggle Content
        </CollapsibleTrigger>
        {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
        <CollapsibleContent data-testid="content" className="custom-content">
          This is collapsible content
        </CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByTestId('trigger');
    const content = screen.getByTestId('content');

    expect(trigger).toHaveClass('custom-trigger');
    expect(content).toHaveClass('custom-content');
  });

  it('renders with custom props', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger data-testid="custom-trigger">Toggle Content</CollapsibleTrigger>
        <CollapsibleContent data-testid="custom-content">This is collapsible content</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByTestId('custom-trigger');
    const content = screen.getByTestId('custom-content');

    expect(trigger).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });
});
