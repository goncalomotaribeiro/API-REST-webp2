// get resource model (definition and DB operations)
const Challenge= require('../models/challenges.model.js');

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
    Challenge.findById(req.params.challengeID,(err, data) => {
        if (err){
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

    if(Object.keys(req.query).length){
        if (!req.query.title) {
            res.status(400).json({message: "Challenges can only be filtered by title"})
            return
        }
    }

    Challenge.getAll(req.query.title, (err, data) => {
        if (err){
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

// // Delete a challenge
// exports.delete = (req, res) => {
//     Challenge.remove(req.params.challengeID,(err) => {
//         if (err){
//             if (err.kind === "not_found") {
//                 res.status(404).send({
//                     message: `Not found Challenge with id ${req.params.challengeID}`
//                 });
//             }
//             else
//                 res.status(500).send({
//                     message: `Error retrieving Challenge with id ${req.params.challengeID}`
//                 });
//         } 
//         else
//             res.status(200).json({message: `Deleted with success`});
//     });
// };


// // Create a tutorial
// exports.create = (req, res) => {

//     if(!req.body || !req.body.title){
//         res.status(400).json({message: "Title can not be empty!"})
//         return
//     }

//     const tutorial = {
//         title: req.body.title,
//         description: req.body.description,
//         published: req.body.published ? req.body.published : false
//     }

//     Tutorial.create(tutorial, (err) => {
//         if (err){
//             if (err.kind === "not_found") {
//                 res.status(404).send({
//                     message: `Not found Tutorial with id ${req.params.tutorialID}`
//                 });
//             }
//             else
//                 res.status(500).send({
//                     message: `Error retrieving Tutorial with id ${req.params.tutorialID}`
//                 });
//         } 
//         else
//             res.status(200).json({message: `Created with success`});
//     });
// };

// // Update a tutorial
// exports.update = (req, res) => {

//     if(!req.body || !req.body.title){
//         res.status(400).json({message: "Request can not be empty!"})
//         return
//     }

//     const tutorial = {
//         title: req.body.title,
//         description: req.body.description,
//         published: req.body.published ? req.body.published : false
//     }

//     Tutorial.updateById(req.params.tutorialID, tutorial,(err) => {
//         if (err){
//             if (err.kind === "not_found") {
//                 res.status(404).send({
//                     message: `Not found Tutorial with id ${req.params.tutorialID}`
//                 });
//             }
//             else
//                 res.status(500).send({
//                     message: `Error retrieving Tutorial with id ${req.params.tutorialID}`
//                 });
//         } 
//         else
//             res.status(200).json({message: `Updated tutorial`});
//     });
// };


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

