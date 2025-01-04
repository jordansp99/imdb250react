import React from 'react';
import Form from './Form'; // Correct import
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Import ThemeProvider
import { red, blue, yellow } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#003049', 
    },
    secondary: {
      main: blue[500], 
    },
  },
});

function App() {
  return (
    <>
    <ThemeProvider theme={theme}>
      <Form />
    </ThemeProvider>
    </>
  );
}

export default App;