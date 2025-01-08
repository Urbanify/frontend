import { fireEvent, render, screen } from '@testing-library/react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button/button';

import { SidebarContext, useSidebar } from './useSidebar';

// Create a custom SidebarProvider to provide context values for tests
const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [state, setState] = useState<'expanded' | 'collapsed'>('collapsed');
  const isMobile = window.innerWidth <= 768;

  const toggleSidebar = () => {
    setState(state === 'collapsed' ? 'expanded' : 'collapsed');
  };

  return (
    <SidebarContext
      value={{
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext>
  );
};

describe('SidebarContext', () => {
  it('should throw an error if useSidebar is used outside of SidebarProvider', () => {
    const TestComponent = () => {
      useSidebar();
      return <div>Test</div>;
    };

    expect(() => {
      render(<TestComponent />);
    }).toThrowError('useSidebar must be used within a SidebarProvider.');
  });

  it('should provide correct context values when wrapped in SidebarProvider', () => {
    const TestComponent = () => {
      const {
        state,
        open,
        setOpen,
        toggleSidebar,
      } = useSidebar();

      return (
        <div>
          <span>{state}</span>
          <Button onClick={() => setOpen(!open)}>Toggle Open</Button>
          <Button onClick={toggleSidebar}>Toggle Sidebar</Button>
        </div>
      );
    };

    render(
      <SidebarProvider>
        <TestComponent />
      </SidebarProvider>,
    );

    expect(screen.getByText('collapsed')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Toggle Sidebar'));

    expect(screen.getByText('expanded')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Toggle Sidebar'));

    expect(screen.getByText('collapsed')).toBeInTheDocument();
  });

  // Test 3: Ensure toggle actions work
  it('should toggle open state', () => {
    const TestComponent = () => {
      const { open, setOpen } = useSidebar();

      return (
        <div>
          <span>{open ? 'Open' : 'Closed'}</span>
          <Button onClick={() => setOpen(!open)}>Toggle Open</Button>
        </div>
      );
    };

    render(
      <SidebarProvider>
        <TestComponent />
      </SidebarProvider>,
    );

    expect(screen.getByText('Closed')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Toggle Open'));

    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('should determine if the screen is mobile', () => {
    // Set window innerWidth to simulate mobile
    // eslint-disable-next-line no-restricted-globals
    global.innerWidth = 500;

    const TestComponent = () => {
      const { isMobile } = useSidebar();

      return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
    };

    const { rerender } = render(
      <SidebarProvider>
        <TestComponent />
      </SidebarProvider>,
    );

    expect(screen.getByText('Mobile')).toBeInTheDocument();

    // Reset window innerWidth
    // eslint-disable-next-line no-restricted-globals
    global.innerWidth = 1024;

    rerender(
      <SidebarProvider>
        <TestComponent />
      </SidebarProvider>,
    );

    expect(screen.getByText('Desktop')).toBeInTheDocument();
  });
});
