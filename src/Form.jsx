import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Box, Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import filmsData from './clues.json'; // Import the JSON data

function Form() {

    // Function to get the index of the film based on date
    const getFilmIndexByDate = () => {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        return dayOfYear % filmsData.length;
    };

    const todaysFilmIndex = getFilmIndexByDate();
    const todaysFilm = filmsData[todaysFilmIndex];

    // Process the films data to extract labels and IDs
    const films = filmsData.map((film, index) => ({
        label: film['Film Name'],
        id: index + 1, // Ensure IDs are unique and start from 1
    }));

    // Function to extract clues from the JSON
    const getClues = (filmName) => {
        const selectedFilm = filmsData.find(film => film['Film Name'] === filmName);
        if (selectedFilm) {
            const clueText = selectedFilm.Clue;
            const clueLines = clueText.split('\n').filter(line => line.trim() !== '').slice(1); // Split into lines and remove the intro line
            return clueLines.map(line => line.replace(/^\d+\.\s*/, '').trim())// Remove the numerical prefix and trim
        }
        return [];
    };

    const [selectedFilm, setSelectedFilm] = React.useState(null);
    const [currentClueIndex, setCurrentClueIndex] = React.useState(0);
    const [clues, setClues] = React.useState([getClues(todaysFilm['Film Name'])[0]]);
    const [showSubmit, setShowSubmit] = React.useState(true);

    const handleGuess = () => {
        if (!selectedFilm) {
            alert("Please select a movie title.");
            return;
        }

        const guess = selectedFilm.label; // Get the label from the selectedFilm object
        const allClues = getClues(todaysFilm['Film Name']);

        if (guess === todaysFilm['Film Name']) {
            setClues(allClues);
            setShowSubmit(false);
            alert("Correct!");

        } else {
            if (currentClueIndex < 4) {
                setClues(prevClues => [...prevClues, allClues[currentClueIndex + 1]]);
                setCurrentClueIndex(prevIndex => prevIndex + 1);
            }
             else {
                alert(`You have exhausted all the clues, the answer was ${todaysFilm['Film Name']}.`);
                setSelectedFilm(null);
                setClues([getClues(todaysFilm['Film Name'])[0]]);
                setCurrentClueIndex(0);
                 setShowSubmit(true);

            }
        }
    };

    return (
        <Container
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <Typography variant="h3" sx={{ alignSelf: 'flex-start', mb: 1 }}>
                    Guess the film
                </Typography>

                <Card variant="outlined" sx={{ width: 500, p: 2 }}>
                    <List>
                        {clues.map((clue, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={`${index + 1}. ${clue}`} />
                            </ListItem>
                        ))}
                    </List>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>

                        <Autocomplete
                            disablePortal
                            options={films}
                            sx={{ flexGrow: 1 }}
                            value={selectedFilm}
                            onChange={(event, newValue) => {
                                setSelectedFilm(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} label="Movie" />}
                        />
                       {showSubmit && <Button className="submit-btn" variant="contained" onClick={handleGuess}>
                            Submit
                        </Button>}
                    </Box>
                </Card>
            </Box>
        </Container>
    );
}

export default Form;