import { fireEvent, render, screen } from '@testing-library/react';
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

describe('Components -> Breadcrumb', () => {
  it('should render the breadcrumb navigation properly', () => {
    render(
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
      </Breadcrumb>,
    );

    const breadcrumbNav = screen.getByLabelText('breadcrumb');

    expect(breadcrumbNav).toBeInTheDocument();
  });

  it('should render all breadcrumb items', () => {
    render(
      <Breadcrumb>
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
      </Breadcrumb>,
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Current Page')).toBeInTheDocument();
  });

  it('should render the custom separator correctly', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <span>/</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Current Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByText('/')).toBeInTheDocument();
  });

  it('should apply a custom className to the breadcrumb link', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
            <BreadcrumbLink href="#" className="custom-class">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    const link = screen.getByText('Home');

    expect(link).toHaveClass('custom-class');
  });

  it('should render ellipsis in the breadcrumb when provided', () => {
    render(
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
      </Breadcrumb>,
    );

    const ellipsis = screen.getByText('More');

    expect(ellipsis).toBeInTheDocument();
  });

  it('should handle breadcrumb links correctly', () => {
    const handleClick = vi.fn();
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={handleClick}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    fireEvent.click(screen.getByText('Home'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should correctly render the "aria-current" attribute for the current page', () => {
    render(
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
      </Breadcrumb>,
    );

    const currentPage = screen.getByText('Current Page');

    expect(currentPage).toHaveAttribute('aria-current', 'page');
  });

  it('should render a custom component when "asChild" is true', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button type="button" data-testid="custom-breadcrumb-link">Custom Home</button>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    const customLink = screen.getByTestId('custom-breadcrumb-link');

    expect(customLink).toBeInTheDocument();
    expect(customLink.tagName.toLowerCase()).toBe('button');
  });

  it('should render an <a> tag by default when "asChild" is not provided', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    const link = screen.getByText('Home');

    expect(link.tagName.toLowerCase()).toBe('a');
  });
});
