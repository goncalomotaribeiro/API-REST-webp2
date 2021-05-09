const db = require('../models/index.js');
const Topic = db.topic;
const Comment = db.comment
const User = db.user

//necessary for LIKE operator
const { Op } = require('sequelize');

const getPagination = (page, size) => {
    const limit = size ? size : 3; // limit = size (default is 3)
    const offset = page ? page * limit : 0; // offset = page * size (start counting from page 0)
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const totalItems = data.count;
    const tutorials = data.rows;
    const currentPage = page;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, tutorials, totalPages, currentPage };
};

// Display all Topics
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

    Topic.findAndCountAll({ attributes: ['id', 'title', 'text', 'date', 'id_category', 'id_state'], where: condition, limit, offset,
    include: [
        {
            model: User, attributes: ["id", "username", "email"]
        },
        {
            model: Comment, attributes: ["id", "comment", "date", "id_user"]
        }
    ]})
        .then(data => {
            const response = getPagingData(data, offset, limit);
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving topics."
            });
        });
};

// Topic creation
exports.create = (req, res) => {
    Topic.create(req.body)
        .then(data => {
            res.status(201).json({ message: "New topic created.", location: "/topics/" + data.id });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the topic."
                });
        });
};

// List just one Topic
exports.findOne = (req, res) => {
    Topic.findByPk(req.params.topicID)
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found topic with id ${req.params.topicID}.`
                });
            else
                res.json(data); 
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving topic with id ${req.params.topicID}.`
            });
        });
};

// Update Topic
exports.update = (req, res) => {
    Topic.update(req.body, { where: { id: req.params.topicID } })
        .then(num => {
            if (num == 1) {
                res.json({
                    message: `Topic with id=${req.params.topicID} was updated successfully.`
                });
            } else {
                res.status(404).json({
                    message: `Not found topic with id=${req.params.topicID}.`
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `Error updating topic with id=${req.params.id}.`
            });
        });
};

// Delete Topic
exports.delete = (req, res) => {
    Topic.destroy({ where: { id: req.params.topicID } })
        .then(num => {
            if (num == 1) {
                res.status(200).json({
                    message: `Topic with id ${req.params.topicID} was successfully deleted!`
                });
            } else {
                res.status(404).json({
                    message: `Not found topic with id=${req.params.topicID}.`
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `Error deleting topic with id=${req.params.topicID}.`
            });
        });
};

// Display list of all topics with comments
exports.findAllCommented = async (req, res) => {
    try {
        let data = await Topic.findAll({
            include: {
                model: Comment, required: true,
                attributes: []
            }
        })
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({
            message:
                err.message || "Some error occurred while retrieving topics."
        });
    };
};