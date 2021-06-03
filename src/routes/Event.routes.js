const express = require('express');
const authController = require("../controllers/Auth.controller");
const eventsController = require('../controllers/Event.controller');

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
    .get(authController.verifyToken, eventsController.findAll)
    .post(authController.verifyToken, authController.isTeacher, eventsController.create)
    
router.route('/:eventID')
    .get(authController.verifyToken, eventsController.findOne)
    .delete(authController.verifyToken, authController.isTeacher, eventsController.delete)
    .put(authController.verifyToken, authController.isTeacher, eventsController.update)

//send a predefined error message for invalid routes on EVENTS
router.all('*', function (req, res) {
    res.status(404).json({ message: 'EVENTS: what???' });
})

// EXPORT ROUTES (required by APP)
module.exports = router;