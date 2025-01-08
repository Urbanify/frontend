import { render, screen } from '@testing-library/react';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';

describe('Avatar Component', () => {
  it('renders without crashing', () => {
    render(
      <Avatar data-testid="avatar-el">
        <AvatarImage src="https://via.placeholder.com/150" alt="User" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>,
    );
    const avatar = screen.getByTestId('avatar-el');

    expect(avatar).toBeInTheDocument();
  });

  it('renders the image correctly', () => {
    render(
      <Avatar data-testid="avatar-el">
        <AvatarImage
          src="https://via.placeholder.com/150"
          alt="User"
          data-testid="avatar-image"
        />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>,
    );
    const avatarImage = screen.getByTestId('avatar-image');

    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('src', 'https://via.placeholder.com/150');
    expect(avatarImage).toHaveAttribute('alt', 'User');
  });

  it('renders fallback content when no image is provided', () => {
    render(
      <Avatar data-testid="avatar-el">
        <AvatarFallback data-testid="avatar-fallback">AB</AvatarFallback>
      </Avatar>,
    );
    const avatarFallback = screen.getByTestId('avatar-fallback');

    expect(avatarFallback).toBeInTheDocument();
    expect(avatarFallback).toHaveTextContent('AB');
  });

  it('applies additional className to the Avatar', () => {
    render(
      // eslint-disable-next-line tailwindcss/no-custom-classname
      <Avatar data-testid="avatar-el" className="custom-avatar-class">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    const avatar = screen.getByTestId('avatar-el');

    expect(avatar).toHaveClass('custom-avatar-class');
  });

  it('applies additional className to the AvatarImage', () => {
    render(
      <Avatar data-testid="avatar-el">
        <AvatarImage
          src="https://via.placeholder.com/150"
          alt="User"
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className="custom-image-class"
          data-testid="avatar-image"
        />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>,
    );
    const avatarImage = screen.getByTestId('avatar-image');

    expect(avatarImage).toHaveClass('custom-image-class');
  });

  it('applies inline styles correctly to Avatar', () => {
    render(
      <Avatar
        data-testid="avatar-el"
        style={{ border: '2px solid red', width: '50px', height: '50px' }}
      >
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    const avatar = screen.getByTestId('avatar-el');

    expect(avatar).toHaveStyle({ border: '2px solid red', width: '50px', height: '50px' });
  });
});
