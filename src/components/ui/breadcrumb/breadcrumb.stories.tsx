import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

const meta: Meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  argTypes: {
    separator: {
      control: 'text',
      description: 'Custom separator between breadcrumb items',
    },
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    separator: <BreadcrumbSeparator />,
  },
  render: args => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Category</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Current Page</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const Examples: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span>Simple Breadcrumb</span>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-col gap-2">
        <span>Breadcrumb with Ellipsis</span>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbEllipsis />
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-col gap-2">
        <span>Custom Separator</span>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <span className="px-1">/</span>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Category</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <span className="px-1">/</span>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  ),
};
