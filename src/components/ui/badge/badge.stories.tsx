import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import type { BadgeProps } from './badge';
import { Badge } from './badge';

const variantOptions = [
  'default',
  'destructive',
  'outline',
  'secondary',
  'ghost',
  'link',
  'info',
  'success',
  'warning',
  'danger',
] as const;

const meta: Meta<BadgeProps> = {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'radio',
      options: variantOptions,
    },
    className: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<BadgeProps>;

export const Playground: Story = {
  args: {
    children: 'Dynamic Badge',
    variant: 'default',
  },
};

export const Variants: Story = {
  render: args => (
    <div className="flex flex-wrap gap-3">
      {variantOptions.map(variant => (
        <Badge key={variant} {...args} variant={variant}>
          {variant.charAt(0).toUpperCase() + variant.slice(1)}
          {' '}
          Badge
        </Badge>
      ))}
    </div>
  ),
  args: {},
};
