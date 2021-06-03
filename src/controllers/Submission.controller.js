const db = require("../models/index.js");
const Submission = db.submission;
const { Op } = require('sequelize')

const getPagination = (page, size) => {
    const limit = size ? parseInt(size) : 3; // limit = size (default is 3)
    const offset = page ? parseInt(page) * limit : 0; // offset = page * size (start counting from page 0)
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const totalItems = data.count;
    const submissions = data.rows;
    const currentPage = page;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, submissions, totalPages, currentPage };
};

// Display list of all submissions
exports.findAll = (req, res) => {

    let { page, size, id_user } = req.query;
    let condition
    if (id_user && req.params.challengeID) {
        condition = { [Op.and]: [{ id_user: id_user }, { id_challenge: req.params.challengeID }] }
    } else if (id_user) {
        condition = { id_user: id_user }
    } else if (req.params.challengeID) {
        condition = { id_challenge: { [Op.eq]: req.params.challengeID } }
    }
    else { condition = null }

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

    const { limit, offset } = getPagination(page, size);

    Submission.findAndCountAll({
        attributes: ['id', 'url', 'date', 'id_user', 'id_challenge']
        , where: condition, limit, offset
    })

        .then(data => {
            const response = getPagingData(data, page, limit);
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving submissions."
            });
        });
};

// Create one submission
exports.createSubmission = async (req, res) => {
    const submissions = await Submission.findAll();

    if (submissions.find(submission => submission.id == req.body.id && submission.id_user == req.body.id_user))
        return res.status(400).json({ message: 'Submission already assigned' });

    Submission.create({
        url: req.body.url, date: req.body.date,
        id_user: req.loggedUserId, id_challenge: req.params.challengeID
    })
        .then(data => {
            res.status(201).json({
                message: "New submission created.", location: "/challenges/" +
                    req.params.challengeID + "/submissions/" + data.id
            });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the submission."
                });
        });

};

// List just one submission
exports.findOne = (req, res) => {
    Submission.findByPk(req.params.submissionID, { attributes: ['id', 'url', 'date', 'id_user', 'id_challenge'] })
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found submission with id ${req.params.submissionID}.`
                });
            else
                res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving submission with id ${req.params.submissionID}.`
            });
        });
};

// Update one submission
exports.update = async (req, res) => {
    let submission = await Challenge.findOne({ where: { id: req.params.submissionID } })
    let user = await User.findOne({ where: { id: req.loggedUserId } })

    if (!submission)
        return res.status(404).json({ message: `Not found submission with id=${req.params.submissionID}.` });

    if (submission.id_user == req.loggedUserId || user.id_type == 1) {
        Submission.update(req.body, { where: { id: req.params.submissionID } })
            .then(num => {

                if (num == 1) {
                    res.json({
                        message: `Submission with id=${req.params.submissionID} was updated successfully.`
                    });
                } else {
                    res.status(404).json({
                        message: `Not found submission with id=${req.params.submissionID}.`
                    });
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: `Error updating submission with id=${req.params.id}.`
                });
            });
    } else {
        res.json({
            message: `Can't update submission.`
        });
    }
};

// Delete one submission
exports.delete = async (req, res) => {
    let submission = await Challenge.findOne({ where: { id: req.params.submissionID } })
    let user = await User.findOne({ where: { id: req.loggedUserId } })

    if (!submission)
        return res.status(404).json({ message: `Not found submission with id=${req.params.submissionID}.` });

    if (submission.id_user == req.loggedUserId || user.id_type == 1) {
        Submission.destroy({ where: { id: req.params.submissionID } })
            .then(num => {
                if (num == 1) {
                    res.status(200).json({
                        message: `Submission with id ${req.params.submissionID} was successfully deleted!`
                    });
                } else {
                    res.status(404).json({
                        message: `Not found submission with id=${req.params.submissionID}.`
                    });
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: `Error deleting submission with id=${req.params.submissionID}.`
                });
            });
    } else {
        res.json({
            message: `Can't delete submission.`
        });
    }
};