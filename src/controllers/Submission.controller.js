const db = require("../models/index.js");
const Submission = db.submission;

const getPagination = (page, size) => {
    const limit = size ? parseInt(size) : 3; // limit = size (default is 3)
    const offset = page ? parseInt(page) * limit : 0; // offset = page * size (start counting from page 0)
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    // data from findAndCountAll function as the form
    // {
    //     count: 5,
    //     rows: [
    //              tutorial {...}
    //         ]
    // }
    const totalItems = data.count; 
    const tutorials = data.rows;
    const currentPage = page ;
    const totalPages = Math.ceil(totalItems / limit);
 
    return { totalItems, tutorials, totalPages, currentPage };
};

// Display list of all submissions
exports.findAll = (req, res) => {

    const { page, size, title } = req.query;
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    const { limit, offset } = getPagination(page, size);

    Submission.findAndCountAll({attributes: ['url', 'date', 'id_user', 'id_challenge']
        , where: condition, limit, offset})

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
    Submission.create({
        url: req.body.url, date: req.body.date, 
        id_user: req.body.id_user, id_challenge: req.params.challengeID
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
    Submission.findByPk(req.params.submissionID)
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
exports.update = (req, res) => {
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
};

// Delete one submission
exports.delete = (req, res) => {
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
};

// // Display list of all published tutorials
// exports.findAllPublished = (req, res) => {

//     const { page, size, title } = req.query;
//     const { limit, offset } = getPagination(page, size);
//     Tutorial.findAndCountAll({ where: {published: true}, limit, offset })
//         .then(data => {
//             const response = getPagingData(data, page, limit);
//             res.status(200).json(response);
//         })
//         .catch(err => {
//             res.status(500).json({
//                 message:
//                     err.message || "Some error occurred while retrieving tutorials."
//             });
//         });
// };