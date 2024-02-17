import Grid from '@mui/material/Grid';
import { Route, Routes } from 'react-router-dom';
import { PageLayout } from './components/PageLayout';
import CreateProject from './createProject/index';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import ProjectPage from './projectPage/index.jsx';
import { MsalProvider, useIsAuthenticated } from '@azure/msal-react';
import AllProjects from './ListOfProjects/AllProjects';
import Dashboard from './ListOfProjects/Homedash';
import NotFound from './pages/NotFound';

/**
 * App controls the application authentication and routing for various pages featureing protected routes.
 * @param {instance} msalInstanceSSO msalInstanceSSO is the parameter handed to the application to check authentication statuses of the current session.
 * @returns {components} App returns the components including the identity provider in this case Microsoft, the page layout, and grids. 
 */
function App({ msalInstanceSSO }) {
  return (
    <MsalProvider instance={msalInstanceSSO}>
      <PageLayout>
        <Grid container justifyContent='center'>
          <Pages />
        </Grid>
      </PageLayout>
    </MsalProvider>
  );
}
/**
 * Pages - defines the various pages in the application to perform various tasks.
 * @var {*} isAuth isAuth variable fetches the current authentication status for protecting routes. If user is signed in page access is granted, if not signed in access is redirected.
 * @returns {Routes} returns the routes available in the page and accessiable based on the authentication status.
 */
const Pages = () => {
  const isAuth = useIsAuthenticated();
  return (
    <Routes>
      <Route path='*' element={<NotFound />} />
      {/* Protected Route Homepage*/}
      {isAuth ? <Route path='/' element={<Dashboard />} /> : <Route path='/' element={<Home />} />}
      {/* Protected Route */}
      {isAuth ? (
        <Route path='/profile' element={<Profile />} />
      ) : (
        <Route path='/profile' element={<Home />} />
      )}

      {isAuth ? (
        <Route path='/createProject' element={<CreateProject />} />
      ) : (
        <Route path='/createProject' element={<Home />} />
      )}

      {isAuth ? (
        <Route path='/allProjects' element={<AllProjects />} />
      ) : (
        <Route path='/allProjects' element={<Home />} />
      )}

      {isAuth ? (
        <Route path='/:projectName' element={<ProjectPage />} />
      ) : (
        <Route path='/:projectName' element={<Home />} />
      )}
    </Routes>
  );
};

export default App;
