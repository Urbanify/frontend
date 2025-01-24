import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Card, CardContent } from '@/components/ui/card/card';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './carousel';

const meta: Meta = {
  title: 'Components/Carousel',
  component: Carousel,
  argTypes: {
    className: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    className: '',
  },
  render: args => (
    <Carousel {...args} className="w-full max-w-xs">
      <CarouselPrevious />
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
    </Carousel>
  ),
};
