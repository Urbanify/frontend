import { render, screen } from '@testing-library/react';
import React from 'react';

import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './table';

describe('Components -> Table', () => {
  it('should render the table properly', () => {
    render(
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Header 1</TableHead>
            <TableHead>Header 2</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Row 1, Cell 1</TableCell>
            <TableCell>Row 1, Cell 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const table = screen.getByRole('table');

    expect(table).toBeInTheDocument();
  });

  it('should render the table with caption', () => {
    render(
      <Table>
        <TableCaption>Table Caption</TableCaption>
        <TableHeader>
          <tr>
            <TableHead>Header 1</TableHead>
            <TableHead>Header 2</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Row 1, Cell 1</TableCell>
            <TableCell>Row 1, Cell 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const caption = screen.getByText('Table Caption');

    expect(caption).toBeInTheDocument();
  });

  it('should apply the given className to the table', () => {
    render(
      // eslint-disable-next-line tailwindcss/no-custom-classname
      <Table className="custom-table">
        <TableHeader>
          <tr>
            <TableHead>Header 1</TableHead>
            <TableHead>Header 2</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Row 1, Cell 1</TableCell>
            <TableCell>Row 1, Cell 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const table = screen.getByRole('table');

    expect(table).toHaveClass('custom-table');
  });

  it('should render the table footer', () => {
    render(
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Header 1</TableHead>
            <TableHead>Header 2</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Row 1, Cell 1</TableCell>
            <TableCell>Row 1, Cell 2</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>2</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    const footer = screen.getByText('Total');

    expect(footer).toBeInTheDocument();
  });

  it('should render multiple rows in the table', () => {
    render(
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Header 1</TableHead>
            <TableHead>Header 2</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {['Row 1', 'Row 2'].map((row, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <TableRow key={index}>
              <TableCell>{`${row}, Cell 1`}</TableCell>
              <TableCell>{`${row}, Cell 2`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>,
    );

    const rows = screen.getAllByRole('row');

    expect(rows).toHaveLength(3); // 1 header row + 2 body rows
  });

  it('should render the table with the correct content', () => {
    render(
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Header 1</TableHead>
            <TableHead>Header 2</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Row 1, Cell 1</TableCell>
            <TableCell>Row 1, Cell 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByText('Row 1, Cell 1')).toBeInTheDocument();
    expect(screen.getByText('Row 1, Cell 2')).toBeInTheDocument();
  });

  it('should apply additional props to table elements', () => {
    render(
      <Table>
        <TableHeader>
          <tr>
            <TableHead data-testid="table-head">Header 1</TableHead>
            <TableHead>Header 2</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell data-testid="table-cell">Row 1, Cell 1</TableCell>
            <TableCell>Row 1, Cell 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const header = screen.getByTestId('table-head');
    const cell = screen.getByTestId('table-cell');

    expect(header).toBeInTheDocument();
    expect(cell).toBeInTheDocument();
  });
});
