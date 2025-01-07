import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { Input } from './input';

export default {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    type: {
      control: 'select',
      options: [
        'text',
        'password',
        'email',
        'number',
        'search',
        'tel',
        'url',
        'file',
        'date',
        'time',
        'datetime-local',
        'month',
        'week',
      ],
      description: 'The type of the input (e.g., text, email, password, etc.)',
      defaultValue: 'text',
    },
    className: {
      control: 'text',
      description: 'Additional classes to style the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input field',
      defaultValue: 'Enter text...',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input field',
      defaultValue: false,
    },
  },
} as Meta<typeof Input>;

const Template: StoryFn<typeof Input> = args => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  type: 'text',
  placeholder: 'Enter text...',
};

export const Password = Template.bind({});
Password.args = {
  type: 'password',
  placeholder: 'Enter your password...',
};

export const Email = Template.bind({});
Email.args = {
  type: 'email',
  placeholder: 'Enter your email...',
};

export const Number = Template.bind({});
Number.args = {
  type: 'number',
  placeholder: 'Enter a number...',
};

export const Search = Template.bind({});
Search.args = {
  type: 'search',
  placeholder: 'Search...',
};

export const Phone = Template.bind({});
Phone.args = {
  type: 'tel',
  placeholder: 'Enter your phone number...',
};

export const URL = Template.bind({});
URL.args = {
  type: 'url',
  placeholder: 'Enter a URL...',
};

export const File = Template.bind({});
File.args = {
  type: 'file',
};

export const Date = Template.bind({});
Date.args = {
  type: 'date',
};

export const Time = Template.bind({});
Time.args = {
  type: 'time',
};

export const DateTimeLocal = Template.bind({});
DateTimeLocal.args = {
  type: 'datetime-local',
};

export const Month = Template.bind({});
Month.args = {
  type: 'month',
};

export const Week = Template.bind({});
Week.args = {
  type: 'week',
};

export const Disabled = Template.bind({});
Disabled.args = {
  type: 'text',
  placeholder: 'This input is disabled',
  disabled: true,
};
