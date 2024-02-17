// import my TodoList component object.
import TodoList from './TodoList';
// Importation to use the current program state to populate previously defined todo tasks.
import React, { useState, useEffect } from 'react';
// importation for the microsoft mui materials to create the todo display panel.
import { Typography, Box, Button, TextField } from '@mui/material';
// import msal to get the authentecated instance user for the email.
import { useMsal } from '@azure/msal-react';
// imports the divider component to create a seperating line between the todo items listed.
import Divider from '@mui/material/Divider';
// import the modal component to display the todo history when the history button is pushed.
import Modal from '@mui/material/Modal';
// import moment to handle time changes to get three days of todo history additons and changes.
import moment from 'moment';

// styling for the history pop-up modal.
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  height: 600,
  overflowY: 'scroll',
  borderRadius: '5px',
};

/**
 * @param {JSX.Element} todo method takes in a todo component/ prop imported from ./TodoList map function.
 * @param {string} todoTeam method takes in the todoteam attribute associated with a todo component/ prop
 * @param {string} projectName method takes in the project name.
 * @return {component} returns the todoDisplay with buttons for +NEW, Save, Cancel, History. Also checkboxes for each todo item.
 */
function TodoDisplay({ todos, todoTeam, projectName, notification, emailList }) {
  // Setting the current state of the app that we are concerned with to the TodoList component using the test json data.
  const [todoList, setToDoList] = useState(todos);
  // state for adding a new todo item, toggles the buttons +NEW to Save and visa vera.
  const [add, setAdd] = useState(true);
  // add the user input to the list of todo items.
  const [userInput, setUserInput] = useState('');
  // state for setting the history filling it with todo items.
  const [history, setHistory] = useState([]);
  // toggle between the modal appearing and disapearing when the history button is clicked.
  const [open, setOpen] = useState(false);
  // toggle the open and set closing of the modal.
  const handleClose = () => setOpen(false);
  // state to get the authenticated user to access user properties such as the username.
  const { instance } = useMsal();
  // get the logged in users username for logging purposes.
  const user = instance.getActiveAccount().username;

  // displays +NEW or SAVE after toggled.
  function AddItem() {
    // terinary to toggle between addTask and save. [if user clicks +NEW button changes to SAVE.]
    add ? addTask() : save();
  }
  // create the new todo task from the user input when Save is clicked.
  async function save() {
    // chack to ensure the user has entered something in the textField when pressing +NEW and SAVE. if not return. If input was entered add it to todo list in database.
    if (userInput === '') return;
    // create the url we post to for updates.                                    TestNewProject31
    const PostURL = `http://localhost:3001/project/todo/add?projectName=${projectName}&userEmail=${user}&todoName=${userInput}&todoTeam=${todoTeam}`;
    // toggle between save button display is the current state.
    setAdd((current) => !current);
    // post the user input to the url from above updating the backend.
    const post = await fetch(PostURL, {
      method: 'POST',
    });
    /* New todo that will be added. */
    const addObject = {
      projectName: projectName,
      todoAssignee: null,
      todoCreator: user,
      todoName: userInput,
      todoStatus: false,
      todoTeam: todoTeam,
      todoUpdatedBy: user,
    };
    // set the todo list with the new items added.
    setToDoList((current) => [...current, addObject]);
    // reset the setUserInput state to blank for a new item when the user presses + NEW
    setUserInput('');
  }
  // toggle between +NEW and Save.
  function addTask() {
    // toggle between +NEW and SAVE
    setAdd((current) => !current);
  }
  // function to get the history items within the specified amount of days
  async function ItemHistory() {
    // attempt to pull in the todo items for the project currently viewing.
    try {
      const test = await fetch(
        `http://127.0.0.1:3001/project/todo/history?projectName=${projectName}`
      );
      // if the fetch call works we store the objects fetched for parsing.
      const json = await test.json();
      // declare a variable to store any todo items we want displayed when History is pressed.
      let foundHistory = [];
      // declare a constant variable to get the current date and format it to match the logging.
      const yearMonthDayNow = moment().format('YYYY-MM-DD');
      // declare a constant storing the current date.
      const zeroDaysAgo = moment(yearMonthDayNow).subtract(0, 'days');
      // declare a constant storing yesterdays date.
      const oneDaysAgo = moment(yearMonthDayNow).subtract(1, 'days');
      // declare a constant storing the date from two days ago.
      const twoDaysAgo = moment(yearMonthDayNow).subtract(2, 'days');
      // declare a constant storing the date from three days ago.
      const threeDaysAgo = moment(yearMonthDayNow).subtract(3, 'days');
      // map out the todos from the todoLog.
      json.map((todo) => {
        // grab the todo date from the logs.
        var temp = todo.dateTime.slice(0, 10);
        // check if the todo date matches the date from the past 3 days.
        if (
          temp === zeroDaysAgo.format('YYYY-MM-DD') ||
          temp === oneDaysAgo.format('YYYY-MM-DD') ||
          temp === twoDaysAgo.format('YYYY-MM-DD') ||
          temp === threeDaysAgo.format('YYYY-MM-DD')
        ) {
          // if the todo date is within the last 3 days add it to the list of todo items to be displayed in the history.
          foundHistory.push(todo);
        }
      });
      // with the history items identified populate the array of history items for display.
      setHistory((current) => [...foundHistory]);
      // toggle between opening and closing the modal containing the history items.
      setOpen((current) => !current);
      // if the fetch request does not work log an error.
    } catch (err) {
      console.log('err ', err);
    }
  }
  //-------------------------------------------- END OF THE HISTORY FUNCTIONALITY --------------------------------------------------------------

  // Appearnce attributes and data population:
  return (
    // Main box containing the todo task list and buttons. Background color set from the figma design.
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-evenly'}
      backgroundColor={'#D9D9D9'}
      border='2px solid #000'
      width={500}
      padding={0.5}
      borderRadius='5px'
    >
      <Box
        display='flex'
        justifyContent={'space-evenly'}
        alignContent={'center'}
        color={'todoButtonsBg'}
        padding={0.5}
      >
        <Box display='flex' size='fit' padding={0.5} borderRadius='5px'>
          <Button
            varient='contained'
            size='small'
            id='historyButton'
            value='history'
            sx={{
              height: '38px',
              width: '75px',
              color: '#FFFFFF',
              backgroundColor: '#104E8D',
              '&:hover': {
                backgroundColor: '#cdecfa',
                color: '#016591',
              },
            }}
            onClick={ItemHistory}
          >
            History
          </Button>
        </Box>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <Typography id='modal-modal-title' variant='h3' component='h2'>
              History
            </Typography>
            {history.length > 0 &&
              history.map((item, key) => (
                <Box key={key} display={'flex'} flexDirection={'column'} gap={1}>
                  <Divider />
                  <Typography>{item.projectName}</Typography>
                  <Typography>{item.dateTime}</Typography>
                  <Typography>{item.updatedBy}</Typography>
                  <Typography>{item.changed}</Typography>
                </Box>
              ))}
          </Box>
        </Modal>

        <Box display='flex' paddingLeft={0.5} paddingRight={0.5} size='fit'>
          <Typography id='todoTeam-Title' variant='h4' component='h3'>
            {' '}
            {todoTeam}{' '}
          </Typography>
        </Box>

        <Box display='flex' flexDirection='column' size='fit' padding={0.5} borderRadius='5px'>
          <Button
            varient='contained'
            size='small'
            id='taskButton'
            value='newTask'
            sx={{
              color: '#FFFFFF',
              backgroundColor: '#104E8D',
              height: '38px',
              width: '75px',
              '&:hover': {
                backgroundColor: '#cdecfa',
                color: '#016591',
              },
            }}
            onClick={AddItem}
          >
            {add ? '+ New' : 'save'}
          </Button>

          {!add && (
            <Button
              sx={{
                mt: 2,
                color: '#FFFFFF',
                backgroundColor: '#104E8D',
                height: '38px',
                width: '75px',
                '&:hover': {
                  backgroundColor: '#cdecfa',
                  color: '#016591',
                  height: '38px',
                  width: '75px',
                },
              }}
              onClick={() => {
                setAdd((current) => !current);
              }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
      <Box>
        {!add && (
          <TextField
            label='Todo'
            value={userInput}
            sx={{ m: 2 }}
            onChange={(e) => setUserInput(e.target.value)}
          >
            User Text
          </TextField>
        )}
      </Box>

      <Divider />

      <Box overflow={'scroll'} maxHeight={425}>
        <TodoList
          todoList={todoList}
          projectName={projectName}
          todoTeam={todoTeam}
          notification={notification}
          emailList={emailList}
        />
      </Box>
    </Box>
  );
}
export default TodoDisplay;
