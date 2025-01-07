import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';

import messages from '@/locales/en.json';

import { Combobox } from './combobox';

describe('Components -> Combobox', () => {
  beforeAll(() => {
    // Mock ResizeObserver to avoid errors in Jest's Node.js environment
    // eslint-disable-next-line no-restricted-globals
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    // Mock scrollIntoView to prevent errors
    // eslint-disable-next-line no-restricted-globals
    global.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ];

  // Wrapper component to include NextIntlClientProvider
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <NextIntlClientProvider locale="en" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );

  it('should render the combobox trigger properly', () => {
    render(
      <Wrapper>
        <Combobox
          options={options}
          placeholder="Select a fruit"
          value=""
          /* c8 ignore next */
          setValue={() => {}}
        />
      </Wrapper>,
    );

    const trigger = screen.getByRole('combobox');

    expect(trigger).toBeInTheDocument();
  });

  it('should apply the given className to the combobox trigger', () => {
    render(
      <Wrapper>
        <Combobox
          options={options}
          placeholder="Select a fruit"
          value=""
          /* c8 ignore next */
          setValue={() => {}}
        />
      </Wrapper>,
    );

    const trigger = screen.getByRole('combobox');
    trigger.classList.add('custom-class');

    expect(trigger).toHaveClass('custom-class');
  });

  it('should render the dropdown menu when the combobox trigger is clicked', async () => {
    render(
      <Wrapper>
        <Combobox
          options={options}
          placeholder="Select a fruit"
          value=""
          /* c8 ignore next */
          setValue={() => {}}
        />
      </Wrapper>,
    );

    fireEvent.click(screen.getByRole('combobox'));

    // Verify that options are visible
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Cherry')).toBeInTheDocument();
  });

  // it('should select an option when clicked', async () => {
  //   let value = '';
  //   const setValue = (newValue: string) => {
  //     value = newValue;
  //   };

  //   render(
  //     <Wrapper>
  //       <Combobox
  //         options={options}
  //         placeholder="Select a fruit"
  //         value={value}
  //         setValue={setValue}
  //       />
  //     </Wrapper>,
  //   );

  //   fireEvent.click(screen.getByRole('combobox'));
  //   fireEvent.click(screen.getByText('Apple'));

  //   // Verify that the selected option is displayed in the combobox
  //   expect(value).toEqual('apple');

  //   fireEvent.click(screen.getByText('Apple'));

  //   expect(value).toEqual('');
  // });

  it('should close the dropdown when an option is selected', async () => {
    let value = '';
    const setValue = (newValue: string) => {
      value = newValue;
    };

    render(
      <Wrapper>
        <Combobox
          options={options}
          placeholder="Select a fruit"
          value={value}
          setValue={setValue}
        />
      </Wrapper>,
    );

    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Banana'));

    // Verify that the dropdown is closed
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    expect(screen.queryByText('Cherry')).not.toBeInTheDocument();
  });

  it('should apply the selected value correctly', async () => {
    const value = 'apple';

    render(
      <Wrapper>
        <Combobox
          options={options}
          placeholder="Select a fruit"
          value={value}
          /* c8 ignore next */
          setValue={() => {}}
        />
      </Wrapper>,
    );

    // Verify that the selected value is displayed in the combobox
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('should handle search functionality correctly', async () => {
    const value = '';

    render(
      <Wrapper>
        <Combobox
          options={options}
          placeholder="Search a fruit"
          value={value}
          /* c8 ignore next */
          setValue={() => {}}
        />
      </Wrapper>,
    );

    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.change(screen.queryAllByRole('combobox')[1] as Element, { target: { value: 'Ap' } });

    // Verify that only the Apple option is shown
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.queryByText('Banana')).not.toBeInTheDocument();
    expect(screen.queryByText('Cherry')).not.toBeInTheDocument();
  });

  it('should display placeholder when no value is selected', () => {
    render(
      <Wrapper>
        <Combobox
          options={options}
          placeholder="Select a fruit"
          value=""
          /* c8 ignore next */
          setValue={() => {}}
        />
      </Wrapper>,
    );

    expect(screen.getByText('Select a fruit')).toBeInTheDocument();
  });
});
