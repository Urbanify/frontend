import type { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';

import messages from '@/locales/en.json';

import { Combobox, type ComboboxProps } from './combobox'; // Adjust the path accordingly

const meta: Meta<ComboboxProps> = {
  title: 'Components/Combobox',
  component: Combobox,
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'The placeholder text when no option is selected.',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      control: 'text',
      description: 'The current value of the combobox.',
      table: {
        type: { summary: 'string' },
      },
    },
    setValue: {
      action: 'setValue',
      description: 'Function to update the combobox value.',
      table: {
        type: { summary: 'function' },
      },
    },
    options: {
      control: 'object',
      description: 'List of options for the combobox.',
      table: {
        type: { summary: 'Array<{ value: string; label: string }>' },
      },
    },
  },
  decorators: [
    Story => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<ComboboxProps>;

// Playground story: Testing with dynamic input and options
export const Playground: Story = {
  args: {
    placeholder: 'Select a fruit',
    value: '',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
    ],
    // eslint-disable-next-line no-console
    setValue: value => console.log(value),
  },
  render: (args) => {
    return (
      <Combobox
        {...args}
      />
    );
  },
};
