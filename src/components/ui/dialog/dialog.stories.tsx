import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Button } from '../button/button';

const meta: Meta = {
  title: 'Components/Dialog',
  component: Dialog,
  argTypes: {
    children: {
      control: 'text',
    },
    className: {
      control: 'text',
      description: 'CSS class names for styling the Dialog components.',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  render: args => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>This is a simple dialog description.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  args: {
    className: '',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Basic Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Basic Dialog</DialogTitle>
            <DialogDescription>This is a basic dialog.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Custom Dialog</Button>
        </DialogTrigger>
        <DialogContent className="bg-blue-500 text-white">
          <DialogHeader>
            <DialogTitle>Custom Styled Dialog</DialogTitle>
            <DialogDescription>This dialog has custom styles.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="destructive">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
};

export const WithComplexContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog with Complex Content</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Dialog with Complex Content</DialogTitle>
          <DialogDescription>
            This dialog contains more complex content, such as a list and a call-to-action button.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <ul className="list-inside list-disc space-y-2">
            <li>Feature 1: Rich content</li>
            <li>Feature 2: Actionable buttons</li>
            <li>Feature 3: Customizable</li>
          </ul>
        </div>
        <DialogFooter>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="destructive">Delete</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
