const express = require('express');
const authController = require("../controllers/Auth.controller");
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
    .get(authController.verifyToken, authController.isAdmin, userController.findAll)

router.route('/submitted')
    .get(authController.verifyToken, authController.isAdmin, userController.findAllWithSubmissions)

router.route('/:userID')
    .get(authController.verifyToken, authController.isAdminOrLoggedUser, userController.findOne)
    .put(authController.verifyToken, authController.isAdminOrLoggedUser, userController.update)
    .delete(authController.verifyToken, authController.isAdminOrLoggedUser, userController.delete);

router.all('*', function (req, res) {
    res.status(404).json({ message: 'USERS: invalid request' });
})

module.exports = router;