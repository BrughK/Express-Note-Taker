const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const uuid = require('./helper/uuid');
// Assign PORT#
// Need this for heroku to work
cconst PORT = process.env.PORT || 3001;
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

// Get route to read db.json
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json' , (err, data) => {
        const noteText = JSON.parse(data);
        res.json(noteText);
    })
});

// Post new notes (somewhere?)
app.post('/api/notes', (req, res) => {
    // Console log that writes when a post request is recieved
    console.info(`${req.method} request received to add a note`);
    // creating title and text
    const {title, text} = req.body;
    // if the inputs are valid then add note
    if (title && text){
        const newNote = {
            title,
            text,
            id: uuid(),
        };
        // read the json file then write inside the function
        fs.readFile('./db/db.json' , (err, data) => {
            const noteText = JSON.parse(data);
            // Push text to the body?
            noteText.push(newNote);
            // Need to write the note to the file
            // Pulled from unit 11 act 21
            fs.writeFile('./db/db.json', JSON.stringify(noteText, null, 4), (writeErr) => {
                writeErr
                    ? console.error(writeErr)
                    : console.log(`${newNote.title} has been added to JSON!`)
            });
        });
        // making a response object to see in terminal if note writing is working
        const response = {
            status: 'success',
            body: newNote,
            };
        
            console.log(response);
            res.status(201).json(response);
    }
    // if not valid then error 500
    else {
        res.status(500).json("Ooooh we've hit an error!");
    }

});

// Get the new notes
app.get('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        const noteText = JSON.parse(data);
        res.json(noteText[req.param.id]);
    });
});

// * Bonus Delete Notes
// Very similar to posting the notes just change to  "app.delete" and add a splice method to pick specific note id's
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        const noteText = JSON.parse(data);
        // splicing just 1 with the id so it doesn't delete multiple
        noteText.splice(req.params.id, 1);
        fs.writeFile('./db/db.json', JSON.stringify(noteText, null, 4), (writeErr) => {
            // error handling because why not
            writeErr
                ? console.error(writeErr)
                : console.log("Note Deleted!")
        });
    });
    // this stack overflow is where I figured this out lol
    // https://stackoverflow.com/questions/15825333/how-to-reload-current-page-in-express-js
    res.redirect('back');
});

// Run the server port
app.listen(PORT, () => 
    console.log(`App Listening at http://localhost:${PORT} 🖥️`)
);
