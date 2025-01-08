import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Switch } from './switch';
import { Label } from '../label/label';

const meta: Meta = {
  title: 'Components/Switch',
  component: Switch,
  argTypes: {
    defaultChecked: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
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

export const Playground: Story = {
  args: {
    defaultChecked: false,
    checked: false,
    disabled: false,
    className: '',
  },
  render: args => <Switch {...args} />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: args => (
    <div className="flex flex-col gap-3">
      <Label className="flex items-center gap-2">
        <Switch {...args} />
        <span>Disabled Switch</span>
      </Label>
    </div>
  ),
};

export const States: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Switch {...args} defaultChecked />
        <span>Checked</span>
      </div>
      <div className="flex items-center gap-2">
        <Switch {...args} />
        <span>Unchecked</span>
      </div>
      <div className="flex items-center gap-2">
        <Switch {...args} disabled />
        <span>Disabled</span>
      </div>
      <div className="flex items-center gap-2">
        <Switch {...args} disabled defaultChecked />
        <span>Disabled and Checked</span>
      </div>
    </div>
  ),
};
