const { notesModels } = require('../models/index')
const { handleHttpError } = require('../utils/handleErrors');

const createNote = async (req, res) => {
    try {
        const body = req.body
        const newNote = await notesModels.create(body)
        return res.send(newNote);
    } catch (err) {
        handleHttpError(res, 'ERROR:CREATE_NOTE');
    }
};

const getNotes = async (req, res) => {
    try {
        const notes = await notesModels.find({});
        res.send(notes);
    } catch (err) {
        handleHttpError(res, 'ERROR:GET_NOTES');
    }
};

const getUserNotes = async (req, res) => {
    try {
        if(!req.params.id) return handleHttpError(res, "ERROR:NO_SESSION")
        const {id} = await req.params;
        const notes = await notesModels.find({userId: id});
        res.send({notes})
    } catch (err) {
        handleHttpError(res, 'ERROR:USER_NOTES');
    }
};

const deleteNote = async (req, res) => {
    try {
        // console.log(req)
        if(!req.params.id) return handleHttpError(res, 'ERROR:NOTE_NOT_FOUND', 404)
        const {id} = req.params
        const data = await notesModels.findByIdAndDelete(id)
        res.send({data, msg: `Note id:${id}, has been deleted`});
    } catch (err) {
        handleHttpError(res, 'ERROR:DELETE_NOTE');
    }
};

const updateNote = async (req, res) => {
    try {
        const {params, body} = req
        const data = await notesModels.findByIdAndUpdate(params.id, body)
        res.send({data})
    } catch (err) {
        handleHttpError(res, 'ERROR:UPDATE_ITEM')
    }
};

module.exports = {createNote, getNotes, deleteNote, getUserNotes, updateNote};