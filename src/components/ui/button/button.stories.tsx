import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import type { ButtonProps } from './button';
import { Button } from './button';

const variantOptions = ['default', 'destructive', 'outline', 'secondary', 'success', 'ghost', 'link'] as const;
const sizeOptions = ['default', 'sm', 'lg', 'icon'] as const;

const meta: Meta<ButtonProps> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'radio',
      options: variantOptions,
    },
    size: {
      control: 'radio',
      options: sizeOptions,
    },
    asChild: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<ButtonProps>;

export const Playground: Story = {
  args: {
    children: 'Dynamic Button',
    variant: 'default',
    size: 'default',
  },
};

export const AsChild: Story = {
  args: {
    children: <a href="/test" data-testid="slot-child">Click me</a>,
    asChild: true,
    variant: 'default',
    size: 'default',
  },
};

export const Variants: Story = {
  render: args => (
    <div className="flex gap-3">
      {variantOptions.map(variant => (
        <Button key={variant} {...args} variant={variant}>
          {variant.charAt(0).toUpperCase() + variant.slice(1)}
          {' '}
          Button
        </Button>
      ))}
    </div>
  ),
  args: {
    size: 'default',
  },
};

export const Sizes: Story = {
  render: args => (
    <div className="flex gap-3">
      {sizeOptions.map(size => (
        <Button key={size} {...args} size={size}>
          {size === 'icon'
            ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path d="M12 1.5A10.5 10.5 0 1 0 22.5 12 10.512 10.512 0 0 0 12 1.5zm0 19A8.5 8.5 0 1 1 20.5 12 8.509 8.509 0 0 1 12 20.5z" />
                </svg>
              )
            : (
                `${size.charAt(0).toUpperCase() + size.slice(1)} Button`
              )}
        </Button>
      ))}
    </div>
  ),
  args: {
    variant: 'default',
  },
};
