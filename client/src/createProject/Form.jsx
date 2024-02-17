import { Box, Button, TextField } from '@mui/material';
import * as yup from 'yup';
import axios from 'axios';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';

// /* Yup Schema validation and initial values for react hook form*/
const projectSchema = yup
  .object()
  .shape({
    projectName: yup.string().required('Project name is required'),
    jiraQuery: yup.array().of(
      yup.object({
        url: yup.string().required('Required.'),
      })
    ),
    gitlabQuery: yup.array().of(
      yup.object({
        url: yup.string().url().required('Required.'),
      })
    ),
    sonarQuery: yup.array().of(
      yup.object({
        url: yup.string().url().required('Required.'),
      })
    ),
    emailList: yup.array().of(
      yup.object({
        mail: yup.string().email('Must be a valid email'), //.required('Required'),
      })
    ),
  })
  .test({
    name: 'form validation',
    test: (parent, { createError }) => {
      if (
        parent.jiraQuery.length === 0 &&
        parent.gitlabQuery.length === 0 &&
        parent.sonarQuery.length === 0
      ) {
        return createError({
          path: 'projectName',
          message: 'Please add one query to create a project.',
        });
      } else {
        return true;
      }
    },
  });

/**
 * Form - Uses Yup validation and React-Hook-Forms to create a form for new projects.
 * The form must have a valid Jira, Gitlab, and Sonar link. Additional emails can be added to the
 * project to automatically subscribe users to the project.
 * If an invalid link is supplied, a pop up with a warning will be supplied.
 * @returns {JSX.Element} The rendered Form component.
 */
const Form = () => {
  /**
   * Represents whether the Jira string is valid from the server
   * @type {boolean}
   */
  const [isJiraStatus, setIsJiraStatus] = useState(false);
  /**
   * Represents whether the Gitlab string is valid from the server
   * @type {boolean}
   */
  const [isGitLabStatus, setIsGitLabStatus] = useState(false);
  /**
   * Represents whether the Sonar string is valid from the server
   * @type {boolean}
   */
  const [isSonarStatus, setIsSonarStatus] = useState(false);
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
   * Instance of useNavigate from react-router-dom
   * @type {object}
   */
  const navigate = useNavigate();

  /* REACT HOOK FORM */
  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(projectSchema),
    defaultValues: {
      projectName: '',
      jiraQuery: [{ url: '' }],
      gitlabQuery: [{ url: '' }],
      sonarQuery: [{ url: '' }],
      emailList: [],
    },
  });

  /* useFieldArray's for REACT HOOK FORM */
  const { fields: jiraFields } = useFieldArray({
    control,
    name: 'jiraQuery',
  });

  const { fields: gitlabFields } = useFieldArray({
    control,
    name: 'gitlabQuery',
  });

  const { fields: sonarFields } = useFieldArray({
    control,
    name: 'sonarQuery',
  });

  const {
    fields: emailFields,
    append: emailAppend,
    remove: emailRemove,
  } = useFieldArray({
    control,
    name: 'emailList',
  });

  /**
   * @async
   * @function handleFormSubmit
   * @param {Object} data from the form
   * @returns {Promise<Object>} The data from the URL.
   */
  const handleFormSubmit = async (data) => {
    try {
      /* CREATE EMAIL ARRAY OF USER OBJECT EMAILS */

      /**@type {string} */
      let emailListString = '';
      /**@type {number} */
      let current = 1;
      /**@type {array} */
      data.emailList.map((email) => {
        if (Object.values(email)[0] !== '') {
          if (current !== data.emailList.length) {
            emailListString += `${Object.values(email)[0]},`;
          } else {
            emailListString += `${Object.values(email)[0]}`;
          }
        }
        current = current + 1;
      });

      if (emailListString.length === 0) {
        emailListString = undefined;
      }

      /* RESET STATUS FOR ALL STATES */
      setIsJiraStatus((current) => (current ? !current : current));
      setIsGitLabStatus((current) => (current ? !current : current));
      setIsSonarStatus((current) => (current ? !current : current));

      /**
       * Send POST to server for validation
       * @async
       * @returns {Promise<Object>} The data from the URL.
       */
      const response = await axios.post(
        'http://localhost:3001/user/config',
        {
          headers: { 'Content-Type': 'application/json' },
        },
        {
          params: {
            email: user,
            emailList: emailListString,
            projectName: data.projectName,
            jiraLink: data.jiraQuery.length > 0 ? data.jiraQuery[0].url : '',
            gitlabLink: data.gitlabQuery.length > 0 ? data.gitlabQuery[0].url : '',
            sonarLink: data.sonarQuery.length > 0 ? data.sonarQuery[0].url : '',
          },
        }
      );

      /* VALID RESPONSE AND NAVIGATE TO DASHBOARD */
      if (response.data.serviceStatus[0].status === 'OK') {
        /* RESETTING THE FORM IS MOVED HERE TO DEAL WITH THE POP-UP ERROR MESSAGE */
        reset({
          projectName: '',
          jiraQuery: [{ url: '' }],
          gitlabQuery: [{ url: '' }],
          sonarQuery: [{ url: '' }],
          emailList: [],
        });
        navigate('/');
      } else {
        /* ERROR, THERE IS AN INVALID LINK */
        /**@type {string} */
        let message = '';

        /**
         * Cycles threw the response status to find the error
         * @type {array}
         */
        response.data.serviceStatus.map((element) => {
          /* MESSAGE MIGHT BE THE WAY WE DO THE ERROR CHECK FROM THE BACK END RESPONSE */
          message += `${element.service} ${element.status} ${element.msg} \n`;
          /* SET STATUS TO TRUE IF WE HAVE A FAILED QUERY */
          if (element.status === 'FAIL') {
            if (element.service === 'Jira') {
              setIsJiraStatus((current) => !current);
            } else if (element.service === 'Gitlab') {
              setIsGitLabStatus((current) => !current);
            } else if (element.service === 'Sonar') {
              setIsSonarStatus((current) => !current);
            }
          }
        });

        window.alert(message);
      }
    } catch (error) {
      /**@throws {error} */
      console.error('Error: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Box display='flex' flexDirection='column' rowGap='20px' p='2rem'>
        <Controller
          name='projectName'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id='outlined-basic'
              variant='outlined'
              label='project name'
              size='small'
              color='inputOutLine'
              onChange={field.onChange}
              error={!!errors?.projectName}
              helperText={errors.projectName && errors.projectName.message}
            />
          )}
        />

        {jiraFields.map((field, index) => {
          return (
            <Box
              key={field.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Controller
                name={`jiraQuery.${index}.url`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size='small'
                    id='outlined-basic'
                    color='inputOutLine'
                    label={`Jira Query URL - ${index + 1}`}
                    error={!!errors?.jiraQuery}
                    helperText={errors.jiraQuery && `Jira Query Required`}
                  />
                )}
              />
            </Box>
          );
        })}

        {gitlabFields.map((field, index) => {
          return (
            <Box
              key={field.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Controller
                control={control}
                name={`gitlabQuery.${index}.url`}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size='small'
                    id='outlined-basic'
                    color='inputOutLine'
                    label={`Gitlab Query URL - ${index + 1}`}
                    error={!!errors?.gitlabQuery}
                    helperText={errors.gitlabQuery && `Gitlab Query Required`}
                  />
                )}
              />
            </Box>
          );
        })}

        {sonarFields.map((field, index) => {
          return (
            <Box
              key={field.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Controller
                control={control}
                name={`sonarQuery.${index}.url`}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size='small'
                    id='outlined-basic'
                    color='inputOutLine'
                    label={`Sonar Query URL - ${index + 1}`}
                    error={!!errors?.sonarQuery}
                    helperText={
                      errors.sonarQuery &&
                      //`Sonar Query Required`
                      errors.sonarQuery.message
                    }
                  />
                )}
              />
            </Box>
          );
        })}

        {emailFields.map((field, index) => {
          return (
            <Box
              key={field.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Controller
                control={control}
                defaultValue={''}
                name={`emailList.${index}.mail`}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size='small'
                    id='outlined-basic'
                    color='inputOutLine'
                    label={`User email - ${index + 1}`}
                    error={!!errors?.emailList}
                    helperText={errors.emailList && 'Enter valid email address'}
                  />
                )}
              />
              <Button
                variant='contained'
                color='buttonBlue'
                size='large'
                sx={{
                  height: '40px',
                  ml: '10px',
                  '&:hover': {
                    backgroundColor: '#cdecfa',
                    color: '#016591',
                  },
                }}
                onClick={() => {
                  emailRemove({ index });
                }}
              >
                Delete
              </Button>
            </Box>
          );
        })}
        <Button
          variant='contained'
          color='buttonBlue'
          fullWidth
          sx={{
            '&:hover': {
              backgroundColor: '#cdecfa',
              color: '#016591',
            },
          }}
          onClick={() => {
            trigger('projectName');
            emailAppend({ mail: '' });
          }}
        >
          Add user email
        </Button>
        <Box>
          <Button
            type='submit'
            variant='contained'
            color='buttonBlue'
            sx={{
              p: '5px 20px',
              border: '1px solid rgba(25, 118, 210, 0.5)',
              '&:hover': {
                backgroundColor: '#cdecfa',
                color: '#016591',
              },
            }}
          >
            SUBMIT
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default Form;
