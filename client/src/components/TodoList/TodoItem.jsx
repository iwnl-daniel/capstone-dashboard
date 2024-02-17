import React, { useState } from 'react';
import { FormControlLabel, Checkbox, Box } from '@mui/material';
import { useMsal } from '@azure/msal-react';

/**
 * TodoItem - Module creating individual todo items to be displayed in a list.
 * @param {prop} todo -this parameter is a todo object or prop.
 * @param {string} projectName - This parameter is a string containing the project name the todo item is displayed on.
 * @param {string} notification - This is the parameter containing the notification to be sent.
 * @param {*} emailList - This parameter contains a list of emails to send the notification to.
 * 
 * @returns {component} - Returns a checkbox containing the individual todo item to be displayed in a list.
 */

/* ROUTE AND BODY FUNCTION INFORMATION - emailList and message will be taken from components
   - FUNCTION WILL BE CALLED IN THE TODO LIST INDIVIDUAL COMPONENT WHEN A USER CHECKS THE TODO ITEM AS COMPLETED*/
const mailURL = `http://127.0.0.1:3001/email`;
const sendnotification = async (projectName, emailList, todo, status) => {
  console.log('status ', status);

  const body = {
    emailList: emailList,
    projectName: projectName,
    message: `Project: ${projectName}
    Team: ${todo.todoTeam} 
    Todo Task: ${todo.todoName} 
    Status: ${!status ? 'Completed' : 'Changed to uncompleted'}
    Todo creator: ${todo.todoCreator}
    Updated by ${todo.todoUpdatedBy}`,
  };

  try {
    const response = await fetch(mailURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    console.log('response: ', json);
  } catch (err) {
    console.log(err);
  }
};

const TodoItem = ({ todo, projectName, notification, emailList }) => {
  const [status, setStatus] = useState(todo.todoStatus);
  const { instance } = useMsal();
  const user = instance.getActiveAccount().username;

  async function postToggle() {
    const PostURL = `http://127.0.0.1:3001/project/todo/update?projectName=${projectName}&userEmail=${user}&todoName=${todo.todoName}&todoTeam=${todo.todoTeam}`;
    const post = await fetch(PostURL, {
      method: 'POST',
    });

    if (post.statusText === 'OK') {
      setStatus((current) => !current);

      if (notification) {
        sendnotification(projectName, emailList, todo, status);
      }
    }
  }

  return (
    <Box display='flex' flexDirection='column'>
      <FormControlLabel
        control={<Checkbox color='todoCheckboxColor' onChange={postToggle} checked={status} />}
        label={todo.todoName}
      />
    </Box>
  );
};

export default TodoItem;
