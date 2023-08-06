const noteData = require('./db/db.json');
const fs = require('fs');
const express = require('express');
const uuid = require('./helper/uuid')
//this helps with routing -- LOOK UP
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

//not for production, only for testing
function overForm(note){
  if (note.id != req.params.id)
  return false
}



app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'))
});


app.get('/api/notes', (req, res) => {
  console.log(noteData)
  res.json(noteData)
});


app.post('/api/notes', (req, res) => {
  console.log(req.body)
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      //calls the import function
      id: uuid(),
      //need to add unique ID here
    };
    fs.readFile('./db/db.json', 'utf8', (err, currNote) => {
      if (err) {
        console.log(err);
      } else {
        const parsedNote = JSON.parse(currNote);
        parsedNote.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(parsedNote, null, 4),
          //callback with arrow function for error handling
          (writeError) => writeError ? console.error(writeError) : console.info('Success')
        );
      }
    });
    res.status(201).json(noteData)
  }
})

app.delete('/api/notes/:id', (req,res) => {
  fs.readFile('./db/db.json', 'utf8', (err, currNote) => {
    if (err) {
      console.log(err);
    } else {
      const parsedNote = JSON.parse(currNote);
      const newparsedNote = parsedNote.filter(function(note){
        console.log(note.id)
        return note.id != req.params.id
      })
      console.log(newparsedNote)
      fs.writeFile('./db/db.json', JSON.stringify(newparsedNote, null, 4),
        //callback with arrow function for error handling
        (writeError) => writeError ? console.error(writeError) : console.info('Success')
      );
    }
  });
   
})



























app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
});