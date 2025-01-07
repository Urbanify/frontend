import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { toast } from 'sonner';

import { Toaster, type ToasterProps } from './toaster';
import { Button } from '../button/button';

const meta: Meta<ToasterProps> = {
  title: 'Components/Toaster',
  component: Toaster,
  argTypes: {
    richColors: {
      control: 'boolean',
    },
    closeButton: {
      control: 'boolean',
    },
    expand: {
      control: 'boolean',
    },
    invert: {
      control: 'boolean',
    },
    theme: {
      control: 'radio',
      options: ['light', 'dark', 'system'],
    },
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    theme: 'system',
  },
};

export const ThemedToasts: Story = {
  render: args => (
    <div>
      <Toaster {...args} />
      <Button
        onClick={() => toast.success('Success!')}
      >
        Trigger Success Toast
      </Button>
    </div>
  ),
  args: {
    theme: 'system',
  },
};
