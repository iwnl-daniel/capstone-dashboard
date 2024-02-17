import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
export const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#0309b1',
    },
    links: {
      main: '#051653',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
    todoButtonsBg: {
      main: '#0400B9',
    },
    todoButtonsfont: {
      main: '#FFFFFF',
    },
    todoCheckboxColor: {
      main: '#57CE44',
    },
    inputOutLine: {
      main: '#000000',
    },
    buttonBlue: {
      main: '#104E8D',
      contrastText: 'white',
    },
  },
});
