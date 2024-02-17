import { Box, Divider, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

/**
 * GitlabWidget - Displays the information of a gitlab branch passed as a prop from CreateProject.
 * @param {String} branchName - branch name for the giitlab branch
 * @param {Array.<{id: Number, ref: String, pipelineStatus: String, pipelineLink: String}>} pipeline - An array of pipeline object(s)
 * @returns  {JSX.Element} The rendered GitlabWidget component.
 */
const GitlabWidget = ({ branchName, pipeline }) => {
  return (
    <Box mt={'25px'} p={'20px'} border={2} borderColor={'#104E8D'} borderRadius={2}>
      <Typography fontSize='1rem' fontWeight='bold' textAlign={'start'}>
        Gitlab
      </Typography>
      <Divider color={'#104E8D'} sx={{ borderBottomWidth: 2 }} />
      <Box
        display={'flex'}
        flexWrap={'wrap'}
        alignContent={'space-evenly'}
        gap={'10px'}
        pt={'10px'}
      >
        <Box>
          <Typography fontSize='0.85rem' fontWeight='bold'>
            Branch
          </Typography>
          <Typography fontSize='0.80rem'>{branchName}</Typography>
        </Box>
        {pipeline.map((status, key) =>
          status.pipelineStatus === 'success' ? (
            <Box key={key}>
              <Typography fontSize='0.85rem' fontWeight='bold'>
                Pipeline 1
              </Typography>
              <CheckCircleOutlineIcon color='success' />
            </Box>
          ) : (
            <Box key={key}>
              <Typography fontSize='0.85rem' fontWeight='bold'>
                Pipeline 2
              </Typography>
              <HighlightOffIcon color='error' />
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

export default GitlabWidget;
