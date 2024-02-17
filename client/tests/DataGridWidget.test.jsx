import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import JiraGrid from '../src/widgets/dataGridWidget';

const goodData = [
  {
    Key: 'TB-53',
    Summary: 'Gitlab',
    Status: 'In Progress',
    Updated: '2023-05-16T20:58:25.238-0700',
  },
  {
    Key: 'TB-52',
    Summary: 'Backend Unittests',
    Status: 'In Progress',
    Updated: '2023-05-16T20:58:31.012-0700',
  },
  {
    Key: 'TB-51',
    Summary: 'test jira frontend 2 d',
    Status: 'In Progress',
    Updated: '2023-05-12T12:07:42.206-0700',
  },
  {
    Key: 'TB-50',
    Summary: 'test jira frontend 1',
    Status: 'In Progress',
    Updated: '2023-05-12T12:07:24.700-0700',
  },
  {
    Key: 'TB-41',
    Summary: 'email notification',
    Status: 'In Progress',
    Updated: '2023-05-05T11:51:29.438-0700',
  },
  {
    Key: 'TB-39',
    Summary: 'Protected Routes',
    Status: 'In Progress',
    Updated: '2023-04-19T18:39:53.406-0700',
  },
  {
    Key: 'TB-36',
    Summary: 'todo list display',
    Status: 'In Progress',
    Updated: '2023-04-24T19:31:42.610-0700',
  },
  {
    Key: 'TB-35',
    Summary: 'add todo button&windows(box)',
    Status: 'In Progress',
    Updated: '2023-04-24T19:31:00.370-0700',
  },
  {
    Key: 'TB-32',
    Summary: 'Connection to the backend',
    Status: 'In Progress',
    Updated: '2023-04-14T20:01:57.761-0700',
  },
];

const badData = [
  {
    Key: 'TB-32',
    Summary: 'Connection to the backend',
    Status: 'In Progress',
  },
];
describe('Test for JiraGrid', () => {
  test('Checks that the component renders with valid data', () => {
    render(<JiraGrid data={goodData} />);
    screen.debug();
  });
  test('Checks that the component renders with bad data', () => {
    render(<JiraGrid data={{}} />);
    screen.debug();
  });
});
