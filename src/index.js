require('dotenv').config();         // read environment variables from .env file
const express = require('express');
const cors = require('cors');       // middleware to enable CORS (Cross-Origin Resource Sharing)
const fileUpload = require('express-fileupload');

const app = express();
const port = process.env.PORT || 3000;	 	// if not defined, use port 8080
// const host = process.env.HOST || '127.0.0.1'; 	// if not defined, localhost

app.use(cors()); //enable ALL CORS requests (client requests from other domain)
app.use(express.json()); //enable parsing JSON body data

// root route -- /api/
app.get('/', function (req, res) {
    res.status(200).json({ message: 'home -- WEBP2 api' });
});

// Upload Files
app.use(fileUpload())

// routing middleware for resource AUTHENTICATION
app.use('/auth', require('./routes/Auth.routes.js'))

// routing middleware for resource USERS
app.use('/users', require('./routes/User.routes.js'))

// routing middleware for resource CHALLENGES
app.use('/challenges', require('./routes/Challenge.routes.js'))

// routing middleware for resource SUBMISSIONS
app.use('/submissions', require('./routes/Submission.routes.js'))

// routing middleware for resource EVENTS
app.use('/events', require('./routes/Event.routes.js'))

// routing middleware for resource TOPICS
app.use('/topics', require('./routes/Topic.routes.js'))

// routing middleware for resource COMMENTS
app.use('/comments', require('./routes/Comment.routes.js'))

// routing middleware for resource MYEVENTS
app.use('/my-events', require('./routes/MyEvent.routes.js'))

// handle invalid routes
app.get('*', function (req, res) {
    res.status(404).json({ message: 'WHAT???' });
})

app.listen(port, () => console.log(`App listening on PORT ${port}/`));


