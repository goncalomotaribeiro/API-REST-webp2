const dbConfig = require('../config/db.config.js');

//export classes Sequelize and Datatypes
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST, 
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

//optional, test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


const db = {};
db.sequelize = sequelize;

//export User model
db.user = require("./User.model.js")(sequelize, DataTypes);

//export Challenge model
db.challenge = require("./Challenge.model.js")(sequelize, DataTypes);

//export Submission model
db.submission = require("./Submission.model.js")(sequelize, DataTypes);

//export Event model
db.event = require("./Event.model.js")(sequelize, DataTypes);

//export Topic model
db.topic = require("./Topic.model.js")(sequelize, DataTypes);

//export Comment model
db.comment = require("./Comment.model.js")(sequelize, DataTypes);

db.challenge.hasMany(db.submission, {foreignKey: 'id_challenge'});
db.submission.belongsTo(db.challenge, {foreignKey: 'id_challenge'})

db.user.hasMany(db.submission, {foreignKey: 'id_user'});
db.submission.belongsTo(db.user, {foreignKey: 'id_user'})

db.topic.hasMany(db.comment, {foreignKey: 'id_topic'});
db.comment.belongsTo(db.topic, {foreignKey: 'id_topic'})

module.exports = db;