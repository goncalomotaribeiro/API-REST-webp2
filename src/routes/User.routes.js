const express = require('express');
const userController = require("../controllers/User.controller");

// express router
let router = express.Router();

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
    .get(userController.findAll)
    .post(userController.create);

router.route('/submitted')
    .get(userController.findAllWithSubmissions)

router.route('/:userID')
    .get(userController.findOne)
    .put(userController.update)
    .delete(userController.delete);

router.all('*', function (req, res) {
    res.status(404).json({ message: 'USERS: invalid request' });
})

module.exports = router;