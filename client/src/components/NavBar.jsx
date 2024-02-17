import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { WelcomeName } from './WelcomeName.jsx';
import { SignInButton } from './SignInButton.jsx';
import { SignOutButton } from './SignOutButton.jsx';
import { Link as RouterLink } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AssignmentIcon from '@mui/icons-material/Assignment';

// import hooks for conditionally rendering things depending on authentication.
import { useIsAuthenticated } from '@azure/msal-react';
const pages = [''];

function RAppBar() {
  const isAuthenticated = useIsAuthenticated();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <AppBar
      position='static'
      color='primary'
      sx={{
        boxShadow: '0px 0px 0px white',
        borderBottom: '1px solid #aaa;',
      }}
    >
      <Container width='100%'>
        <Toolbar disableGutters>
          <Avatar
            component={RouterLink}
            to='/'
            sx={{
              display: {
                xs: 'none',
                md: 'flex',
                width: 150,
                height: 45,
              },
              mr: 1,
            }}
            variant='square'
            src='https://www.igrafx.com/wp-content/themes/igrafx/images/logo.svg'
          />
          <Typography
            variant='h6'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          ></Typography>
          <Box
            sx={{ width: '100px', textAlign: 'left', display: { xs: 'none', md: 'flex' } }}
            color='links'
          >
            <Typography sx={{ wordWrap: 'break-word' }}> Release Dashboard</Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign='center'>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Avatar
            component={RouterLink}
            to='/'
            sx={{
              display: {
                xs: 'flex',
                md: 'none',
                width: 150,
                height: 45,
              },
              mr: 1,
            }}
            variant='square'
            src='https://www.igrafx.com/wp-content/themes/igrafx/images/logo.svg'
          />
          <Typography
            variant='h5'
            noWrap
            component='a'
            href=''
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          ></Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: {
                xs: 'none',
                md: 'flex',
              },
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {isAuthenticated ? <WelcomeName /> : null}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <Tooltip title='Open settings'>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt='Default Profile'>
                    {' '}
                    <AssignmentIcon />{' '}
                  </Avatar>
                </IconButton>
              </Tooltip>
            ) : (
              <SignInButton />
            )}
            {isAuthenticated ? (
              <Menu
                sx={{ mt: '45px' }}
                id='menu-appbar'
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem>
                  {' '}
                  <Typography
                    sx={{ textDecoration: 'inherit', color: 'inherit' }}
                    component={RouterLink}
                    to='/profile'
                  >
                    {' '}
                    Account{' '}
                  </Typography>{' '}
                </MenuItem>
                <MenuItem>
                  {' '}
                  <SignOutButton />{' '}
                </MenuItem>
                {/* <MenuItem> <Typography onClick={SignOutButton.handleSignOut}> Sign Out </Typography></MenuItem> */}
              </Menu>
            ) : null}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default RAppBar;

/*
const NavBar = () => {
    // 1. define a variable to tell us if the user is authenticated or not.
    // 2. add code simialr to lines 25, 27 for conditionally rendering depending on auth variable.
    const isAuthenticated = useIsAuthenticated();
    return (
        <div sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography sx={{ flexGrow: 1 }}>
                        <Link component={RouterLink} to="/" color="inherit" variant="h6">Home</Link>
                    </Typography>
                    {isAuthenticated ? <WelcomeName /> : null}
                    <Button component={RouterLink} to="/profile" color="inherit">Profile</Button>
                    <Button component={RouterLink} to="/profile" color="inherit">Profile</Button>
                    {isAuthenticated ? <SignOutButton /> : <SignInButton />}
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default NavBar;
*/
