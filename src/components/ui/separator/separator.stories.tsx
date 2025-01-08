import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Separator } from './separator';

const meta: Meta = {
  title: 'Components/Separator',
  component: Separator,
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
    className: {
      control: 'text',
    },
    decorative: {
      control: 'boolean',
      defaultValue: true,
    },
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    orientation: 'horizontal',
    decorative: true,
    className: '',
  },
  render: args => <Separator {...args} />,
};

export const Examples: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span>Horizontal Separator</span>
        <Separator {...args} className="my-2" orientation="horizontal" />
      </div>
      <div className="flex flex-row items-center gap-4">
        <span>Vertical Separator</span>
        <Separator {...args} className="mx-2 h-10" orientation="vertical" />
        <span>Vertical Separator</span>
      </div>
      <div className="flex flex-col gap-2">
        <span>Styled Separator</span>
        <Separator {...args} className="h-[2px] bg-red-500" orientation="horizontal" />
      </div>
    </div>
  ),
};
