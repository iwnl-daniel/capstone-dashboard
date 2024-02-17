import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SignInButton } from '../src/components/SignInButton';

describe('SignIn Button Renders', () => {
  it('Button is able to be rendered', () => {
    const { getByRole } = render(<SignInButton />);
    const button = getByRole('button');
    expect(button).toBeInTheDocument()
    screen.debug();
  });

});
