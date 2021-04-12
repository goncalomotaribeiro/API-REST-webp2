const sql = require("./db.js"); // get DB connection
// define CHALLENGE model constructor
const Challenge = function (challenge) {
    this.title = challenge.title;
    this.description = challenge.description;
    this.scientific_area = challenge.scientific_area;
    this.img = challenge.img;
    this.state = challenge.state;
    this.date = challenge.date;
};

// define method getAll to handle getting all Challenges from DB
// result = "(error, data)", meaning it will return either an error message or some sort of data
Challenge.getAll = (result) => {
    sql.query("SELECT * FROM challenges",(err, res) => {
        if(err) {
            result(err,null);
            return
        }
        result(null, res); //the result will be sent to the controller
    } )
};


Challenge.findById = (id, result) => {
    sql.query("SELECT * FROM  WHERE id_challenge = ?", [id], (err, res) => {
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


Challenge.remove = (id, result) => {
    sql.query("DELETE FROM challenges WHERE id = ?", [id], (err, res) => {
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


Challenge.create = (newChallenge, result) => {
    sql.query("INSERT INTO challenges SET ?", newChallenge, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};


Challenge.updateById = (id, challenge, result) => {
    let query = 'UPDATE challenges SET title=?, description=?, scientific_area=?, img=?, state=?, date=? WHERE id = ?'
    sql.query(
        query,
        [challenge.title, challenge.description, challenge.scientific_area, challenge.img, challenge.state, challenge.date, id],
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
module.exports = Tutorial;