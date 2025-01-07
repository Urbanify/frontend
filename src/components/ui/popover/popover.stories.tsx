import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from '../button/button';

const meta: Meta = {
  title: 'Components/Popover',
  component: Popover,
  argTypes: {
    align: {
      control: 'radio',
      options: ['start', 'center', 'end'],
    },
    sideOffset: {
      control: 'number',
      defaultValue: 4,
    },
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    children: (
      <>
        <PopoverTrigger>
          <Button>Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          This is a popover content!
        </PopoverContent>
      </>
    ),
  },
};

export const WithCustomAlignment: Story = {
  args: {
    children: (
      <>
        <PopoverTrigger>
          <Button>Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent align="end">
          This popover is aligned to the end.
        </PopoverContent>
      </>
    ),
  },
};

export const WithSideOffset: Story = {
  args: {
    children: (
      <>
        <PopoverTrigger>
          <Button>Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={8}>
          This popover has a custom side offset of 8px.
        </PopoverContent>
      </>
    ),
  },
};

export const DifferentPositions: Story = {
  render: args => (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger>
          <Button>Left</Button>
        </PopoverTrigger>
        <PopoverContent {...args} align="start">
          This popover is on the left side.
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger>
          <Button>Center</Button>
        </PopoverTrigger>
        <PopoverContent {...args} align="center">
          This popover is centered.
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger>
          <Button>Right</Button>
        </PopoverTrigger>
        <PopoverContent {...args} align="end">
          This popover is on the right side.
        </PopoverContent>
      </Popover>
    </div>
  ),
  args: {
    sideOffset: 6,
  },
};
