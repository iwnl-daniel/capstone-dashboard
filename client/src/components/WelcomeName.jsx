import Typography from "@mui/material/Typography";
import {useMsal} from "@azure/msal-react";
// Import useState and Effect from msal react;
import {useState, useEffect} from "react";

/**
 * Welcome name to be displayed on the NavBar
 * @component
 * @returns {React.Element} Compenent with Value of currAccount.name from SSO
 */

export const WelcomeName = () => {
    // set hooks to get access to the app instance
    const { instance } = useMsal();
    // declare userName variables for the WelcomeName component. 
    const [name, setName] =  useState('');

    useEffect(() => {
        // declare a state variable setting it the the API results of getActiveAccount.
        const currAccount = instance.getActiveAccount();
        // Conditional branch to check if we have a account. 
        if(currAccount) {
            // set username.
            setName(currAccount.name)
        }
    }, [instance]);
    return <Typography variant="h6" sx={{marginRight: '5px'}}>Welcome, {name.toUpperCase()}</Typography>;
};