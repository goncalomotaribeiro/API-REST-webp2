const db = require('../models/db.js');
const Challenge = db.challenge;

// Display list of all challenges
exports.findAll = (req, res) => {
    
    Challenge.findAll()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving challenges."
            });
        });
};

// Handle challenge creation on POST
exports.create = (req, res) => {

    // Save Challenge in the database (IF request body data is validated by Sequelize
    Challenge.create(req.body)
        .then(data => {
            res.status(201).json({ message: "New challenge created.", location: "/challenges/" + data.id });
        })
        .catch(err => {
            // Challenge model as validation for the title column (not null)
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the Challenge."
                });
        });
};

// List just one challenge
exports.findOne = (req, res) => {

    // Challenge.findById(req.params.challengeID, (err, data) => {
    //     if (err) {
    //         if (err.kind === "not_found")
    //             res.status(404).json({
    //                 message: `Not found Challenge with id ${req.params.challengeID}.`
    //             });
    //         else
    //             res.status(500).json({
    //                 message: `Error retrieving Challenge with id ${req.params.challengeID}.`
    //             });
    //     } else
    //         res.status(200).json(data); // all is OK, send response data back to client
    // });
};

exports.update = (req, res) => {
    // // Validate request
    // if (!req.body || !req.body.title) {
    //     res.status(400).json({ message: "Request must have specify the new title!" });
    //     return;
    // }

    // // Create a Challenge object
    // const challenge = {
    //     title: req.body.title,
    //     description: req.body.description,
    //     published: req.body.published ? req.body.published : false
    // };

    // // Update Challenge in the database
    // Challenge.updateById(req.params.challengeID, challenge, (err, data) => {
    //     if (err) {
    //         if (err.kind === "not_found") {
    //             res.status(404).json({
    //                 message: `Not found Challenge with id ${req.params.challengeID}.`
    //             });
    //         } else {
    //             res.status(500).json({
    //                 message: "Error updating Challenge with id " + req.params.challengeID
    //             });
    //         }
    //     } else res.status(200).json({ message: "Updated challenge.", location: `/challenges/${req.params.challengeID}` });
    // });
};

exports.delete = (req, res) => {
    // Challenge.remove(req.params.challengeID, (err, data) => {
    //     console.log(err, data)
    //     if (err) {
    //         if (err.kind === "not_found") {
    //             res.status(404).json({
    //                 message: `Not found Challenge with id ${req.params.challengeID}.`
    //             });
    //         } else {
    //             res.status(500).json({
    //                 message: `Could not delete Challenge with id ${req.params.challengeID}.`
    //             });
    //         }
    //         return;
    //     } 
    //     res.status(200).json({ message: `Challenge with id ${req.params.challengeID} was successfully deleted!` });
    //     // res.status(204).json({}); //when using a status code 204, must send a NO CONTENT answer
    // });
};

// Display list of all published challenges
exports.findAllPublished = (req, res) => {
    // Challenge.getAllPublished((err, data) => {
    //     if (err)
    //         res.status(500).send({
    //             message: err.message ||  "Some error occurred while retrieving challenges."
    //         });
    //     else {
    //         res.status(200).json(data); // all is OK, send response data back to client
    //     }
    // });
};