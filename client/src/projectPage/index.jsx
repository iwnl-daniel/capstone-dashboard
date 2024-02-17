import { Box, Divider, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import JiraWidget from '../widgets/jiraWidget';
import GitlabWidget from '../widgets/gitlabWidget';
import SonarWidget from '../widgets/sonarWidget';
import TodoDisplay from '../components/TodoList/TodoDisplay';
import { useMsal } from '@azure/msal-react';
import { useParams } from 'react-router-dom';

/**
 * ProjectPage - The project page makes an api call for the selected project
 * that returns all the project informatoin to be displayed.
 * The project controls the notification option to send emails when a todo task is finished
 * by making an api call when the notiification button is selected.
 * @returns  {JSX.Element} The rendered ProjectPage component.
 */
const ProjectPage = () => {
  /**@type {boolean} */
  const [isNotification, setIsNotification] = useState(null);
  /**
   * Contains All the information of a project for this page
   * @type {object}
   * */
  const [data, setData] = useState(null);
  /**
   * Contains all the Code Smell information for the project
   * @type {object}
   */
  const [codeSmell, setCodeSmell] = useState(null);
  /**
   * The current project name
   * @type {string}
   * */
  const { projectName } = useParams();
  /**
   * Instance of Msal
   * @type {object}
   * */
  const { instance } = useMsal();
  /**
   * The current user email
   * @type {string}
   * */
  const user = instance.getActiveAccount().username;

  /**
   * Sends a PUT to the server to change the notification status
   * On success, notification button is updated
   * @async
   * @returns {Promise<Object>} The data from the url
   * */
  const toggleNotification = async () => {
    const options = {
      method: 'PUT',
    };
    const urlNotification = `http://localhost:3001/project/notification?projectName=${projectName}&userEmail=${user}`;

    try {
      const response = await fetch(urlNotification, options);
      const json = await response.json();
      if (json.response === 'OK') {
        setIsNotification((current) => !current);
      }
    } catch (error) {
      /**@throws {error} */
      console.log('err: ', error);
    }
  };

  /* PROJECT DATA AND CODE SMELL API CALLS HERE
   *NOTE: PROJECT IS BUILT ON A FREE VERSION OF SONAR AND RETURNS A FAILED API CALL THE MAJORITY OF TIME */
  useEffect(() => {
    /**
     * Fetches the data a project to be displayed on this page.
     * Fetches the Code Smell for this project to be displayed
     * @async
     * @function fetchData
     * @returns {Promise<Object>} The data from the url
     * @returns {Promise<Object>} The data from the second url
     * */
    const fetchData = async () => {
      const url = `http://localhost:3001/project?projectName=${projectName}`;
      try {
        /* First fetch is for the current project information */
        const response = await fetch(url);
        const json = await response.json();

        setData(json);
        setIsNotification(json.notification);

        /* The second fetch using information to create the second url to fetch the code smells */
        const urlCodeSmell = `http://localhost:3001/sonar/codesmell?projectLink=${json.sonarInfo.projectLink}`;
        const responseCodeSmell = await fetch(urlCodeSmell);
        const jsonCodeSmell = await responseCodeSmell.json();
        setCodeSmell(jsonCodeSmell);
      } catch (error) {
        /**@throws {error} */
        console.log('Error: ', error);
        setCodeSmell(undefined);
      }
    };
    fetchData();
  }, []);

  return (
    <Box
      display={'flex'}
      flexWrap={'wrap'}
      flexDirection={'column'}
      width={'100%'}
      justifyContent={'space-between'}
      alignContent={'space-between'}
      alignItems={'baseline'}
      mx={'20px'}
      mb={'20px'}
    >
      <Box display={'flex'} flexWrap={'wrap'} width={'100%'} justifyContent={'space-between'}>
        {data && (
          <Typography alignSelf={'center'} fontSize={'1.5rem'}>
            Project: {data.projectName}
          </Typography>
        )}
        {data && (
          <Button
            variant='contained'
            color={isNotification ? 'success' : 'error'}
            sx={{ mb: '10px', width: '170px' }}
            onClick={toggleNotification}
          >
            {isNotification ? 'Notification on' : 'Notification off'}
          </Button>
        )}
      </Box>
      <Divider width={'100%'} color={'#104E8D'} sx={{ borderBottomWidth: 2 }} />

      <Box
        display={'flex'}
        width={'100%'}
        flexWrap={'wrap'}
        justifyContent={'space-between'}
        alignContent={'space-between'}
        alignItems={'baseline'}
      >
        <Box>
          {data && (
            <GitlabWidget
              branchName={data.gitlabInfo.branchName}
              pipeline={data.gitlabInfo.pipelines}
            />
          )}

          {data && <SonarWidget sonar={data.sonarInfo.projectConditions} codeSmell={codeSmell} />}
          {data && (
            <JiraWidget
              jiraResult={data.jiraInfo.jiraResult}
              jiraDomain={data.jiraInfo.jiraDomain}
            />
          )}
        </Box>
        <Box display={'flex'} flexDirection={'column'} gap={5} mx={'auto'}>
          {data && (
            <TodoDisplay
              todos={data.todoList.pm}
              projectName={projectName}
              notification={isNotification}
              emailList={data.emailList}
              todoTeam='pm'
            />
          )}
          {data && (
            <TodoDisplay
              todos={data.todoList.dev}
              projectName={projectName}
              notification={isNotification}
              emailList={data.emailList}
              todoTeam='dev'
            />
          )}
          {data && (
            <TodoDisplay
              todos={data.todoList.qa}
              projectName={projectName}
              notification={isNotification}
              emailList={data.emailList}
              todoTeam='qa'
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectPage;
