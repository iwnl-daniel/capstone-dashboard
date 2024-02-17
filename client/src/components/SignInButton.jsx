import Button from '@mui/material/Button';

import { useMsal } from '@azure/msal-react';

export const SignInButton = () => {
    const {instance} = useMsal();

    const handleSignIn = () => {
        instance.loginRedirect({
            // options provided, here scopes set to user.read to consent to azure sign on and get access-token
           scopes: ['user.read']
        })
    }
    return (
        <Button color="inherit" onClick={handleSignIn}>Sign in</Button>
    )
};