const express = require('express')
const router = express.Router();

router.use('/users', require('./routes/users.js'));
router.use('/notes', require('./routes/notes.js'));

module.exports = router;