/* eslint-disable tailwindcss/no-custom-classname */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Button } from '../button/button';

describe('Components -> Dialog', () => {
  it('should render the dialog trigger properly', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    const trigger = screen.getByText('Open Dialog');

    expect(trigger).toBeInTheDocument();
  });

  it('should apply the given className to the dialog trigger', () => {
    render(
      <Dialog>
        <DialogTrigger className="custom-class" asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    const trigger = screen.getByText('Open Dialog');

    expect(trigger).toHaveClass('custom-class');
  });

  it('should render the dialog content when the trigger is clicked', async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    // Open the dialog by clicking the trigger button
    fireEvent.click(screen.getByText('Open Dialog'));

    // Verify the dialog content appears
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog Description')).toBeInTheDocument();
  });

  it('should close the dialog when the close button is clicked', async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>CLOSE</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    // Open the dialog
    fireEvent.click(screen.getByText('Open Dialog'));

    // Verify the dialog content is visible
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();

    // Close the dialog
    fireEvent.click(screen.getByText('CLOSE'));

    // Verify the dialog content is no longer visible
    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
  });

  it('should apply additional props to the dialog trigger', () => {
    render(
      <Dialog>
        <DialogTrigger data-testid="dialog-trigger" asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    const trigger = screen.getByTestId('dialog-trigger');

    expect(trigger).toBeInTheDocument();
  });

  it('should apply the given className to the dialog content', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent data-testid="dialog-content" className="custom-content-class">
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    // Open the dialog
    fireEvent.click(screen.getByText('Open Dialog'));

    // Verify the dialog content has the custom class
    const content = screen.getByTestId('dialog-content');

    expect(content).toHaveClass('custom-content-class');
  });
});
