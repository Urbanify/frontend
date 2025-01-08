import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './sheet';

const meta: Meta = {
  title: 'Components/Sheet',
  component: Sheet,
  argTypes: {
    side: {
      control: 'radio',
      options: ['top', 'bottom', 'left', 'right'],
    },
    className: {
      control: 'text',
    },
    style: {
      control: 'object',
    },
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    side: 'right',
  },
  render: (args: any) => (
    <Sheet {...args}>
      <SheetTrigger className="rounded bg-blue-500 p-2 text-white">Open Sheet</SheetTrigger>
      <SheetContent side={args.side}>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>This is a description inside the sheet.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose className="rounded bg-red-500 p-2 text-white">Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Examples: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span>Sheet from Top</span>
        <Sheet {...args}>
          <SheetTrigger className="rounded bg-blue-500 p-2 text-white">Open Sheet</SheetTrigger>
          <SheetContent side="top">
            <SheetHeader>
              <SheetTitle>Sheet from Top</SheetTitle>
              <SheetDescription>This sheet slides from the top.</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose className="rounded bg-red-500 p-2 text-white">Close</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex flex-col gap-2">
        <span>Sheet from Bottom</span>
        <Sheet {...args}>
          <SheetTrigger className="rounded bg-green-500 p-2 text-white">Open Sheet</SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Sheet from Bottom</SheetTitle>
              <SheetDescription>This sheet slides from the bottom.</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose className="rounded bg-red-500 p-2 text-white">Close</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex flex-col gap-2">
        <span>Sheet from Left</span>
        <Sheet {...args}>
          <SheetTrigger className="rounded bg-purple-500 p-2 text-white">Open Sheet</SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Sheet from Left</SheetTitle>
              <SheetDescription>This sheet slides from the left.</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose className="rounded bg-red-500 p-2 text-white">Close</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex flex-col gap-2">
        <span>Sheet from Right</span>
        <Sheet {...args}>
          <SheetTrigger className="rounded bg-orange-500 p-2 text-white">Open Sheet</SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Sheet from Right</SheetTitle>
              <SheetDescription>This sheet slides from the right.</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose className="rounded bg-red-500 p-2 text-white">Close</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  ),
};
