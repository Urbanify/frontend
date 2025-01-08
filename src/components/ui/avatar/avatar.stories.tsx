import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';

const meta: Meta = {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    className: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    className: '',
  },
  render: args => (
    <Avatar {...args}>
      <AvatarImage src="https://picsum.photos/150" alt="User" />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  ),
};

export const Examples: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      {/* Example 1 */}
      <div className="flex items-center gap-4">
        <span>With Image</span>
        <Avatar {...args}>
          <AvatarImage src="https://picsum.photos/150" alt="User Image" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>

      {/* Example 2 */}
      <div className="flex items-center gap-4">
        <span>Without Image</span>
        <Avatar {...args}>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      </div>

      {/* Example 3 */}
      <div className="flex items-center gap-4">
        <span>Custom Size</span>
        <Avatar {...args} className="size-16">
          <AvatarImage src="https://picsum.photos/150" alt="Custom User" />
          <AvatarFallback>CU</AvatarFallback>
        </Avatar>
      </div>
    </div>
  ),
};
