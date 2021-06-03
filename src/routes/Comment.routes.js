const express = require('express');
const authController = require("../controllers/Auth.controller");
const commentController = require("../controllers/Comment.controller");

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
    .get(authController.verifyToken, commentController.findAll)
    .post(authController.verifyToken, commentController.createComment);

router.route('/:commentID')
    .get(authController.verifyToken, commentController.findOne)
    .put(authController.verifyToken, commentController.update)
    .delete(authController.verifyToken, commentController.delete);

router.all('*', function (req, res) {
    //send an predefined error message 
    res.status(404).json({ message: 'COMMENTS: invalid request' });
})

module.exports = router;