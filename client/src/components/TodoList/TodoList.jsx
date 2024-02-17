import React from 'react';
import TodoItem from './TodoItem';
/**
 * 
 * @param {component} todoList todoList parameter is the overall list of items we want to display.
 * @param {string} projectName projectName parameter contains the string for the project the todoList belongs to.
 * @param {*} notification notification parameter is for the notification to be sent upon updates in the todo list.
 * @param {*} emailList emailList contains a list of emails to send the notifications too. 
 * @returns {component} returns the todoList containing the individual todo items to be displayed.
 */
// defining what a list of tasks is using the map function to pull in the individual items.
const TodoList = ({ todoList, todoTeam, projectName, notification, emailList }) => {
  return (
    <div>
      {todoList.map((todo, idx) => {
        return (
          <TodoItem
            key={idx}
            todo={todo}
            projectName={projectName}
            notification={notification}
            emailList={emailList}
          />
        );
      })}
    </div>
  );
};
export default TodoList;
