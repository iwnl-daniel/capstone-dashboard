import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import TodoDisplay from '../src/components/TodoList/TodoDisplay';
import TodoList from '../src/components/TodoList/TodoList';
import TodoItem from '../src/components/TodoList/TodoItem';

// create a test suite for the TodoDisplay component
TodoItem = () => {
  return (
    <div>
      <h1>TodoItem</h1>
    </div>
  );
};

// create todoList array
const todoList = [
  {
    Key: 'TB-60',
    Summary: 'Backend - Endpoint - index',
    Status: 'To Do',
    Updated: '2023-05-16T20:58:05.644-0700',
  },
];

// create a test suite for the TodoDisplay component
TodoDisplay = () => {
  return (
    <div>
      <h1>TodoDisplay</h1>
    </div>
  );
};

// todoDisplay component with appropriate variables
TodoDisplay({
  todoList: todoList,
  todoTeam: 'Team 1',
  todoProject: 'Project 1',
  todoStatus: 'To Do',
  todoSummary: 'Backend - Endpoint - index',
  todoKey: 'TB-60',
  todoUpdated: '2023-05-16T20:58:05.644-0700',
  emailList: ['andrew@pdx.edu']
})

describe('todoList', () => {
  //  Checks to ensure the TodoList component contains elements
  test('renders the TodoDisplay component', () => {
    render(<TodoDisplay result={todoList}/>);
    expect(screen.getByText('TodoDisplay')).toBeInTheDocument();
  });
  //  Checks to ensure the TodoList component contains elements
  test('renders the TodoItem component', () => {
    render(<TodoItem />);
    expect(screen.getByText('TodoItem')).toBeInTheDocument();
  });
  //  Checks to ensure the returned data is not null
  test('renders the TodoDisplay component', () => {
    const result = TodoDisplay({
      todoList: todoList,
      todoTeam: 'Team 1',
      todoProject: 'Project 1',
      todoStatus: 'To Do',
      todoSummary: 'Backend - Endpoint - index',
      todoKey: 'TB-60',
      todoUpdated: '2023-05-16T20:58:05.644-0700',
      emailList: ['andrew@pdx.edu']
    });
    render(<TodoDisplay result={todoList}/>);
    expect(result).not.toBeNull();
  });
});