require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;
const host = process.env.HOST || '127.0.0.1';

app.use(cors());
app.use(express.json());

// root route -- /api/
app.get('/', function (req, res) {
    res.status(200).json({ message: 'home -- webp2 api' });
});

// routing middleware for resource CHALLENGES
app.use('/challenges', require('./routes/Challenge.routes.js'))

// handle invalid routes
app.get('*', function (req, res) {
    res.status(404).json({ message: 'WHAT???' });
})

app.listen(port, host, () => console.log(`App listening at http://${host}:${port}/`));