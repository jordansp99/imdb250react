import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField'; // Import TextField
import { Button } from '@mui/material';
import Box from '@mui/material/Box';

function Form() {
    const films = [
        { label: 'The Godfather', id: 1 },
        { label: 'Pulp Fiction', id: 2 },
    ];
    return (
        <form>
            <Box sx={{ p: 10, border: '1px dashed grey' }}>
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