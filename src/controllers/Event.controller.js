const db = require('../models/index.js');
const Event = db.event;
const User = db.user
const ScientificArea = db.scientific_area
const EventCategory = db.event_category
const State = db.state

//necessary for LIKE operator
const { Op } = require('sequelize');

const getPagination = (page, size) => {
    const limit = size ? size : 3; // limit = size (default is 3)
    const offset = page ? page * limit : 0; // offset = page * size (start counting from page 0)
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const totalItems = data.count;
    const events = data.rows;
    const currentPage = page;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, events, totalPages, currentPage };
};

// Display all Events
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

    Event.findAndCountAll({
        attributes: ['id', 'title', 'description', 'edition', 'date', 'img', 'url', 'id_area', 'id_category'], where: condition, limit, offset,
        include: [
            {
                model: User, attributes: ["id", "username", "email"]
            },
            {
                model: ScientificArea
            },
            {
                model: EventCategory
            },
            {
                model: State
            }
        ]
    })
        .then(data => {
            const response = getPagingData(data, offset, limit);
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving events."
            });
        });
};

// Event creation
exports.create = async (req, res) => {

    // check duplicate event
    let event = await Event.findOne(
        {
            where: {
                [Op.and]: [
                    { title: req.body.title },
                    { edition: req.body.edition }
                ]
            }
        }
    );
    if (event)
        return res.status(400).json({ message: "Event already exists!" });

    Event.create({
        title: req.body.title,
        description: req.body.description,
        edition: req.body.edition,
        date: req.body.date,
        img: req.body.img,
        url: req.body.url,
        id_user: req.loggedUserId,
        id_area: req.body.id_area,
        id_category: req.body.id_category,
        id_state: req.body.id_state,
    })
        .then(data => {
            res.status(201).json({ message: "New event created.", location: "/events/" + data.id });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the Event."
                });
        });
};

// List just one Event
exports.findOne = (req, res) => {
    Event.findByPk(req.params.eventID, {
        attributes: ['id', 'title', 'description', 'edition', 'date', 'img', 'url', 'id_area', 'id_category'],
        include: [
            {
                model: User, attributes: ["id", "username", "email"]
            },
            {
                model: ScientificArea
            },
            {
                model: EventCategory
            },
            {
                model: State
            }
        ]
    })
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found event with id ${req.params.eventID}.`
                });
            else
                res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving event with id ${req.params.eventID}.`
            });
        });
};

// Update Event
exports.update = async (req, res) => {
    console.log(req.body);
    let event = await Event.findOne({ where: { id: req.params.eventID } })
    let user = await User.findOne({ where: { id: req.loggedUserId } })

    if (!event)
        return res.status(404).json({ message: `Not found event with id=${req.params.eventID}.` });

    if (event.id_user == req.loggedUserId || user.id_type == 1) {
        Event.update(req.body, { where: { id: req.params.eventID } })
            .then(num => {
                if (num == 1) {
                    res.json({
                        message: `Event with id=${req.params.eventID} was updated successfully.`
                    });
                } else {
                    res.status(404).json({
                        message: `Not found event with id=${req.params.eventID}.`
                    });
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: `Error updating event with id=${req.params.eventID}.`
                });
            });
    } else {
        res.json({
            message: `Can't update event.`
        });
    }
};

// Delete Event
exports.delete = async (req, res) => {
    let event = await Event.findOne({ where: { id: req.params.eventID } })
    let user = await User.findOne({ where: { id: req.loggedUserId } })

    if (!event)
        return res.status(404).json({ message: `Not found event with id=${req.params.eventID}.` });

    if (event.id_user == req.loggedUserId || user.id_type == 1) {
        Event.destroy({ where: { id: req.params.eventID } })
            .then(num => {
                if (num == 1) {
                    res.status(200).json({
                        message: `Event with id ${req.params.eventID} was successfully deleted!`
                    });
                } else {
                    res.status(404).json({
                        message: `Not found event with id=${req.params.eventID}.`
                    });
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: `Error deleting event with id=${req.params.eventID}.`
                });
            });
    } else {
        res.json({
            message: `Can't delete event.`
        });
    }
};