import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Label } from './label';
import { Input } from '../input/input';

const meta: Meta = {
  title: 'Components/Label',
  component: Label,
  argTypes: {
    className: {
      control: 'text',
    },
    children: {
      control: 'text',
      description: 'Content of the label',
    },
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    children: 'Dynamic Label',
    className: '',
  },
};

export const Variants: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      <div className="flex max-w-80 flex-col gap-2">
        <Label {...args} htmlFor="input1">Default Label</Label>
        <Input id="input1" className="border px-2 py-1" type="text" placeholder="Input 1" />
      </div>
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <div className="peer-disabled flex max-w-80 flex-col gap-2">
        <Label {...args} htmlFor="input2" className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Disabled Label
        </Label>
        <Input id="input2" className="border px-2 py-1" type="text" placeholder="Input 2" disabled />
      </div>
    </div>
  ),
};
