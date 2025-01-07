import React from 'react';
import Form from './Form';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline'; // Import CssBaseline

const theme = createTheme({
  palette: {
    primary: {
      main: deepPurple[500],
    },
    secondary: {
      main: deepPurple[100],
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Set your desired font family
    // Example of customizing other typography variants
    h1: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem', // Example font size
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline should be inside the ThemeProvider */}
      <CssBaseline /> 
      <Form />
    </ThemeProvider>
  );
}

export default App;