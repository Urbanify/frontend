import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

describe('Components -> Select', () => {
  it('should render the select trigger properly', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole('combobox');

    expect(trigger).toBeInTheDocument();
  });

  it('should apply the given className to the select trigger', () => {
    render(
      <Select>
        {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
        <SelectTrigger className="custom-class">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole('combobox');

    expect(trigger).toHaveClass('custom-class');
  });

  it('should render the dropdown menu when the select trigger is clicked', async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>,
    );

    // Open the dropdown by clicking the select trigger
    fireEvent.click(screen.getByRole('combobox'));

    // Verify that options are visible
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should select an option when clicked', async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>,
    );

    // Open the dropdown
    fireEvent.click(screen.getByRole('combobox'));

    // Select an option
    fireEvent.click(screen.getByText('Option 1'));

    // Verify that the selected option is displayed in the trigger
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('should disable an option correctly', async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1" disabled>
            Option 1 (disabled)
          </SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>,
    );

    // Open the dropdown
    fireEvent.click(screen.getByRole('combobox'));

    // Verify that the disabled option is in the dropdown
    expect(screen.getByText('Option 1 (disabled)')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();

    // Ensure the disabled option can't be selected
    fireEvent.click(screen.getByText('Option 1 (disabled)'));

    const option1 = screen.getAllByRole('option')[0];

    expect(option1).toHaveClass('data-[disabled]:pointer-events-none data-[disabled]:opacity-50');
  });

  it('should apply additional props to the select trigger', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByTestId('select-trigger');

    expect(trigger).toBeInTheDocument();
  });
});
