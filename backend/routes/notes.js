const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes")
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require('express-validator');

// ROUTE 1 : Get all the notes using: GET "/api/notes/fetchallnotes": login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error!");
    }
})

// ROUTE 2 : Add a new note using: POST "/api/notes/addnote": login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description must have atleast 5 char').isLength({ min: 5 }),
], async (req, res) => {
    // if there are errors return 400 and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, tag } = req.body;

        // creating new note
        const note = new Notes({
            title,
            description,
            tag,
            user: req.user.id
        })
        const savedNote = await note.save();

        res.json(savedNote);

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error!");
    }
})

// ROUTE 3 : Update an existing note using: POST "/api/notes/updatenote": login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    const { title, description, tag } = req.body;
    try {

        // creating new note object
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        // find the note to be updated 
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found!") }

        // check user
        // console.log(note.user)
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed!")
        }

        // update note with new entries
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error!");
    }
})

// ROUTE 4 : Delete existing note using: DELETE "/api/notes/deletenote": login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {
        // find note using id 
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send('No Note Found') }

        // check the user
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed!");
        }

        // delete note with id
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error!");
    }
})

module.exports = router;