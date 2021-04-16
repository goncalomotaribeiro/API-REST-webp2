// get resource model (definition and DB operations)
const Challenge = require('../models/challenges.model.js');

// EXPORT function to display list of all challenges (required by ROUTER)
exports.findAll = (req, res) => {
    Challenge.getAll((err, data) => {
        if (err) // send error response
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving challenges."
            });
        else
            res.status(200).json(data); // send OK response with all challenges data
    });
};


// List just one tutorial
exports.findOne = (req, res) => {
    Challenge.findById(req.params.challengeID, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Challenge with id ${req.params.challengeID}`
                });
            }
            else
                res.status(500).send({
                    message: `Error retrieving Challenge with id ${req.params.challengeID}`
                });
        }
        else
            res.status(200).json(data);
    });
};


// List all challenges with specific title
exports.findAll = (req, res) => {

    // if (Object.keys(req.query).length) {
    //     if (!req.query.title) {
    //         res.status(400).json({ message: "Challenges can only be filtered by title" })
    //         return
    //     }
    // }
    let attribute = Object.keys(req.query)[0];
    let value = Object.values(req.query)[0];

    Challenge.getAll(attribute, value, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found challenge with specified filter`
                });
            }
            else
                res.status(500).send({
                    message: err.message || `Some error occured while retrieving challenge`
                });
        }
        else
            res.status(200).json(data);
    });
};


// Update a challenge
exports.update = (req, res) => {

    // if(!req.body || !req.body.title){
    //     res.status(400).json({message: "Request can not be empty!"})
    //     return
    // }

    Challenge.updateById(req.params.challengeID, req.body, (err) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found challenge with id ${req.params.challengeID}`
                });
            }
            else
                res.status(500).send({
                    message: `Error retrieving challenge with id ${req.params.challengeID}`
                });
        }
        else
            res.status(200).json({ message: `Updated challenge` });
    });
};


// Delete a challenge
exports.delete = (req, res) => {
    Challenge.remove(req.params.challengeID, (err) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).json({
                    message: `Not found challenge with id ${req.params.challengeID}.`
                });
            } else {
                res.status(500).json({
                    message: `Could not delete challenge with id ${req.params.challengeID}.`
                });
            }
            return;
        }
        res.status(200).json({ message: `Challenge with id ${req.params.challengeID} was successfully deleted!` });
        res.status(204).json({}); //when using a status code 204, must send a NO CONTENT answer
    });
};


// Create a tutorial
exports.create = (req, res) => {

    if (!req.body || !req.body.title) {
        res.status(400).json({ message: "Title can not be empty!" })
        return
    }

    // Create a Tutorial object
    const challenge = {
        title: req.body.title,
        description: req.body.description,
        date_ini: req.body.date_ini,
        date_end: req.body.date_end,
        img: req.body.img,
        scheme: req.body.scheme,
        id_area: req.body.id_area,
        id_state: req.body.id_state,
    };

    // Save Challenge in the database
    Challenge.create(challenge, (err, data) => {
        if (err)
            res.status(500).json({
                message: err.message || "Some error occurred while creating the challenge."
            });
        else {
            // all is OK, send new tutorial ID in the response
            res.status(201).json({ message: "New challenge created.", location: "/challenges/" + data.insertId });
        }
    });
};


// // List all published tutorials
// exports.findAllPublished = (req, res) => {
//     Tutorial.getAllPublished((err, data) => {
//         if (err) // send error response
//             res.status(500).send({
//                 message: err.message || "Some error occurred while retrieving tutorials."
//             });
//         else
//             res.status(200).json(data); // send OK response with all tutorials data
//     });
// };

