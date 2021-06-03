const express = require('express');
const commentsRouter = require("./Comment.routes");
const authController = require("../controllers/Auth.controller");
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
    .get(authController.verifyToken, topicsController.findAll)
    .post(authController.verifyToken, topicsController.create)

router.route('/commented')
    .get(authController.verifyToken, authController.isAdmin, topicsController.findAllCommented)
    
router.route('/:topicID')
    .get(authController.verifyToken, topicsController.findOne)
    .delete(authController.verifyToken, topicsController.delete)
    .put(authController.verifyToken, topicsController.update)


// routes for topic comments
router.use('/:topicID/comments', commentsRouter);

//send a predefined error message for invalid routes on TOPICS
router.all('*', function (req, res) {
    res.status(404).json({ message: 'TOPICS: what???' });
})

// EXPORT ROUTES (required by APP)
module.exports = router;