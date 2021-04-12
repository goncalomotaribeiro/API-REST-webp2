const sql = require("./db.js"); // get DB connection
// define TUTORIAL model constructor
const Tutorial = function (tutorial) {
    this.title = tutorial.email;
    this.description = tutorial.description;
    this.published = tutorial.published;
};

// define method getAll to handle getting all Tutorials from DB
// result = "(error, data)", meaning it will return either an error message or some sort of data
Tutorial.getAll = (title, result) => {

    let queryStr = "SELECT * FROM tutorials"

    if (title) {
        queryStr += " WHERE title LIKE ?"
    }
    sql.query(queryStr, [`%${title}%`], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length === 0) {
            result({kind: "not_found"}, null);
            return;
        }
        result(null, res); // the result will be sent to the CONTROLLER
    });
};


Tutorial.findById = (id, result) => {
    sql.query("SELECT * FROM tutorials WHERE id = ?", [id], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result({kind: "not_found"}, null);
    });
};


Tutorial.remove = (id, result) => {
    sql.query("DELETE FROM tutorials WHERE id = ?", [id], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.affectedRows != 0) {
            result(null, res);
            return;
        }
        result({kind: "not_found"}, null);
    });
};


Tutorial.create = (newTutorial, result) => {
    sql.query("INSERT INTO tutorials SET ?", newTutorial, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};


Tutorial.updateById = (id, tutorial, result) => {
    let query = 'UPDATE tutorials SET title=?, description=?, published=? WHERE id = ?'
    sql.query(
        query,
        [tutorial.title, tutorial.description, tutorial.published, id],
        (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            if (res.affectedRows == 0) {
                result({kind: "not_found"}, null);
                return;
            }
        result(null, res);
    });
};

Tutorial.getAllPublished = result => {
    sql.query("SELECT * FROM tutorials WHERE published = true", (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};

// EXPORT MODEL (required by CONTROLLER)
module.exports = Tutorial;