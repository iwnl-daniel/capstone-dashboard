import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SonarWidget from '../src/widgets/sonarWidget';

const data = [
  {
    metricKey: 'new_reliability_rating',
    metricStatus: 'OK',
  },
  {
    metricKey: 'new_security_rating',
    metricStatus: 'OK',
  },
  {
    metricKey: 'new_maintainability_rating',
    metricStatus: 'OK',
  },
  {
    metricKey: 'new_coverage',
    metricStatus: 'OK',
  },
  {
    metricKey: 'new_duplicated_lines_density',
    metricStatus: 'OK',
  },
];

describe('Test', () => {
  it('renders Test component', () => {
    render(<SonarWidget sonar={data} />);
    screen.debug();
  });
});
