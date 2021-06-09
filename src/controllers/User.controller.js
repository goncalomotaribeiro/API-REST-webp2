// const Tutorial = require('../models/tutorials.model.js');
const db = require('../models/index.js');
const User = db.user;
const Submission = db.submission
const Challenge = db.challenge
const Event = db.event
const UserType = db.user_type
const { Op } = require('sequelize')

const getPagination = (page, size) => {
    const limit = size ? parseInt(size) : 3; // limit = size (default is 3)
    const offset = page ? parseInt(page) * limit : 0; // offset = page * size (start counting from page 0)
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const totalItems = data.count;
    const users = data.rows;
    const currentPage = page;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, users, totalPages, currentPage };
};

// Display list of all users
exports.findAll = (req, res) => {

    //get data from request query string
    let { page, size, username } = req.query;
    const condition = username ? { username: { [Op.like]: `%${username}%` } } : null;

    // validate page
    if (page && !req.query.page.match(/^(0|[1-9]\d*)$/g)) {
        res.status(400).json({ message: 'Page number must be 0 or a positive integer' });
        return;
    }
    else
        page = parseInt(page);

    // validate size
    if (size && !req.query.size.match(/^([1-9]\d*)$/g)) {
        res.status(400).json({ message: 'Size must be a positive integer' });
        return;
    } else
        size = parseInt(size);

    // convert page & size into limit & offset options for findAndCountAll
    const { limit, offset } = getPagination(page, size);

    User.findAndCountAll({ attributes: ['id', 'username', 'email', 'password', 'name', 'biography', 'location', 'url', 'profile_picture'],
        where: condition, limit, offset,
        include: [
            {
                model: Challenge, attributes: ["id", "title"]
            },
            {
                model: Event, attributes: ["id", "title"]
            },
            {
                model: Submission, attributes: ["id", "url", "date", "id_user"]
            },
            {
                model: UserType, attributes: ["id", "type"]
            }
        ]
    })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

// List just one user
exports.findOne = (req, res) => {
    User.findByPk(req.params.userID,
        {
            include: [
                {
                    model: Challenge, attributes: ["id", "title"]
                },
                {
                    model: Event, attributes: ["id", "title"]
                },
                {
                    model: Submission, attributes: ["id", "url", "date", "id_user"]
                }
            ]
        })
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found user with id ${req.params.userID}.`
                });
            else
                res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving user with id ${req.params.userID}.`
            });
        });
};

// Update one user
exports.update = async (req, res) => {
    // check duplicate username
    let user = await User.findOne(
        { where: { username: req.body.username } }
    );
    if (user && req.params.userID != user.id)
        return res.status(400).json({ message: "Username already taken!" });

    // check duplicate email
    user = await User.findOne(
        { where: { email: req.body.email } }
    );
    if (user && req.params.userID != user.id)
        return res.status(400).json({ message: "Email already associated with account!" });

    User.update(req.body, { where: { id: req.params.userID } })
        .then(num => {
            if (num == 1) {
                res.json({
                    message: `User with id=${req.params.userID} was updated successfully.`
                });
            } else {
                res.status(404).json({
                    message: `Not found user with id=${req.params.userID}.`
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `Error updating user with id=${req.params.id}.`
            });
        });
};

// Delete one user
exports.delete = (req, res) => {
    User.destroy({ where: { id: req.params.userID } })
        .then(num => {
            if (num == 1) {
                res.status(200).json({
                    message: `User with id ${req.params.userID} was successfully deleted!`
                });
            } else {
                res.status(404).json({
                    message: `Not found user with id=${req.params.userID}.`
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `Error deleting user with id=${req.params.userID}.`
            });
        });
};

// Display list of all users with submissions
exports.findAllWithSubmissions = async (req, res) => {
    try {
        let data = await User.findAll({
            include: {
                model: Submission, required: true,
                attributes: []
            }
        })
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({
            message:
                err.message || "Some error occurred while retrieving users."
        });
    };
};