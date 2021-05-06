// const path = require('path');
const util = require('util');
const fs =require('fs');
const router = require('express').Router();
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
let count = 0;
function storeDb (data) {
    return writeFileAsync('db/db.json', JSON.stringify(data));
}
function readDb() {
    return readFileAsync('db/db.json', 'utf8');
}

function getNotes() {
    return readDb().then((data) => {
        let parsedStore;
        parsedStore = [].concat(JSON.parse(data));
        return parsedStore;
    });
};

function deleteDb(id) {
    return getNotes()
      .then((data) => data.filter((note) => note.id !== id))
      .then((filteredNotes) => storeDb(filteredNotes));
  }

function postNote(note) {
    count++
    const { title, text } = note;
    const newNote = { title, text, id: `${count}` };

    return getNotes()
      .then((data) => [...data, newNote])
      .then((updatedNotes) => storeDb(updatedNotes))
      .then(() => newNote);
  }

router.get('/notes', (req, res) => {
    // fs.readFile(path.join(__dirname, "../db/db.json"), "utf8", (err, data) => {
    //     if (err) throw err;
    //     res.json(JSON.parse(data));
    // })
    
    getNotes()
    .then((data) => {
      return res.json(data);
    })
}) 


router.post('/notes', (req, res) => {
    // fs.writeFile(path.join(__dirname, "../db/db.json"), "utf8", (err, data) => {
    //     if (err) throw err;
    //     res.json(req.body);
    // })
    postNote(req.body)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
})

router.delete('/notes/:id', (req, res) => {
    deleteDb(req.params.id)
      .then(() => res.json({ ok: true }))
  });

module.exports = router;