const express = require('express');
const { createNote, getNotes, deleteNote, getUserNotes, updateNote } = require('../controllers/notes');
const authToken = require('../middlewares/authToken');
const router = express.Router();

router.get('/', getNotes);
router.post('/post', authToken, createNote);
router.get('/:id', authToken, getUserNotes);
router.put('/:id', authToken, updateNote);
router.delete('/:id', authToken, deleteNote);

module.exports = router;