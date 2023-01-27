const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

app.use(express.static('public'));
app.use(express.json());

// Get route for index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html')); 
});

// Get route for notes
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, 'path/notes.html'));
});

// TODO: Get route to read db.json
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json' , (err, data) => {
        const noteText = JSON.parse(data);
        res.json(noteText);
    })
});

// TODO: Post new notes (somewhere?)

// TODO: Get the new notes

// * Bonus Delete Notes

app.listen(PORT, () => 
    console.log(`App Listening at http://localhost:${PORT}`)
);