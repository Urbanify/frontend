import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

import { BreadcrumbProvider } from './breacrumbs';

describe('BreadcrumbProvider', () => {
  it('renders children without crashing', () => {
    render(
      <BreadcrumbProvider>
        <div>Test Content</div>
      </BreadcrumbProvider>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
