const sql = require("./db.js");

const Challenge = function (challenge) {
    this.title = challenge.title;
    this.description = challenge.description;
    this.date_ini = challenge.date_ini;
    this.date_end = challenge.date_end;
    this.img = challenge.img;
    this.scheme = challenge.scheme;
    this.id_area = challenge.id_area;
    this.id_state = challenge.id_state;
};

Challenge.getAll = (attribute, value, result) => {

    let queryStr = 'SELECT id_challenge, title, description, date_ini, date_end, scheme, area, state FROM challenge, scientific_area, state'
    + ' WHERE challenge.id_area = scientific_area.id_area AND challenge.id_state = state.id_state'

    if (value) {
        queryStr += ` AND ${attribute} LIKE ?`
    }
    console.log(value);
    sql.query(queryStr, [`%${value}%`], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length === 0) {
            result({kind: 'not_found'}, null);
            return;
        }
        result(null, res); // the result will be sent to the CONTROLLER
    });
};


Challenge.findById = (id, result) => {
    let queryStr = 'SELECT id_challenge, title, description, date_ini, date_end, scheme, area, state FROM challenge, scientific_area, state' +
    ' WHERE challenge.id_area = scientific_area.id_area AND challenge.id_state = state.id_state AND id_challenge = ?'
    sql.query(queryStr, [id], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result({kind: 'not_found'}, null);
    });
};


Challenge.updateById = (id, challenge, result) => {
    let query = 'UPDATE challenge SET ? WHERE ?'
    sql.query(
        query,
        [challenge, id],
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


Challenge.remove = (id, result) => {
    sql.query("DELETE FROM challenge WHERE id_challenge = ?", id, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, res);
    });
};


Challenge.create = (newChallenge, result) => {
    sql.query("INSERT INTO challenge SET ?", newChallenge, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};

// Tutorial.getAllPublished = result => {
//     sql.query("SELECT * FROM tutorials WHERE published = true", (err, res) => {
//         if (err) {
//             result(err, null);
//             return;
//         }
//         result(null, res);
//     });
// };

// EXPORT MODEL (required by CONTROLLER)
module.exports = Challenge;