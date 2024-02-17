import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import GitlabWidget from '../src/widgets/gitlabWidget';

const goodName = 'Good_Branch';
const goodPipeline = [
  {
    id: 804912132,
    ref: 'Good_Branch',
    pipelineStatus: 'success',
    pipelineLink: 'https://gitlab.com/example-dashbord/example-dashboard/-/pipelines/804912132',
  },
  {
    id: 804910141,
    ref: 'Good_Branch',
    pipelineStatus: 'failed',
    pipelineLink: 'https://gitlab.com/example-dashbord/example-dashboard/-/pipelines/804910141',
  },
];

describe('Test', () => {
  test('renders Test component', () => {
    render(<GitlabWidget branchName={goodName} pipeline={goodPipeline} />);
    screen.debug();
  });

  test('renders Test component', () => {
    render(<GitlabWidget branchName={goodName} pipeline={goodPipeline} />);
    screen.debug();
  });
});
