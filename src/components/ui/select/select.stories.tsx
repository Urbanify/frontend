/* eslint-disable tailwindcss/no-custom-classname */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from './select';

const meta: Meta = {
  title: 'Components/Select',
  component: Select,
  argTypes: {
    children: {
      control: 'text',
      description: 'The content inside the select trigger.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description: 'CSS class names for styling the SelectTrigger.',
      table: {
        type: { summary: 'string' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'The placeholder text for the select value when no option is selected.',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      control: 'text',
      description: 'The value for the item, used to identify it when selected.',
      table: {
        type: { summary: 'string' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the select item.',
      table: {
        type: { summary: 'boolean' },
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    children: 'Select an option',
  },
};

export const WithOptions: Story = {
  render: args => (
    <Select {...args}>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Options</SelectLabel>
          <SelectItem value="option1">
            Option 1
          </SelectItem>
          <SelectSeparator />
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  args: {
    children: 'Select an option',
  },
};

export const DisabledOption: Story = {
  render: args => (
    <Select {...args}>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Options</SelectLabel>
          <SelectItem value="option1" disabled>
            Option 1 (disabled)
          </SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  args: {
    children: 'Select an option',
  },
};

export const CustomStyles: Story = {
  render: args => (
    <Select {...args}>
      <SelectTrigger className="custom-class">
        <SelectValue placeholder="Select a custom-styled option" />
      </SelectTrigger>
      <SelectContent className="custom-select-content">
        <SelectGroup>
          <SelectLabel>Custom Styled Options</SelectLabel>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  args: {
    children: 'Select an option',
  },
};

export const WithMultipleItems: Story = {
  render: args => (
    <Select {...args}>
      <SelectTrigger>
        <SelectValue placeholder="Select an item" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Multiple Options</SelectLabel>
          {['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig'].map(item => (
            <SelectItem key={item} value={item}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  args: {
    children: 'Select an option',
  },
};
