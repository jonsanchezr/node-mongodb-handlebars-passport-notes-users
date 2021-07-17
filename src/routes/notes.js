const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/create', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/create', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({text: 'Please Write a Title'});
    }

    if (!description) {
        errors.push({text: 'Please Write a Description'});
    }

    if (errors.length > 0) {
        return res.render('notes/new-note', {
            errors,
            title,
            description
        });
    }

    const newNote = new Note({
        title,
        description
    });
    newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note added successfully');
    return res.redirect('/notes');
});

router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
    res.render('notes/all-notes', { notes });
});

router.get('/notes/:id', isAuthenticated, async (req, res) => {
    const id = req.params.id;
    const note = await Note.findById(id);
    res.render('notes/edit-note', { note });
});

router.put('/notes/:id', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    const id = req.params.id;
    await Note.findByIdAndUpdate(id, { title, description });
    req.flash('success_msg', 'Note updated successfully');
    return res.redirect('/notes');
});

router.delete('/notes/:id', isAuthenticated, async (req, res) => {
    const id = req.params.id;
    await Note.findByIdAndDelete(id);
    req.flash('success_msg', 'Note deleted successfully');
    return res.redirect('/notes');
});

module.exports = router;
