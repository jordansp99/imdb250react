import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Box, Container, Typography, List, ListItem, ListItemText, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

function Form() {
    const [filmsData, setFilmsData] = useState([]);
    const [todaysFilm, setTodaysFilm] = useState(null);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [currentClueIndex, setCurrentClueIndex] = useState(0);
    const [clues, setClues] = useState([]);
    const [showSubmit, setShowSubmit] = useState(true);
     const [answerYear, setAnswerYear] = useState(null);
    const [revealAnswer, setRevealAnswer] = useState(false);


    // Helper function for seeded random number generation
    const seededRandom = (seed) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    // Function to get the index of the film based on date
    const getFilmIndexByDate = () => {
        const today = new Date();
        const seed = today.getFullYear() * 10000 + today.getMonth() * 100 + today.getDate();
        const randomIndex = Math.floor(seededRandom(seed) * filmsData.length);

        return randomIndex
    };

    // Fetch and process JSONL data
    useEffect(() => {
        const fetchData = async () => {
            try {
                 const response = await fetch('./clues_with_date.jsonl');
                 const text = await response.text();
                 const lines = text.trim().split('\n');
                 const parsedData = lines.map(line => JSON.parse(line));
                 setFilmsData(parsedData);
             } catch (error) {
                 console.error("Error fetching or parsing clues.json:", error);
             }
        };

        fetchData();
     }, []);


    // Set todays film when filmsData is populated
    useEffect(() => {
        if (filmsData.length > 0) {
           const todaysFilmIndex = getFilmIndexByDate();
           const todaysFilm = filmsData[todaysFilmIndex];
           setTodaysFilm(todaysFilm);
           setClues([todaysFilm.Clues[0]]); // Set initial clue
            setAnswerYear(todaysFilm.Year); // Set the answer year
        }
    }, [filmsData]);


    // Process the films data to extract labels and IDs
     const films = filmsData.map((film, index) => ({
         label: film['Film Name'],
         id: index + 1,
     }));

    // Function to extract clues from the JSON
    const getClues = (filmName) => {
        const selectedFilm = filmsData.find(film => film['Film Name'] === filmName);
        return selectedFilm ? selectedFilm.Clues : [];
    };


    const handleGuess = () => {
        if (!selectedFilm) {
            alert("Please select a movie title.");
            return;
        }

        const guess = selectedFilm.label;
        const allClues = getClues(todaysFilm['Film Name']);

        if (guess === todaysFilm['Film Name']) {
            setClues(allClues);
            setShowSubmit(false);
            setRevealAnswer(true);
             alert("Correct!");
        } else {
            if (currentClueIndex < allClues.length - 1 ) {
                 setClues(prevClues => [...prevClues, allClues[currentClueIndex + 1]]);
                 setCurrentClueIndex(prevIndex => prevIndex + 1);
                 setSelectedFilm(null);
            }
            else {
                 alert(`You have exhausted all the clues, the answer was ${todaysFilm['Film Name']}.`);
                 setSelectedFilm(null);
                 setClues([getClues(todaysFilm['Film Name'])[0]]); // Reset the clues
                 setCurrentClueIndex(0);
                setShowSubmit(true);
                 setRevealAnswer(false);
            }
        }
    };

    if (!todaysFilm) {
         return <Typography>Loading...</Typography>; // Render loading state if todaysFilm not ready
     }

    return (
        <Container
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                flexDirection: 'column'
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
                     {revealAnswer && ( 
                        <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                           Answer: {todaysFilm['Film Name']} ({answerYear})
                        </Typography>
                      )}
                       {!revealAnswer && answerYear && ( 
                        <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                           Year: {answerYear}
                        </Typography>
                      )}
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
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', padding: 0 }}>
             <Tooltip
                    title={
                         <Typography variant="body2">
                            The films in this game are in the top 250 on IMDB. The films and clues were generated with Gemini 2.0.
                        </Typography>
                    }
                    >
                    <IconButton>
                        <InfoIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            </Box>

        </Container>
    );
}

export default Form;