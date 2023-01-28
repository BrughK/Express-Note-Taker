const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
// Assign PORT#
const PORT = 3001;
// Middleware for parsing JSON and urlencoded form data
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Get route for index/home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html')); 
});

// Get route for notes
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// TODO: Get route to read db.json
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json' , (err, data) => {
        const noteText = JSON.parse(data);
        res.json(noteText);
    })
});

// TODO: Post new notes (somewhere?)
app.post('/api/notes', (req, res) => {
    // Console log that writes when a post request is recieved
    console.info(`${req.method} request received to add a note`);
    // Writes the json text in the terminal
    console.log(req.body);

    fs.readFile('./db/db.json' , (err, data) => {
        const noteText = JSON.parse(data);
        // Push text to the body?
        noteText.push(req.body);
        // Need to write the note to the file
        // Pulled from unit 11 act 21
        fs.writeFile('./db/db.json', JSON.stringify(noteText, null, 4), (err) => {
            console.log(err);
        });
    });
});

// TODO: Get the new notes
// !Still working on this!
app.get('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        const noteText = JSON.parse(data);
        res.json(noteText[req.param.id]);
    });
});

// * Bonus Delete Notes
app.delete('/api/notes/:id', (req, res) => {
    // delete route here
});


app.listen(PORT, () => 
    console.log(`App Listening at http://localhost:${PORT}`)
);