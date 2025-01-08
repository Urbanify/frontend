import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Button } from '../button/button';

const meta: Meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    sideOffset: {
      control: 'number',
      defaultValue: 4,
    },
    className: {
      control: 'text',
    },
  },
  decorators: [
    Story => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    sideOffset: 4,
  },
  render: args => (
    <Tooltip>
      <TooltipTrigger>
        <Button>Hover me</Button>
      </TooltipTrigger>
      <TooltipContent {...args} className="bg-gray-800 text-white">
        This is a tooltip
      </TooltipContent>
    </Tooltip>
  ),
};

export const Examples: Story = {
  render: args => (
    <div className="mt-6 flex size-full flex-col items-center justify-center gap-4">
      <div>
        <Tooltip>
          <TooltipTrigger>
            <Button>Top Tooltip</Button>
          </TooltipTrigger>
          <TooltipContent {...args} side="top" className="bg-gray-800 text-white">
            Tooltip on Top
          </TooltipContent>
        </Tooltip>
      </div>
      <div>
        <Tooltip>
          <TooltipTrigger>
            <Button>Bottom Tooltip</Button>
          </TooltipTrigger>
          <TooltipContent {...args} side="bottom" className="bg-gray-800 text-white">
            Tooltip on Bottom
          </TooltipContent>
        </Tooltip>
      </div>
      <div>
        <Tooltip>
          <TooltipTrigger>
            <Button>Left Tooltip</Button>
          </TooltipTrigger>
          <TooltipContent {...args} side="left" className="bg-gray-800 text-white">
            Tooltip on Left
          </TooltipContent>
        </Tooltip>
      </div>
      <div>
        <Tooltip>
          <TooltipTrigger>
            <Button>Right Tooltip</Button>
          </TooltipTrigger>
          <TooltipContent {...args} side="right" className="bg-gray-800 text-white">
            Tooltip on Right
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};
