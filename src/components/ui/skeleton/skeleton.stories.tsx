import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Skeleton } from './skeleton';

const meta: Meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  argTypes: {
    className: {
      control: 'text',
    },
    style: {
      control: 'object',
    },
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    className: 'w-32 h-8',
    style: {},
  },
  render: args => <Skeleton {...args} />,
};

export const Examples: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span>Small Skeleton</span>
        <Skeleton {...args} className="h-4 w-16" />
      </div>
      <div className="flex flex-col gap-2">
        <span>Medium Skeleton</span>
        <Skeleton {...args} className="h-8 w-32" />
      </div>
      <div className="flex flex-col gap-2">
        <span>Large Skeleton</span>
        <Skeleton {...args} className="h-12 w-64" />
      </div>
    </div>
  ),
};
