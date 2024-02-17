import { Box, Divider, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import BugReportIcon from '@mui/icons-material/BugReport';
/**
 * SonarWidget - Displays the Sonar information passed as a prop from CreateProject, including code smells.
 * @param {Array.<{metricKey: String, metricStatus: String}>} sonar - An array of Sonar object(s).
 * @returns {JSX.Element} The rendered SonarWidget component.
 */
const SonarWidget = ({ sonar, codeSmell }) => {
  return (
    <Box mt={'25px'} p={'20px'} border={2} borderColor={'#104E8D'} borderRadius={2}>
      <Typography fontSize='1rem' fontWeight='bold' textAlign={'start'}>
        Sonar
      </Typography>
      <Divider color={'#104E8D'} sx={{ borderBottomWidth: 2 }} />
      <Box display={'flex'}>
        <Box
          display={'flex'}
          flexDirection={'column'}
          mr={5}
          pt={'10px'}
          gap={'10px'}
          textAlign={'start'}
        >
          {sonar.map((metric, key) =>
            metric.metricStatus === 'OK' ? (
              <Box key={key}>
                <Typography fontSize='0.85rem' fontWeight='bold'>
                  {metric.metricKey}
                </Typography>

                <CheckCircleOutlineIcon color='success' />
              </Box>
            ) : (
              <Box key={key}>
                <Typography fontSize='0.85rem' fontWeight='bold'>
                  {metric.metricKey}
                </Typography>

                <HighlightOffIcon color='error' />
              </Box>
            )
          )}
        </Box>
        {codeSmell && (
          <Box display={'flex'} flexDirection={'column'} pt={'10px'} gap={'5px'}>
            {codeSmell.issues.map((issue, key) => (
              <Box key={key}>
                <Box display={'flex'}>
                  <BugReportIcon fontSize='small' color='success' />
                  <Typography fontSize='0.85rem' fontWeight='bold' lineHeight={1.8}>
                    {issue.type}
                  </Typography>
                </Box>

                <Typography fontSize='0.85rem'>
                  <strong>Message:</strong> {issue.message}
                </Typography>
                <Typography fontSize='0.85rem'>
                  <strong>Rule:</strong> {issue.rule}
                </Typography>
                <Typography fontSize='0.85rem'>
                  <strong>Severity:</strong> {issue.severity}
                </Typography>
                <Typography fontSize='0.85rem'>
                  <strong>Status:</strong> {issue.status}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SonarWidget;
