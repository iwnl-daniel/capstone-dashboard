import { Box, Divider, Typography } from '@mui/material';
import JiraGrid from './dataGridWidget.jsx';

/**
 * JiraWidget - filters the array of objects by tasks unfinished and passes the result to JiraGrid to be displayed.
 * Displays total tickets, completed tickets and unfinished tickets.
 * @param {Array.<{Key: String, Summary: String, Status: String, Updated: String}>} jiraResult - An array of objects that contain information about Jira tickets
 * @param {Strnig} jiraDomain - A string that contains the projects Jira domain to create a link that is passed down to the DataGridWidget component
 * @returns  {JSX.Element} The rendered JiraWidget component that also contains the JiraGrid component.
 */
const JiraWidget = ({ jiraResult, jiraDomain }) => {
  /**
   * Value for the total tasks
   * @type {number}
   * */
  const tasks = jiraResult.length;

  /**
   * Value for the tasks in progress
   * @type {number}
   * */
  let inProgress = 0;

  /**
   * Array for data in progress.
   * @type {array}
   * */
  let filterData = [];
  jiraResult.map((element) => {
    if (element.Status === 'In Progress') {
      inProgress += 1;
      filterData.push(element);
    }
  });

  return (
    <Box mt={'25px'} p={'20px'} border={2} borderColor={'#104E8D'} borderRadius={2}>
      <Typography fontSize='1rem' fontWeight='bold' textAlign={'start'}>
        Jira
      </Typography>
      <Divider color={'#104E8D'} sx={{ borderBottomWidth: 2 }} />
      <Box display={'flex'} flexDirection={'column'} textAlign={'start'} gap={'5px'} pt={'10px'}>
        <Typography>Tickets: {tasks}</Typography>
        <Typography>Completed: {tasks - inProgress}</Typography>
        <Typography>In progress: {inProgress}</Typography>
      </Box>

      <JiraGrid data={filterData} jiraDomain={jiraDomain} />
    </Box>
  );
};

export default JiraWidget;
