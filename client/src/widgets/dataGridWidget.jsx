import { Box, Link } from '@mui/material';
import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

/**
 * JiraGrid - displays all the tickets from a specific Jira query that are unfinished
 * @param {Array.<{Key: String, Summary: String, Status: String, Updated: String}>} data - An array of objects that contain information about unfinished Jira tickets
 * @param {Strnig} jiraDomain - A string that contains the projects Jira domain to create a link
 * @returns  {JSX.Element} The rendered JiraGrid component.
 */
const JiraGrid = ({ data, jiraDomain }) => {
  /**
   * Prop data used to display the DataGrid
   * @type {Array}
   */
  const [gridData, setGridData] = useState(data);

  /**
   * Contains the information to build the columns for the DataGrid component
   * @type {Array.<Object>}
   */
  const columns = [
    {
      field: 'Key',
      headerName: 'Ticket',
      renderCell: (params) => (
        <Link
          underline='hover'
          color='inputOutLine'
          rel='noopener'
          href={`${jiraDomain}/browse/${params.value}`}
          sx={{ borderColor: '#104E8D' }}
          borderColor={'#104E8D'}
        >
          {params.value}
        </Link>
      ),
    },
    { field: 'Summary', headerName: 'Summary', width: 300 },

    { field: 'Updated', headerName: 'Updated', width: 250 },
  ];

  return (
    <Box display={'flex'} mt={'20px'} height={'500px'} width={'100%'}>
      <DataGrid
        rows={gridData}
        columns={columns}
        getRowId={(row) => row.Key}
        pageSize={12}
        sx={{
          border: 2,
          borderColor: '#104E8D',
          boxSizing: 'border-box',

          '& .MuiDataGrid-row:hover': {
            color: '#104E8D',
          },
          '&>.MuiDataGrid-main': {
            '&>.MuiDataGrid-columnHeaders': {
              borderBottom: 2,
              borderColor: '#104E8D',
            },

            '& div div div div >.MuiDataGrid-cell': {
              borderBottom: 2,
              borderColor: '#104E8D',
            },
          },
        }}
      />
    </Box>
  );
};

export default JiraGrid;
