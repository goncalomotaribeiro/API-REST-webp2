const express = require('express');
const submissionController = require("../controllers/Submission.controller");

let router = express.Router({ mergeParams: true });

router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const end = Date.now();
        const diffSeconds = (Date.now() - start) / 1000;
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(submissionController.findAll)
    .post(submissionController.createSubmission);

router.route('/:submissionID')
    .get(submissionController.findOne)
    .put(submissionController.update)
    .delete(submissionController.delete);

router.all('*', function (req, res) {
    //send an predefined error message 
    res.status(404).json({ message: 'SUBMISSIONS: invalid request' });
})

module.exports = router;