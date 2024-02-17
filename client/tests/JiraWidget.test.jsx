import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import JiraWidget from '../src/widgets/jiraWidget';

const goodData = [
  {
    Key: 'TB-60',
    Summary: 'Backend - Endpoint - index',
    Status: 'To Do',
    Updated: '2023-05-16T20:58:05.644-0700',
  },
  {
    Key: 'TB-59',
    Summary: 'Utility ',
    Status: 'To Do',
    Updated: '2023-05-16T20:58:03.859-0700',
  },
  {
    Key: 'TB-58',
    Summary: 'User Model',
    Status: 'To Do',
    Updated: '2023-05-16T20:58:02.214-0700',
  },
  {
    Key: 'TB-57',
    Summary: 'Project Model',
    Status: 'To Do',
    Updated: '2023-05-16T20:58:00.260-0700',
  },
  {
    Key: 'TB-56',
    Summary: 'Custom Response',
    Status: 'To Do',
    Updated: '2023-05-16T20:57:58.237-0700',
  },
  {
    Key: 'TB-55',
    Summary: 'TodoList',
    Status: 'To Do',
    Updated: '2023-05-16T20:57:56.323-0700',
  },
  {
    Key: 'TB-54',
    Summary: 'Sonar',
    Status: 'To Do',
    Updated: '2023-05-16T20:57:54.224-0700',
  },
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
    Key: 'TB-49',
    Summary: 'Logger',
    Status: 'Done',
    Updated: '2023-05-16T20:54:10.253-0700',
  },
  {
    Key: 'TB-48',
    Summary: 'Sonar Update',
    Status: 'Done',
    Updated: '2023-05-16T20:53:29.607-0700',
  },
  {
    Key: 'TB-47',
    Summary: 'Fix Search functionality / Change toggles to created by',
    Status: 'Done',
    Updated: '2023-05-12T08:40:09.862-0700',
  },
  {
    Key: 'TB-46',
    Summary: 'Projects-Todos',
    Status: 'Done',
    Updated: '2023-05-11T18:27:23.706-0700',
  },
  {
    Key: 'TB-45',
    Summary: 'search bar',
    Status: 'Done',
    Updated: '2023-05-10T20:13:30.587-0700',
  },
  {
    Key: 'TB-44',
    Summary: 'This new page where user can see all the projects.',
    Status: 'To Do',
    Updated: '2023-05-02T16:45:53.244-0700',
  },
  {
    Key: 'TB-43',
    Summary: 'Real - Homepage',
    Status: 'To Do',
    Updated: '2023-05-02T16:45:18.551-0700',
  },
  {
    Key: 'TB-41',
    Summary: 'email notification',
    Status: 'In Progress',
    Updated: '2023-05-05T11:51:29.438-0700',
  },
  {
    Key: 'TB-40',
    Summary: 'Add a "+New" button, prompts user if they have empty dashboard',
    Status: 'To Do',
    Updated: '2023-04-24T19:30:26.158-0700',
  },
  {
    Key: 'TB-39',
    Summary: 'Protected Routes',
    Status: 'In Progress',
    Updated: '2023-04-19T18:39:53.406-0700',
  },
  {
    Key: 'TB-38',
    Summary: 'Account Page',
    Status: 'Done',
    Updated: '2023-04-19T20:00:25.301-0700',
  },
  {
    Key: 'TB-37',
    Summary: 'Fetch the project data from backend',
    Status: 'Done',
    Updated: '2023-05-15T18:51:35.050-0700',
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
    Key: 'TB-34',
    Summary: 'Display sonar, gitlab and Jira status',
    Status: 'Done',
    Updated: '2023-04-24T19:25:38.838-0700',
  },
  {
    Key: 'TB-33',
    Summary: 'Project detail page',
    Status: 'To Do',
    Updated: '2023-04-17T15:06:01.651-0700',
  },
  {
    Key: 'TB-32',
    Summary: 'Connection to the backend',
    Status: 'In Progress',
    Updated: '2023-04-14T20:01:57.761-0700',
  },
  {
    Key: 'TB-30',
    Summary: 'Style Navigation Bar to match preexisting model in Figma',
    Status: 'Done',
    Updated: '2023-04-17T11:29:15.083-0700',
  },
  {
    Key: 'TB-29',
    Summary: 'Implement routes for Navigation Bar',
    Status: 'Done',
    Updated: '2023-04-17T09:41:41.450-0700',
  },
  {
    Key: 'TB-28',
    Summary: 'Create Navigation Bar',
    Status: 'Done',
    Updated: '2023-04-14T09:06:20.518-0700',
  },
  {
    Key: 'TB-27',
    Summary: 'Search bar/Backend implementation',
    Status: 'Done',
    Updated: '2023-05-10T20:13:38.614-0700',
  },
  {
    Key: 'TB-24',
    Summary: 'Create User Model',
    Status: 'Done',
    Updated: '2023-05-16T20:54:32.225-0700',
  },
  {
    Key: 'TB-23',
    Summary: "Determine how we'll store API tokens",
    Status: 'To Do',
    Updated: '2023-04-04T06:06:27.181-0700',
  },
  {
    Key: 'TB-22',
    Summary: 'Document database design and schema',
    Status: 'Done',
    Updated: '2023-04-28T14:37:42.502-0700',
  },
  {
    Key: 'TB-21',
    Summary: 'Display a list of projects',
    Status: 'Done',
    Updated: '2023-04-21T19:07:39.960-0700',
  },
  {
    Key: 'TB-20',
    Summary: 'Decide 3 APIs: gitlab, Jira, sonar',
    Status: 'Done',
    Updated: '2023-04-28T14:37:37.034-0700',
  },
  {
    Key: 'TB-19',
    Summary: 'Design database',
    Status: 'Done',
    Updated: '2023-05-16T20:54:36.371-0700',
  },
  {
    Key: 'TB-18',
    Summary: 'Create mongoDB account and connect it',
    Status: 'Done',
    Updated: '2023-04-13T21:59:24.743-0700',
  },
  {
    Key: 'TB-17',
    Summary: 'DB',
    Status: 'To Do',
    Updated: '2023-03-13T18:20:27.912-0700',
  },
  {
    Key: 'TB-16',
    Summary: '"Add new projects" subpage',
    Status: 'Done',
    Updated: '2023-04-09T16:28:19.559-0700',
  },
  {
    Key: 'TB-15',
    Summary: 'Nav bar and corresponding routes & search bar',
    Status: 'Done',
    Updated: '2023-04-17T11:30:04.483-0700',
  },
  {
    Key: 'TB-14',
    Summary: 'Microsoft sso',
    Status: 'Done',
    Updated: '2023-04-21T19:04:40.699-0700',
  },
  {
    Key: 'TB-13',
    Summary: 'Home Page',
    Status: 'To Do',
    Updated: '2023-03-13T15:09:42.275-0700',
  },
  {
    Key: 'TB-12',
    Summary: 'Login',
    Status: 'To Do',
    Updated: '2023-04-13T17:30:57.651-0700',
  },
  {
    Key: 'TB-10',
    Summary: 'Fill out when2meet link in discord.',
    Status: 'Done',
    Updated: '2023-01-26T01:04:29.787-0800',
  },
  {
    Key: 'TB-7',
    Summary: 'Isle of Trust',
    Status: 'Done',
    Updated: '2023-02-13T18:28:34.311-0800',
  },
  {
    Key: 'TB-6',
    Summary: 'Lingo Medico',
    Status: 'Done',
    Updated: '2023-02-13T18:28:36.936-0800',
  },
  {
    Key: 'TB-5',
    Summary: 'Portal: Visualization of data availability',
    Status: 'Done',
    Updated: '2023-02-13T18:28:31.744-0800',
  },
  {
    Key: 'TB-4',
    Summary: 'EV Charging',
    Status: 'Done',
    Updated: '2023-02-13T18:28:28.877-0800',
  },
];

describe('Test', () => {
  it('renders Test component', () => {
    render(<JiraWidget jiraResult={goodData} />);
    screen.debug();
  });
});
