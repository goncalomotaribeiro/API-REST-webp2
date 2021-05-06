const express = require('express');
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
    .get(commentController.findAll)
    .post(commentController.createComment);

router.route('/:commentID')
    .get(commentController.findOne)
    .put(commentController.update)
    .delete(commentController.delete);

router.all('*', function (req, res) {
    //send an predefined error message 
    res.status(404).json({ message: 'COMMENTS: invalid request' });
})

module.exports = router;