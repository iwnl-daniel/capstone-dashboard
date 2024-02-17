import { useMsal } from '@azure/msal-react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

/**
 * ProjectTable - Display all projects located in the database.
 * - Projects that were created by a current logged-in user give the user the choice to delete the project.
 * - Users have the option to subscribe / unsubscribe to a project by selecting the toggle on or off.
 * - Users can use the search bar to search by partial project name matches
 * @returns Project page display
 */
const ProjectTable = () => {
  /**
   * Information on every project in the database
   * @type {Array.<Object>}
   */
  const [checked, setChecked] = useState([]);
  /**
   * Information on every project in the database
   * @type {Array.<Object>}
   */
  const [data, setData] = useState([]);
  /**
   * Value to toggle delete modal
   * @type {boolean}
   */
  const [open, setOpen] = useState(false);
  /**
   * Projects name
   * @type {string}
   */
  const [name, setName] = useState(null);
  /**
   * Input for search
   * @type {string}
   */
  const [searchTerm, setSearchTerm] = useState('');

  const { instance } = useMsal();
  const user = instance.getActiveAccount()?.username;

  /**
   * @type {Array.<Object>}
   */
  let listToDisplay = checked;
  const navigate = useNavigate();

  /**@function
   * @name handleOpen*/
  const handleOpen = (projectName) => {
    setName(projectName);
    setOpen(true);
  };

  /**@function
   * @name handleClose
   */
  const handleClose = () => {
    setName(null);
    setOpen(false);
  };

  /**
   * Post to the backend to delete a project
   * @async
   * @function handleDeletion
   * @return {Promise<string>} The data from the URL.
   */
  const handleDeletion = async () => {
    try {
      /**@type {string} */
      const url = `http://127.0.0.1:3001/user/delete/project?projectName=${name}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok === true) {
        const removeProject = data.filter((project) => project.projectName !== name);
        setData((current) => [...removeProject]);
        setChecked((current) => [...removeProject]);
        setName(null);
        setOpen(false);
      }
    } catch (err) {
      /**@throws {error} */
      console.log(err);
    }
  };

  /**@type {object} */
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    borderRadius: 1,
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'background.paper',
    border: '1px solid #104E8D',
    boxShadow: 2,
    p: 4,
  };

  /**
   *
   * @async
   * @function toggle
   * @return {Promise<string>} The data from the URL.
   * */
  const toggle = async (index, projectName) => {
    /**@type {object} */
    let newData = listToDisplay;
    /**@type {array} */
    let upDatedList = [];
    /**@type {array} */
    let newEmailList = newData[index].emailList;

    /* Check if the logged in user is on the selected email list for the selected project. 
    Remove the user if they are on the email list, otherwise add them to the list*/
    if (Object.values(newData[index].emailList).includes(user)) {
      upDatedList = newData[index].emailList.filter((current) => {
        if (current !== user) {
          return current;
        }
      });

      newData[index].emailList = upDatedList;
    } else {
      newEmailList.push(user);
      newData[index].emailList = newEmailList;
    }

    setData((current) => [...newData]);

    /* Update the backend */
    /**@type {object} */
    const options = {
      method: 'POST',
    };
    /**@type {string} */
    const url = `http://127.0.0.1:3001/project/toggle/user?projectName=${projectName}&userEmail=${user}`;
    try {
      const response = await fetch(url, options);
      const json = await response.json();

      if (json.response !== 'User already exist') {
        setChecked((current) => [...current]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (searchTerm !== '') {
    listToDisplay = checked.filter((project) =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  useEffect(() => {
    /**
     * Fetches all the projects
     * @async
     * @function fetchProjects
     *@return {Promise<string>} The data from the URL.
     */
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3001/projects');
        const ddata = await response.json();
        let front = [];
        let end = [];
        ddata.map((creator) => {
          if (creator.projectCreator === user) {
            front.push(creator);
          } else {
            end.push(creator);
          }
        });
        const filteredProjects = front.concat(end);
        setData(filteredProjects);
        setChecked(filteredProjects);
      } catch (error) {
        /**@throws {error} */
        console.error(error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Box
      sx={{ width: 1 }}
      justifyContent='center'
      alignItems='flex-start'
      gap={2}
      data-testid='project-table'
    >
      <Box sx={{ width: 1 }} justifyContent='center' alignItems='flex-start'>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
          <Button
            variant='contained'
            color='buttonBlue'
            sx={{
              ml: '5%',
              width: '136px',
              height: '50px',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#cdecfa',
                color: '#016591',
              },
            }}
            onClick={() => navigate('/')}
          >
            My projects
          </Button>
          {/*Search bar implementation */}
          <Box>
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
              {/* <input type="text" value={searchTerm} onChange={handleChange} /> */}
              <TextField
                color='inputOutLine'
                placeholder='Enter Project Name...'
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                value={searchTerm}
                sx={{ height: '30px', width: '300px', fontSize: '16px' }}
              ></TextField>
            </Box>
          </Box>

          <Button
            variant='contained'
            color='buttonBlue'
            sx={{
              mr: '5%',
              width: '136px',
              height: '50px',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#cdecfa',
                color: '#016591',
              },
            }}
            onClick={() => navigate('/createProject')}
          >
            + New
          </Button>
        </Box>

        <Box mt={'40px'}>
          <Box sx={{ width: 1 }}>
            <Typography variant='h5' sx={{ float: 'left', marginLeft: '6%' }}>
              Project Name:
            </Typography>
            <Typography variant='h5' sx={{ float: 'right', marginRight: '5%' }}>
              Subscribe
            </Typography>
          </Box>
          <List dense sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
            {listToDisplay.map((item, index) => {
              const labelId = `project-list-${index}`;
              return (
                <Box key={index}>
                  <ListItem
                    sx={{
                      m: '5px',
                      bgcolor: '#e8eaed',
                      borderRadius: '5px',
                    }}
                    key={index}
                  >
                    <ListItemButton href={`/${item.projectName}`} sx={{ pl: 0, maxWidth: '40%' }}>
                      <ListItemText
                        primaryTypographyProps={{ fontSize: '20px' }}
                        id={labelId}
                        primary={item.projectName}
                      />
                    </ListItemButton>
                    <Box ml='auto'>
                      {item.projectCreator === user ? (
                        <Switch
                          color='secondary'
                          edge='end'
                          onClick={(event) => toggle(index, item.projectName)}
                          checked={listToDisplay[index]?.emailList.includes(user)}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      ) : (
                        <Switch
                          color='secondary'
                          edge='end'
                          onClick={(event) => toggle(index, item.projectName)}
                          checked={listToDisplay[index]?.emailList.includes(user)}
                          inputProps={{ 'aria-labelledby': labelId }}
                          sx={{ mr: '34px' }}
                        />
                      )}
                      {item.projectCreator === user && (
                        <>
                          <IconButton
                            variant='contained'
                            color='buttonBlue'
                            size='small'
                            aria-label='delete'
                            sx={{
                              ml: 1,
                              '&:hover': {
                                backgroundColor: '#cdecfa',
                                color: '#016591',
                              },
                            }}
                            onClick={(e) => handleOpen(item.projectName)}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby='modal-modal-title'
                            aria-describedby='modal-modal-description'
                            sx={{
                              '& .MuiBackdrop-root': {
                                backgroundColor: 'transparent',
                              },
                            }}
                          >
                            <Box sx={style}>
                              <Typography id='modal-modal-title' variant='h6' component='h2'>
                                Project: {name}
                              </Typography>
                              <Typography id='modal-modal-description' sx={{ my: 1 }}>
                                Delete project?
                              </Typography>

                              <Button
                                variant='contained'
                                color='buttonBlue'
                                sx={{
                                  minWidth: '120px',
                                  mr: 2,
                                  '&:hover': {
                                    backgroundColor: '#cdecfa',
                                    color: '#016591',
                                  },
                                }}
                                startIcon={<DeleteIcon />}
                                onClick={handleDeletion}
                              >
                                delete
                              </Button>
                              <Button
                                variant='contained'
                                color='buttonBlue'
                                onClick={handleClose}
                                sx={{ minWidth: '120px' }}
                              >
                                CANCEL
                              </Button>
                            </Box>
                          </Modal>
                        </>
                      )}
                    </Box>
                  </ListItem>
                </Box>
              );
            })}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectTable;
