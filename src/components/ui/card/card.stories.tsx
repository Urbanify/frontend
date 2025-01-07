import type { Meta, StoryObj } from '@storybook/react';
import Image from 'next/image';
import React from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Button } from '../button/button';

const meta: Meta = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    children: {
      control: 'text',
    },
    className: {
      control: 'text',
      description: 'CSS class names for styling the SelectTrigger.',
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
    <Card {...args}>
      <CardHeader>
        <CardTitle>Dynamic Card</CardTitle>
        <CardDescription>Customize this card using Storybook controls.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the content of the card. Add more text or elements here.</p>
      </CardContent>
      <CardFooter>
        <Button>
          Action
        </Button>
      </CardFooter>
    </Card>
  ),
  args: {
    className: '',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Basic Card</CardTitle>
          <CardDescription>This is a simple card.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Cards are used to group related information. They can include headers, content, and footers.
          </p>
        </CardContent>
      </Card>

      <Card className="max-w-sm border-2 border-blue-500">
        <CardHeader>
          <CardTitle>Card with Custom Border</CardTitle>
          <CardDescription>Style cards using custom classes.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has a blue border to highlight its importance.</p>
        </CardContent>
        <CardFooter>
          <Button>
            Learn More
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const WithComplexContent: Story = {
  render: () => (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Complex Card Example</CardTitle>
        <CardDescription>
          This card contains more complex elements like images and lists.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src="https://picsum.photos/400/200"
          alt="Placeholder"
          className="mb-4 rounded-md"
          width={400}
          height={200}
        />
        <ul className="list-inside list-disc space-y-2">
          <li>Feature 1: Customizable design</li>
          <li>Feature 2: Easy to use</li>
          <li>Feature 3: Responsive layout</li>
        </ul>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          <Button>
            Approve
          </Button>
          <Button variant="destructive">
            Decline
          </Button>
        </div>
      </CardFooter>
    </Card>
  ),
};
