import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Label } from '@/components/ui/label/label';

import { Textarea } from './textarea';

const meta: Meta = {
  title: 'Components/Textarea',
  component: Textarea,
  argTypes: {
    placeholder: {
      control: 'text',
      defaultValue: 'Enter text here...',
    },
    disabled: {
      control: 'boolean',
    },
    className: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj;

// Basic Playground Story
export const Playground: Story = {
  args: {
    placeholder: 'Enter text here...',
    disabled: false,
    className: '',
  },
  render: args => <Textarea {...args} />,
};

// Disabled Textarea
export const Disabled: Story = {
  args: {
    placeholder: 'This textarea is disabled',
    disabled: true,
  },
  render: args => (
    <div className="flex flex-col gap-3">
      <Textarea {...args} />
    </div>
  ),
};

// States Showcase
export const States: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="enabled" className="mb-2 block text-sm font-medium">Enabled</Label>
        <Textarea id="enabled" {...args} placeholder="Enabled Textarea" />
      </div>
      <div>
        <Label htmlFor="disabled" className="mb-2 block text-sm font-medium">Disabled</Label>
        <Textarea id="disabled" {...args} disabled placeholder="Disabled Textarea" />
      </div>
      <div>
        <Label htmlFor="custom" className="mb-2 block text-sm font-medium">Custom Styles</Label>
        <Textarea
          id="custom"
          {...args}
          className="border-red-500 focus-visible:ring-red-500"
          placeholder="Custom Styled Textarea"
        />
      </div>
    </div>
  ),
};
