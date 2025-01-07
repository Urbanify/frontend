import { render, screen } from '@testing-library/react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

describe('Components -> Card', () => {
  it('should render the Card properly', () => {
    render(<Card data-testid="card">Card Content</Card>);

    const card = screen.getByTestId('card');

    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('rounded-lg border bg-card text-card-foreground shadow-sm');
  });

  it('should render children inside the Card', () => {
    render(
      <Card>
        <p data-testid="child">This is a child</p>
      </Card>,
    );

    const child = screen.getByTestId('child');

    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent('This is a child');
  });

  it('should accept custom className', () => {
    // eslint-disable-next-line tailwindcss/no-custom-classname
    render(<Card data-testid="card" className="custom-class">Card Content</Card>);

    const card = screen.getByTestId('card');

    expect(card).toHaveClass('custom-class');
  });
});

describe('Components -> Card Subcomponents', () => {
  it('should render the CardHeader properly', () => {
    render(<CardHeader data-testid="card-header">Card Header</CardHeader>);

    const cardHeader = screen.getByTestId('card-header');

    expect(cardHeader).toBeInTheDocument();
    expect(cardHeader).toHaveClass('flex flex-col space-y-1.5 p-6');
    expect(cardHeader).toHaveTextContent('Card Header');
  });

  it('should render the CardTitle properly', () => {
    render(<CardTitle data-testid="card-title">Card Title</CardTitle>);

    const cardTitle = screen.getByTestId('card-title');

    expect(cardTitle).toBeInTheDocument();
    expect(cardTitle).toHaveClass('text-2xl font-semibold leading-none tracking-tight');
    expect(cardTitle).toHaveTextContent('Card Title');
  });

  it('should render the CardDescription properly', () => {
    render(<CardDescription data-testid="card-description">Card Description</CardDescription>);

    const cardDescription = screen.getByTestId('card-description');

    expect(cardDescription).toBeInTheDocument();
    expect(cardDescription).toHaveClass('text-sm text-muted-foreground');
    expect(cardDescription).toHaveTextContent('Card Description');
  });

  it('should render the CardContent properly', () => {
    render(<CardContent data-testid="card-content">Card Content</CardContent>);

    const cardContent = screen.getByTestId('card-content');

    expect(cardContent).toBeInTheDocument();
    expect(cardContent).toHaveClass('p-6 pt-0');
    expect(cardContent).toHaveTextContent('Card Content');
  });

  it('should render the CardFooter properly', () => {
    render(<CardFooter data-testid="card-footer">Card Footer</CardFooter>);

    const cardFooter = screen.getByTestId('card-footer');

    expect(cardFooter).toBeInTheDocument();
    expect(cardFooter).toHaveClass('flex items-center p-6 pt-0');
    expect(cardFooter).toHaveTextContent('Card Footer');
  });
});
