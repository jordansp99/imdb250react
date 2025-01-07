import React from 'react';
import Form from './Form';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { yellow } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo( //prevents unnecesary rerenders
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light', // Set mode based on user preference
          ...(prefersDarkMode // Conditional palette settings
            ? {
                // palette values for dark mode
                primary: yellow,
                background: {
                  default: '#121212', // Dark background
                  paper: '#1e1e1e', // Darker background for paper elements
                },
                text: {
                  primary: '#fff', // White text
                  secondary: '#aaa', // Slightly lighter text
                },
              }
            : {
                // palette values for light mode
                primary: yellow,
                background: {
                  default: '#fff', // White background
                  paper: '#fff',
                },
                text: {
                  primary: '#000', // Black text
                  secondary: '#777',
                },
              }),
        },
        typography: {
          fontFamily: 'Roboto, sans-serif',
          h1: {
            fontWeight: 500,
          },
          body1: {
            fontSize: '1rem',
          },
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Form />
    </ThemeProvider>
  );
}

export default App;