import Typography from '@mui/material/Typography';
// import Dashboard from "../test/Dashboard_Test"
// 1. import template for authenticated and non-authenticated users.
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import Dashboard from '../ListOfProjects/Homedash.jsx';

// 2. Insert the tags and customize the appearance to suit needs based on auth status.
export const Home = () => {
  return (
    <>
      <AuthenticatedTemplate>
        <Typography variant='h6'>
          Authentication Successful!
        </Typography>
        <Dashboard />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Typography variant='h6'>
          Please sign-in to see your profile information.
        </Typography>
      </UnauthenticatedTemplate>
    </>
  );
};
