import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

const meta: Meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  argTypes: {
    children: {
      control: 'text',
      description: 'The content inside the dropdown menu.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description: 'CSS class names for styling the DropdownMenuTrigger.',
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
    children: 'Dropdown Menu',
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">Open Dropdown</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Item 1</DropdownMenuItem>
        <DropdownMenuItem>Item 2</DropdownMenuItem>
        <DropdownMenuItem>Item 3</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithSubMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">Open Dropdown</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Item 1</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger inset>Sub Menu</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Sub Item 1</DropdownMenuItem>
            <DropdownMenuItem>Sub Item 2</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem>Item 2</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  args: {
    children: 'Dropdown Menu',
  },
};

export const WithHelper: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">Open Dropdown</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          Item 1
          <DropdownMenuShortcut>1</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Item 2
          <DropdownMenuShortcut>2</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Item 3
          <DropdownMenuShortcut>3</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  args: {
    children: 'Dropdown Menu',
  },
};

export const CustomStyledDropdown: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer rounded-lg bg-blue-500 p-2 text-white">
        Custom Styled Dropdown
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-lg bg-yellow-200 p-2">
        <DropdownMenuItem className="bg-green-200 p-2">Item 1</DropdownMenuItem>
        <DropdownMenuItem className="bg-red-200 p-2">Item 2</DropdownMenuItem>
        <DropdownMenuItem className="bg-blue-200 p-2">Item 3</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  args: {
    children: 'Dropdown Menu',
  },
};
