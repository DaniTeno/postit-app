require('dotenv').config()
const express = require('express')
const app = express();
const users = express.static('./public/users.html')
const PORT = 3000;
const cors = require('cors');
const mongoConnect = require('./api/config/mongoDB');
app.use(cors());
app.use(express.json());

app.use('/', express.static('./public'));
app.use('/users', users);
app.use('/api', require('./api/index'));
app.listen(PORT, () => {
    console.log(`Server Live in: http://localhost:${PORT}`)
});
mongoConnect();