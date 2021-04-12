// get resource model (definition and DB operations)
const Tutorial = require('../models/tutorials.model.js');

// EXPORT function to display list of all tutorials (required by ROUTER)
exports.findAll = (req, res) => {
    Tutorial.getAll((err, data) => {
        if (err) // send error response
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        else
            res.status(200).json(data); // send OK response with all tutorials data
    });
};


// List just one tutorial
exports.findOne = (req, res) => {
    Tutorial.findById(req.params.tutorialID,(err, data) => {
        if (err){
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Tutorial with id ${req.params.tutorialID}`
                });
            }
            else
                res.status(500).send({
                    message: `Error retrieving Tutorial with id ${req.params.tutorialID}`
                });
        } 
        else
            res.status(200).json(data);
    });
};


// Delete a tutorial
exports.delete = (req, res) => {
    Tutorial.remove(req.params.tutorialID,(err) => {
        if (err){
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Tutorial with id ${req.params.tutorialID}`
                });
            }
            else
                res.status(500).send({
                    message: `Error retrieving Tutorial with id ${req.params.tutorialID}`
                });
        } 
        else
            res.status(200).json({message: `Deleted with success`});
    });
};


// Create a tutorial
exports.create = (req, res) => {

    if(!req.body || !req.body.title){
        res.status(400).json({message: "Title can not be empty!"})
        return
    }

    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    }

    Tutorial.create(tutorial, (err) => {
        if (err){
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Tutorial with id ${req.params.tutorialID}`
                });
            }
            else
                res.status(500).send({
                    message: `Error retrieving Tutorial with id ${req.params.tutorialID}`
                });
        } 
        else
            res.status(200).json({message: `Created with success`});
    });
};

// Update a tutorial
exports.update = (req, res) => {

    if(!req.body || !req.body.title){
        res.status(400).json({message: "Request can not be empty!"})
        return
    }

    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    }

    Tutorial.updateById(req.params.tutorialID, tutorial,(err) => {
        if (err){
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Tutorial with id ${req.params.tutorialID}`
                });
            }
            else
                res.status(500).send({
                    message: `Error retrieving Tutorial with id ${req.params.tutorialID}`
                });
        } 
        else
            res.status(200).json({message: `Updated tutorial`});
    });
};


// List all published tutorials
exports.findAllPublished = (req, res) => {
    Tutorial.getAllPublished((err, data) => {
        if (err) // send error response
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        else
            res.status(200).json(data); // send OK response with all tutorials data
    });
};


// List all tutorials with specific title
exports.findAll = (req, res) => {

    if(Object.keys(req.query).length){
        if (!req.query.title) {
            res.status(400).json({message: "Tutorials can only be filtered by title"})
            return
        }
    }

    Tutorial.getAll(req.query.title, (err, data) => {
        if (err){
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Tutorial with specified filter`
                });
            }
            else
                res.status(500).send({
                    message: err.message || `Some error occured while retrieving tutorial`
                });
        } 
        else
            res.status(200).json(data);
    });
};