import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField'; // Import TextField
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import './App.css';

function Form() {
    const films = [
        { label: 'The Godfather', id: 1 },
        { label: 'Pulp Fiction', id: 2 },
    ];
    return (
        <form className="form-container">
            <Box sx={{ p: 2, border: '1px dashed grey' }}>
                <Autocomplete
                    disablePortal
                    options={films}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Movie" />}
                />
                <Button className="submit-btn" variant='contained'> Submit</Button>
            </Box>
        </form>
    );
}

export default Form;