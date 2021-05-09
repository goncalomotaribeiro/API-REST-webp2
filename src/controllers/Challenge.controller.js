const db = require('../models/index.js');
const Challenge = db.challenge;
const Submission = db.submission
const User = db.user

//necessary for LIKE operator
const { Op, where } = require('sequelize');

const getPagination = (page, size) => {
    const limit = size ? size : 3; // limit = size (default is 3)
    const offset = page ? page * limit : 0; // offset = page * size (start counting from page 0)
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const totalItems = data.count;
    const challenges = data.rows;
    const currentPage = page;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, challenges, totalPages, currentPage };
};

// Display all Challenges
exports.findAll = (req, res) => {

    //get data from request query string
    let { page, size, title } = req.query;
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

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

    Challenge.findAndCountAll({ attributes: ['id', 'title', 'description', 'date_ini', 'date_end', 'rules', 'id_area', 'id_category', 'id_state'], where: condition, limit, offset, 
        include: [
            {
                model: User, attributes: ["id", "username", "email"]
            },
            {
                model: Submission, attributes: ["id", "url", "date"]
            }
        ]})
        .then(data => {
            const response = getPagingData(data, offset, limit);
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving challenges."
            });
        });
};

// Challenge creation
exports.create = (req, res) => {
    Challenge.create(req.body)
        .then(data => {
            res.status(201).json({ message: "New challenge created.", location: "/challenges/" + data.id });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the Challenge."
                });
        });
};

// List just one Challenge
exports.findOne = (req, res) => {
    Challenge.findOne({where: {id: req.params.challengeID} , attributes: ['id', 'title', 'description', 'date_ini', 'date_end', 'rules', 'id_area', 'id_category', 'id_state'],
    include: [
        {
            model: User, attributes: ["id", "username", "email"]
        },
        {
            model: Submission, attributes: ["id", "url", "date"]
        }
    ]})
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found challenge with id ${req.params.challengeID}.`
                });
            else
                res.json(data); 
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving challenge with id ${req.params.challengeID}.`
            });
        });
};

// Update Challenge
exports.update = (req, res) => {
    Challenge.update(req.body, { where: { id: req.params.challengeID } })
        .then(num => {
            if (num == 1) {
                res.json({
                    message: `Challenge with id=${req.params.challengeID} was updated successfully.`
                });
            } else {
                res.status(404).json({
                    message: `Not found challenge with id=${req.params.challengeID}.`
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `Error updating challenge with id=${req.params.id}.`
            });
        });
};

// Delete Challenge
exports.delete = (req, res) => {
    Challenge.destroy({ where: { id: req.params.challengeID } })
        .then(num => {
            if (num == 1) {
                res.status(200).json({
                    message: `Challenge with id ${req.params.challengeID} was successfully deleted!`
                });
            } else {
                res.status(404).json({
                    message: `Not found challenge with id=${req.params.challengeID}.`
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `Error deleting challenge with id=${req.params.challengeID}.`
            });
        });
};

// Display list of all challenges with submissions
exports.findAllWithSubmissions = async (req, res) => {
    try {
        let data = await Challenge.findAll({
            include: {
                model: Submission, required: true,
                attributes: []
            }
        })
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({
            message:
                err.message || "Some error occurred while retrieving challenges."
        });
    };
};