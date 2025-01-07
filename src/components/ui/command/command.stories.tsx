import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command';

const meta: Meta = {
  title: 'Components/Command',
  component: Command,
  argTypes: {
    children: {
      control: 'text',
      description: 'The content inside the Command component.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description: 'CSS class names for styling the Command component.',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    children: 'Command Input Placeholder',
  },
};

export const CommandWithInput: Story = {
  render: args => (
    <Command {...args} className="rounded-lg border shadow-md md:min-w-[450px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem disabled>
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  args: {
    children: 'Command Dialog with Input and Items',
  },
};
