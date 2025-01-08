import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './sheet';

describe('Components -> Sheet', () => {
  it('renders without crashing', () => {
    render(
      <Sheet>
        <SheetTrigger data-testid="sheet-trigger">Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose>Close</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    );
    const trigger = screen.getByTestId('sheet-trigger');

    expect(trigger).toBeInTheDocument();
  });

  it('applies the default classes for the sheet', () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent role="dialog">
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose>Close</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    );

    const openButton = screen.getByText('Open Sheet');
    fireEvent.click(openButton);
    const sheet = screen.getByRole('dialog');

    expect(sheet).toHaveClass('fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out');
  });

  it('applies additional className to the sheet', () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
        <SheetContent role="dialog" className="custom-class">
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose>Close</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    );

    const openButton = screen.getByText('Open Sheet');
    fireEvent.click(openButton);

    const sheetContent = screen.getByRole('dialog');

    expect(sheetContent).toHaveClass('custom-class');
  });

  it('applies inline styles correctly', () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent role="dialog" style={{ width: '500px', height: '400px' }}>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose>Close</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    );

    const openButton = screen.getByText('Open Sheet');
    fireEvent.click(openButton);

    const sheetContent = screen.getByRole('dialog');

    expect(sheetContent).toHaveStyle({ width: '500px', height: '400px' });
  });

  it('renders with custom props for sheet trigger', () => {
    render(
      <Sheet>
        <SheetTrigger data-testid="custom-trigger">Open Custom Sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose>Close</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    );
    const trigger = screen.getByTestId('custom-trigger');

    expect(trigger).toBeInTheDocument();
  });

  it('can be triggered and closed', () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent role="dialog">
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose data-testid="close-btn">Close</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    );

    const openButton = screen.getByText('Open Sheet');
    fireEvent.click(openButton);

    const sheet = screen.getByRole('dialog');

    expect(sheet).toBeInTheDocument();

    const closeButton = screen.getByTestId('close-btn');
    fireEvent.click(closeButton);

    expect(sheet).not.toBeInTheDocument();
  });
});
