import { fireEvent, render, screen } from '@testing-library/react';

import LocaleSwitcherSelect from './locale-switcher-select';

describe('Components -> LocaleSwitcherSelect', () => {
  const defaultProps = {
    defaultValue: 'en',
    items: [
      { value: 'en', label: 'EN' },
      { value: 'es', label: 'ES' },
    ],
    label: 'Language',
  };

  it('should render the LocaleSwitcherSelect properly', () => {
    render(<LocaleSwitcherSelect {...defaultProps} />);

    const selectTrigger = screen.getByText('EN');

    expect(selectTrigger).toBeInTheDocument();
  });

  it('should display the correct label', () => {
    render(<LocaleSwitcherSelect {...defaultProps} />);

    const label = screen.getByText('Language');

    expect(label).toBeInTheDocument();
  });

  it('should change the selected value when a new option is clicked', () => {
    render(<LocaleSwitcherSelect {...defaultProps} />);

    const selectTrigger = screen.getByText('EN');
    fireEvent.click(selectTrigger);

    const newOption = screen.getByText('ES');
    fireEvent.click(newOption);

    expect(screen.getByText('ES')).toBeInTheDocument();
  });
});
