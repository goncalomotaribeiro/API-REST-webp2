const db = require('../models/index.js');
const MyEvent = db.my_event;
const User = db.user
const Event = db.event

//necessary for LIKE operator
const { Op } = require('sequelize');

const getPagination = (page, size) => {
    const limit = size ? parseInt(size) : 3; // limit = size (default is 3)
    const offset = page ? parseInt(page) * limit : 0; // offset = page * size (start counting from page 0)
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const totalItems = data.count;
    const my_events = data.rows;
    const currentPage = page;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, my_events, totalPages, currentPage };
};

// Display list of all my_events
exports.findAll = (req, res) => {

    let { page, size, id_event ,id_user } = req.query;
    let condition
    
    if (id_user && id_event) {
        condition = { [Op.and]: [{ id_user: id_user }, { id_event: id_event }] }
    } else if (id_user) {
        condition = { id_user: id_user }
    } else if (id_event) {
        condition = { id_event: { [Op.eq]: id_event } }
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

    MyEvent.findAndCountAll({
        attributes: ['id', 'id_user', 'id_event']
        , where: condition, limit, offset,
    })

    .then(data => {
        const response = getPagingData(data, page, limit);
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({
            message:
                err.message || "Some error occurred while retrieving my_events."
        });
    });
};

// MyEvent creation
exports.create = async (req, res) => {

    // check duplicate my_event
    let my_event = await MyEvent.findOne(
        {
            where: {
                [Op.and]: [
                    { id_user: req.loggedUserId },
                    { id_event: req.body.id_event }
                ]
            }
        }
    );
    if (my_event)
        return res.status(400).json({ message: "MyEvent already exists!" });

    MyEvent.create({
        id_user: req.loggedUserId,
        id_event: req.body.id_event
    })
        .then(data => {
            res.status(201).json({ message: "New my_event created.", location: "/my_events/" + data.id });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the MyEvent."
                });
        });
};

// List just one MyEvent
exports.findOne = (req, res) => {
    MyEvent.findByPk(req.params.my_eventID, {
        attributes: ['id', 'id_user', 'id_event'],
        include: [
            {
                model: User, attributes: ["id", "username", "email", "name", "id_type"]
            },
            {
                model: Event
            }
        ]
    })
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found my_event with id ${req.params.my_eventID}.`
                });
            else
                res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving my_event with id ${req.params.my_eventID}.`
            });
        });
};

// Delete MyEvent
exports.delete = async (req, res) => {
    MyEvent.destroy({ where: { id: req.params.myEventID } })
        .then(num => {
            if (num == 1) {
                res.status(200).json({
                    message: `MyEvent with id ${req.params.myEventID} was successfully deleted!`
                });
            } else {
                res.status(404).json({
                    message: `Not found my_event with id=${req.params.myEventID}.`
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `Error deleting my_event with id=${req.params.myEventID}.`
            });
        });
};