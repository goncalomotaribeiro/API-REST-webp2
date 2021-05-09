const db = require("../models/index.js");
const Comment = db.comment;
const { Op } = require('sequelize')
const User = db.user
const Topic = db.topic

const getPagination = (page, size) => {
    const limit = size ? parseInt(size) : 3; // limit = size (default is 3)
    const offset = page ? parseInt(page) * limit : 0; // offset = page * size (start counting from page 0)
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const totalItems = data.count; 
    const comments = data.rows;
    const currentPage = page ;
    const totalPages = Math.ceil(totalItems / limit);
 
    return { totalItems, comments, totalPages, currentPage };
};

// Display list of all comments
exports.findAll = (req, res) => {

    let { page, size, id_user } = req.query;
    let condition
    if(id_user && req.params.topicID){
        condition = {[Op.and]: [ {id_user: id_user}, {id_topic: req.params.topicID}]}
    }else if(id_user){
        condition =  {id_user: id_user}
    }else if(req.params.topicID){
        condition = { id_topic: { [Op.eq]: req.params.topicID } }
    }
    else{condition = null}

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

    Comment.findAndCountAll({attributes: ['id','comment', 'date'], where: condition, limit, offset, 
    include: [
        {
            model: User, attributes: ["id", "username", "email"]
        },
        {
            model: Topic, attributes: ["id", "title"]
        }
    ]})

        .then(data => {
            const response = getPagingData(data, page, limit);
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving comments."
            });
        });
};

// Create one comment
exports.createComment = async (req, res) => {
    Comment.create({
        comment: req.body.comment, date: req.body.date, 
        id_user: req.body.id_user, id_topic: req.params.topicID
    })
        .then(data => {
            res.status(201).json({
                message: "New comment created.", location: "/topics/" +
                    req.params.topicID + "/comments/" + data.id
            });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the comment."
                });
        });
};

// List just one comment
exports.findOne = (req, res) => {
    Comment.findByPk(req.params.commentID)
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found comment with id ${req.params.commentID}.`
                });
            else
                res.json(data); 
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving comment with id ${req.params.commentID}.`
            });
        });
};

// Update one comment
exports.update = (req, res) => {
    Comment.update(req.body, { where: { id: req.params.commentID } })
        .then(num => {

            if (num == 1) {
                res.json({
                    message: `Comment with id=${req.params.commentID} was updated successfully.`
                });
            } else {
                res.status(404).json({
                    message: `Not found comment with id=${req.params.commentID}.`
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `Error updating comment with id=${req.params.id}.`
            });
        });
};

// Delete one comment
exports.delete = (req, res) => {
    Comment.destroy({ where: { id: req.params.commentID } })
        .then(num => {
            if (num == 1) {
                res.status(200).json({
                    message: `Comment with id ${req.params.commentID} was successfully deleted!`
                });
            } else {
                res.status(404).json({
                    message: `Not found comment with id=${req.params.commentID}.`
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `Error deleting comment with id=${req.params.commentID}.`
            });
        });
};