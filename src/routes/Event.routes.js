const express = require('express');
// const submissionsRouter = require("./Submission.routes");
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
    .get(eventsController.findAll)
    .post(eventsController.create)

// router.route('/submitted')
//     .get(eventsController.findAllWithSubmissions)
    
router.route('/:eventID')
    .get(eventsController.findOne)
    .delete(eventsController.delete)
    .put(eventsController.update)


// // routes for event submissions
// router.use('/:eventID/submissions', submissionsRouter);

//send a predefined error message for invalid routes on EVENTS
router.all('*', function (req, res) {
    res.status(404).json({ message: 'EVENTS: what???' });
})

// EXPORT ROUTES (required by APP)
module.exports = router;