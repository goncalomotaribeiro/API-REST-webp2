const express = require('express');
const commentsRouter = require("./Comment.routes");
const topicsController = require('../controllers/Topic.controller');

let router = express.Router();

router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(topicsController.findAll)
    .post(topicsController.create)

router.route('/commented')
    .get(topicsController.findAllCommented)
    
router.route('/:topicID')
    .get(topicsController.findOne)
    .delete(topicsController.delete)
    .put(topicsController.update)


// routes for topic comments
router.use('/:topicID/comments', commentsRouter);

//send a predefined error message for invalid routes on TOPICS
router.all('*', function (req, res) {
    res.status(404).json({ message: 'TOPICS: what???' });
})

// EXPORT ROUTES (required by APP)
module.exports = router;