const express = require('express');
const authController = require("../controllers/Auth.controller");
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
    .get(authController.verifyToken, authController.isTeacher, submissionController.findAll)
    .post(authController.verifyToken, submissionController.createSubmission);

router.route('/:submissionID')
    .get(authController.verifyToken, submissionController.findOne)
    .put(authController.verifyToken, submissionController.update)
    .delete(authController.verifyToken, submissionController.delete);

router.all('*', function (req, res) {
    //send an predefined error message 
    res.status(404).json({ message: 'SUBMISSIONS: invalid request' });
})

module.exports = router;