const express = require('express');
const path = require('path');
const { readAndAppend, readFromFile, writeToFile } = require('./helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

// npm package or framework imported above and called here allows code operations
const app = express();
// Middleware for parsing JSON and urlencoded form data including express.static defines how code operates here is defining as json. As code performs it parses data in json formating. express.urlencoded parses incoming url encoded form data and makes it available int he request.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// middleware are operations you define or they can come from library of package.json and they run in between reqests and response cycle. Can add functionality or define data within request and response cycle.
//express.static(), html css and javascript static files will be run from this folder defined below.
app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html')))
///api/notes are naming the routes that will be shown by methods/functions below can be named anything.
app.get('/api/notes', (req, res) =>
    readFromFile('./db/db.json')
    .then(data => res.json(JSON.parse(data)))
    .catch(err => console.error(err))
);
// const notesData = req.body is assigning data stored in body to notesData 
app.post('/api/notes/', (req, res) => {
const notesData = req.body;
//Added dependency in package.json to handle uniqe id assignment to notes entered by user. imported at top of this page and called as function below.
 notesData.id=uuidv4()
if (notesData){
    readAndAppend(notesData, './db/db.json')
    res.json("Note added successfully")
}
else {
    res.json('Error in rendering note')
}
})
// app.delete() has paramater allowed by url extended middleware as :id const noteId is data assigned by req.params.id which is the :id paramater inisde app.delet().... .filter() built in method goes over all of the data thats provided as defined runs a for loop and accepts commands here we use note and arrow function to add new note every pass in the loop then we add functionality by comparing note.id which is the id coming from the data of each added note to the noteId which is the uniqe id assigned by the middleware we only return notes that are not matched or not equal which will be any new added notes. The new notes that are not equal to the id are being re written to the file as saved notes. res.json(response) sends data back to front end to be rendered by fetch request. can use console.log(response) below res.json(response) to see if data is updated correctly after delete on web page.
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
    .then(data => {
     return JSON.parse(data).filter(note => note.id != noteId)
    }) .then(response => {
        writeToFile('./db/db.json', response)
        res.json(response)
      
    } )
    .catch(error => {
        console.error(error)
    })
}
    
)

// GET Route for homepage and sets default for any other request other than requests defined specifically above. Kind of like an error handler.
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html')))



app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);