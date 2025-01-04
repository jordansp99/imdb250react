import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField'; // Import TextField
import { Button } from '@mui/material';
import Card from '@mui/material/Card';

import './Form.css'

function Form() {
    const films = [
        { label: 'The Godfather', id: 1 },
        { label: 'Pulp Fiction', id: 2 },
    ];
    return (
        <form>
            <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 2 }}> {/* Use Flexbox on the Card */}                <Autocomplete
                    disablePortal
                    options={films}
                    sx={{ width: 300, p:3}}
                    renderInput={(params) => <TextField {...params} label="Movie" />}
                />
                <Button className="submit-btn" variant='contained'> Submit</Button>
            </Card>
        </form>
    );
}

export default Form;