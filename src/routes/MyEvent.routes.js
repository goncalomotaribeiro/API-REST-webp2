const express = require('express');
const authController = require("../controllers/Auth.controller");
const myEventController = require("../controllers/MyEvent.controller");

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
    .get(authController.verifyToken, myEventController.findAll)
    .post(authController.verifyToken, myEventController.create);

router.route('/:myEventID')
    .get(authController.verifyToken, myEventController.findOne)
    .delete(authController.verifyToken, myEventController.delete);

router.all('*', function (req, res) {
    //send an predefined error message 
    res.status(404).json({ message: 'MYEVENTS: invalid request' });
})

module.exports = router;