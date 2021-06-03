const express = require('express');
const submissionsRouter = require("./Submission.routes");
const authController = require("../controllers/Auth.controller");
const challengesController = require('../controllers/Challenge.controller');

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
    .get(authController.verifyToken, challengesController.findAll)
    .post(authController.verifyToken, authController.isTeacher, challengesController.create)

router.route('/submitted')
    .get(authController.verifyToken, authController.isAdmin, challengesController.findAllWithSubmissions)
    
router.route('/:challengeID')
    .get(authController.verifyToken, challengesController.findOne)
    .delete(authController.verifyToken, authController.isTeacher, challengesController.delete)
    .put(authController.verifyToken, authController.isTeacher, challengesController.update)


// routes for challenge submissions
router.use('/:challengeID/submissions', submissionsRouter);

//send a predefined error message for invalid routes on CHALLENGES
router.all('*', function (req, res) {
    res.status(404).json({ message: 'CHALLENGES: what???' });
})

// EXPORT ROUTES (required by APP)
module.exports = router;