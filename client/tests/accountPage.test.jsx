import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Profile} from '../src/pages/Profile.jsx'
import { ProfileData } from '../src/components/ProfileData';



const listToDisplay = [
    {
    }
];

describe('Account Page Test', () => {
  it('renders AccountPage', () => {
    render(<ProfileData GraphData={{
        displayName: 'Dummy Joe',
        mail: 'dummy@mail.com',
    }}/>);
    
    // screen.debug();
  });
});
