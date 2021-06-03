const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const UserType = db.user_type;


exports.signup = async (req, res) => {
    try {
        // check duplicate username
        let user = await User.findOne(
            { where: { username: req.body.username } }
        );
        if (user)
            return res.status(400).json({ message: "Username is already in use!" });

        // check duplicate email
        user = await User.findOne(
            { where: { email: req.body.email } }
        );
        if (user)
            return res.status(400).json({ message: "Email already associated with account!" });

        // save User to database
        user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10), // generates hash to password
            name: req.body.name,
            biography: req.body.biography,
            location: req.body.location,
            url: req.body.url,
            profile_picture: req.body.profile_picture
        });
        if (req.body.user_type) {
            let user_type = await UserType.findOne({ where: { type: req.body.user_type } });
            if (user_type) {
                if (user_type.type === "Admin") {
                    await User.update({ id_type: 1 }, { where: { id: user.id } })
                } else if (user_type.type === "Teacher") {
                    await User.update({ id_type: 3 }, { where: { id: user.id } })
                }
            }
        }
        else
            await User.update({ id_type: 2 }, { where: { id: user.id } })
        return res.json({ message: "User was registered successfully!" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    };
};

exports.signin = async (req, res) => {
    try {

        let user = await User.findOne({ where: { username: req.body.username } });
        if (!user) return res.status(404).json({ message: "User Not found." });

        // tests a string (password in body) against a hash (password in database)
        const passwordIsValid = bcrypt.compareSync(
            req.body.password, user.password
        );
        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null, message: "Invalid Password!"
            });
        }

        // sign the given payload (user ID) into a JWT payload – builds JWT token, using secret key
        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
        });
        let user_type = await UserType.findOne({ where: { id: user.id_type } });
        return res.status(200).json({
            id: user.id, username: user.username,
            email: user.email, user_type: user_type.type.toUpperCase(), accessToken: token
        });
    } catch (err) { res.status(500).json({ message: err.message }); };
};

exports.verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    // verify request token given the JWT secret key
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.loggedUserId = decoded.id; // save user ID for future verifications
        next();
    });
};

exports.isAdmin = async (req, res, next) => {
    let user = await User.findByPk(req.loggedUserId);
    let user_type = await UserType.findOne({ where: { id: user.id_type } });
    if (user_type.type === "Admin")
    {
        next();
    }else{
        return res.status(403).send({
            message: "Require Admin User Type!"
        });
    }
};

exports.isAdminOrLoggedUser = async (req, res, next) => {
    console.log(req);
    let user = await User.findByPk(req.loggedUserId);
    let user_type = await UserType.findOne({ where: { id: user.id_type } });
    if (user_type.type === "Admin" || (user.id == req.params.userID)){
        next();
    }else{
        return res.status(403).send({
            message: "Require Admin User Type!"
        });
    }
};


exports.isTeacher = async (req, res, next) => {
    let user = await User.findByPk(req.loggedUserId);
    let user_type = await UserType.findOne({ where: { id: user.id_type } });
    if (user_type.type === "Teacher" || user_type.type === "Admin")
    {
        next();
    }else{
        return res.status(403).send({
            message: "Require Teacher or Admin User Type!"
        });
    }
};