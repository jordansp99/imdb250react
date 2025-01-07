import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Box, Container, Typography, List, ListItem, ListItemText } from '@mui/material';

function Form() {
    const films = [
        { label: 'The Godfather', id: 1 },
        { label: 'Pulp Fiction', id: 2 },
    ];
        const clues = ['Item 1', 'Item 2', 'Item 3', 'Item 4','item 5'];
    return (
        <>
        <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Card variant="outlined" sx={{ width: 500, p: 2 }}>
        <List>
            {clues.map((clue, index) => (
        <ListItem key={index}>
          <ListItemText primary={`${index + 1}. ${clue}`} />
        </ListItem>
      ))}
        </List>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt:2 }}>
                <Autocomplete
                    disablePortal
                    options={films}
                    sx={{ flexGrow: 1 }}
                    renderInput={(params) => <TextField {...params} label="Movie" />}
                />
                <Button className="submit-btn" variant='contained'>Submit</Button>
            </Box>
        </Card>
      </Container>
      </>
    );
}

export default Form;