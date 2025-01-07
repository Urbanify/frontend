import { fireEvent, render, screen } from '@testing-library/react';
import { toast } from 'sonner';

import { Toaster } from './toaster';
import { Button } from '../button/button';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
  // eslint-disable-next-line tailwindcss/no-custom-classname
  Toaster: () => <div className="toaster group" data-testid="toaster-el" />,
}));

describe('Components -> Toaster', () => {
  it('should render the Toaster component properly', () => {
    render(<Toaster data-testid="toaster-el" />);

    const toaster = screen.getByTestId('toaster-el');

    expect(toaster).toBeInTheDocument();
  });

  it('should trigger a success toast on button click', () => {
    render(
      <div>
        <Toaster />
        <Button

          data-testid="toast-button"
          onClick={() => toast.success('Success!')}
        >
          Trigger Toast
        </Button>
      </div>,
    );

    const button = screen.getByTestId('toast-button');
    fireEvent.click(button);

    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith('Success!');
  });

  it('should apply the theme prop correctly', () => {
    const { container } = render(<Toaster theme="dark" />);
    const toaster = container.querySelector('.toaster');

    expect(toaster).toBeInTheDocument();
    expect(toaster).toHaveClass('group');
  });
});
