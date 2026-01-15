import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';

const meta: Meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the collapsible is open by default.',
    },
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    open: false,
  },
  render: args => (
    <Collapsible {...args}>
      <CollapsibleTrigger className="rounded bg-primary px-4 py-2 text-primary-foreground">
        Toggle Content
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 rounded bg-muted p-4 text-foreground">
        This is the collapsible content.
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const Examples: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Collapsible open>
        <CollapsibleTrigger className="rounded bg-primary px-4 py-2 text-primary-foreground">
          Always Open
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded bg-muted p-4 text-foreground">
          This content is always visible because the `open` prop is `true`.
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={false}>
        <CollapsibleTrigger className="rounded bg-accent px-4 py-2 text-accent-foreground">
          Click to Open
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded bg-muted p-4 text-foreground">
          This content is hidden by default but will appear when the trigger is clicked.
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={false}>
        <CollapsibleTrigger className="rounded bg-secondary px-4 py-2 text-secondary-foreground">
          Styled Trigger Example
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded bg-accent p-4 text-accent-foreground">
          Customize the trigger and content styles to fit your design.
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};
