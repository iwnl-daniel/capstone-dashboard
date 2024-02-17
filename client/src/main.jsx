import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './styles/theme.js';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';

// Import the class needed for enabling single sign on.
import { EventType, PublicClientApplication } from '@azure/msal-browser';

// Declare instance of the class imported providing: clientId, authority, redirectUrl
/**
 * pca - public client application is a defined instance for logging into the application as a seperate page redirecting to microsoft login.
 */
const pca = new PublicClientApplication({
  auth: {
    clientId: '1f2aec4e-3b5d-4a9b-84ac-63c87acc55f8',
    authority: 'https://login.microsoftonline.com/6a5c6139-478c-4c0e-b5f7-d41a42102750',
    redirectUri: '/',
  },
});
// MSAL JS EVENT (GLOBAL)
pca.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS) {
    console.log(event);
    pca.setActiveAccount(event.payload.account);
  }
});
// If MSAL Events are registered in individual components you MUST unregister when event ends.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CssBaseline />
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App msalInstanceSSO={pca} />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
