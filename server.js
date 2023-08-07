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



app.post('/api/notes', (req, res) => {
  console.log(req.body)
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      //calls the imported function for unique ID
      id: uuid(),
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
  }
  res.status(201).json('Note added')
})

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, currNote) => {
    if (err) {
      console.log(err);
    } else {
      const parsedNote = JSON.parse(currNote);
      const newparsedNote = parsedNote.filter(function (note) {
        //returns an array of all objects that dont have a matching ID
        return note.id != req.params.id
      })
      fs.writeFile('./db/db.json', JSON.stringify(newparsedNote, null, 4),
        //callback with arrow function for error handling
        (writeError) => writeError ? console.error(writeError) : console.info('Success')
      );
    }
  });
  res.status(201).json('Note deleted')
})


app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './db/db.json'))
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'))
});


//this is the terminal syntax for heroku trouble shooting
//heroku logs --app patrick-notetaker-demo --tail


























app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
});