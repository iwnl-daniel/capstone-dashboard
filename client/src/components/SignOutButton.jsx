import Button from '@mui/material/Button';
// 1. import useMsal to get hook on app instance
import {useMsal} from '@azure/msal-react';
import { Typography } from '@mui/material';

export const SignOutButton = () => {
    // get the app instance
    const {instance} = useMsal();

    // declare method to handle signing out
    const handleSignOut = () => {
        // call logoutRedirect API using parameters to customize the process. same with loginRedirect. or default blank.
        instance.logoutPopup(handleSignOut);
    }

    return (
        <Typography color="inherit" onClick = {handleSignOut}>Sign out</Typography>
    )
};
