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
      <CollapsibleTrigger className="rounded bg-blue-500 px-4 py-2 text-white">
        Toggle Content
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 rounded bg-gray-100 p-4">
        This is the collapsible content.
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const Examples: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Collapsible open>
        <CollapsibleTrigger className="rounded bg-blue-500 px-4 py-2 text-white">
          Always Open
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded bg-gray-100 p-4">
          This content is always visible because the `open` prop is `true`.
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={false}>
        <CollapsibleTrigger className="rounded bg-green-500 px-4 py-2 text-white">
          Click to Open
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded bg-gray-100 p-4">
          This content is hidden by default but will appear when the trigger is clicked.
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={false}>
        <CollapsibleTrigger className="rounded bg-red-500 px-4 py-2 text-white">
          Styled Trigger Example
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded bg-yellow-100 p-4">
          Customize the trigger and content styles to fit your design.
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};
