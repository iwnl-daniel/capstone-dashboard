import { Box, Typography } from '@mui/material';
import Form from './Form.jsx';

/**
 * CreateProject - Display a form to created a new project.
 * @returns {JSX.Element} The rendered CreateProject component that also contains the Form component.
 */
const CreateProject = () => {
  return (
    <Box m='auto' width='100%'>
      <Box
        backgroundColor='#FFFFFF'
        p='1rem '
        m='2rem auto'
        borderRadius='1.5rem'
        textAlign='center'
        width='60%'
        border={2}
        borderColor={'#104E8D'}
        boxShadow={3}
      >
        <Typography fontWeight='500' variant='h4' color='black' p='2rem'>
          Create Project
        </Typography>

        <Form />
      </Box>
    </Box>
  );
};

export default CreateProject;
