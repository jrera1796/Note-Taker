const express = require('express');

const path = require('path');
const app = express();
const { notes } = require('./db/db.json');
const fs = require('fs');
const crypto = require('crypto');
const id = crypto.randomBytes(10).toString('hex');
const PORT = process.env.PORT || 3001;


// function filterItems();

//'middleware'
app.use(express.static('public'));
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());





app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '../db/db.json'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    //reading content
    fs.readFile(`./db/db.json`, 'utf-8', (err, data) => {
      if (err) {
        throw err;
      } else {
        //parsing contents
        const dbNotes = JSON.parse(data);
        //appending POST body
        dbNotes.push({ title, text, id: new crypto.randomBytes(10).toString('hex') });
        //rewriting with new changes
        fs.writeFile(`./db/db.json`, JSON.stringify(dbNotes), (err) => err ?
          console.error(err) : console.log(`${title} is written to JSON file`));
      }
    }) 
    res.json({Status: 'Success', body : {title, text, id}})
  } else {
    res.json('Could not add note');
  }
});


app.delete('/api/notes/:id', (req, res) => {
  //reading file
  fs.readFile(`./db/db.json`, 'utf8', (err, data) => {
      if (err) { console.log(err); }
      //parsing contents
      const dbNotes = JSON.parse(data);
      for (let i = 0; i < dbNotes.length; i++) {
          if (dbNotes[i].id === req.params.id) { dbNotes.splice(i, 1); }
      }
      fs.writeFile(`./db/db.json`, JSON.stringify(dbNotes), (err) => err ?
          console.error(err) : console.log(`Note deleted ID: ${req.params.id}`)
      );
      res.send(dbNotes);
  })
});


//-----TESTING-AREA---REMOVE-OUT-ONCE-SUCCESSFUL-----------

// app.delete('/api/notes/:id', (req, res) => {
//   //reading file
//   fs.readFile(`./db/db.json`, 'utf8', (err, data) => {
//       if (err) { console.log(err); }
//       //parsing contents
//       const dbNotes = JSON.parse(data);
//       for (let i = 0; i < dbNotes.length; i++) {
//           if (dbNotes[i].id === req.params.id) { dbNotes.splice(i, 1); }
//       }
//       fs.writeFile(`./db/db.json`, JSON.stringify(dbNotes), (err) => err ?
//           console.error(err) : console.log(`Note deleted ID: ${req.params.id}`)
//       );
//       res.send(dbNotes);
//   })
// });


//-------------------------------------------------------
app.get('*', (req, res) => {
  res.sendFile(__dirname, './public/index.html');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

