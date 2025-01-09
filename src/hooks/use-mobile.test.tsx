/* eslint-disable no-restricted-globals */
import { render, screen } from '@testing-library/react';
import * as React from 'react';

import { useIsMobile } from './use-mobile';

const setUpResize = (width: number) => {
  global.innerWidth = width;
  global.dispatchEvent(new Event('resize')); // Trigger the resize event
};

// Mock `matchMedia` to return true/false depending on the screen width
beforeAll(() => {
  global.matchMedia = vi.fn().mockImplementation(query => ({
    matches: query.includes('(max-width: 767px)'),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

describe('useIsMobile', () => {
  it('should return true for mobile screen sizes (less than 768px)', () => {
    setUpResize(500); // Set window width to below 768px

    const TestComponent = () => {
      const isMobile = useIsMobile();
      return <div>{isMobile ? 'Mobile' : 'Not mobile'}</div>;
    };

    render(<TestComponent />);

    expect(screen.getByText('Mobile')).toBeInTheDocument();
  });

  it('should return false for non-mobile screen sizes (768px and above)', () => {
    setUpResize(1024); // Set window width to above 768px

    const TestComponent = () => {
      const isMobile = useIsMobile();
      /* c8 ignore next 1 */
      return <div>{isMobile ? 'Mobile' : 'Not mobile'}</div>;
    };

    render(<TestComponent />);

    expect(screen.getByText('Not mobile')).toBeInTheDocument();
  });
});
