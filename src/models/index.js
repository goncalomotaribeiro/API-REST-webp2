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

//export UserType model
db.user_type = require("./UserType.model.js")(sequelize, DataTypes);

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

//export ScientificArea model
db.scientific_area = require("./ScientificArea.model.js")(sequelize, DataTypes);

//export ChallengeCategory model
db.challenge_category = require("./ChallengeCategory.model.js")(sequelize, DataTypes);

//export EventCategory model
db.event_category = require("./EventCategory.model.js")(sequelize, DataTypes);

//export State model
db.state = require("./State.model.js")(sequelize, DataTypes);

//export MyEvent model
db.my_event = require("./MyEvent.model.js")(sequelize, DataTypes);


db.user_type.hasMany(db.user, {foreignKey: 'id_type'});
db.user.belongsTo(db.user_type, {foreignKey: 'id_type'})

db.user.hasMany(db.challenge, {foreignKey: 'id_user'});
db.challenge.belongsTo(db.user, {foreignKey: 'id_user'})

db.user.hasMany(db.event, {foreignKey: 'id_user'});
db.event.belongsTo(db.user, {foreignKey: 'id_user'})

db.user.hasMany(db.submission, {foreignKey: 'id_user'});
db.submission.belongsTo(db.user, {foreignKey: 'id_user'})

db.user.hasMany(db.topic, {foreignKey: 'id_user'});
db.topic.belongsTo(db.user, {foreignKey: 'id_user'})

db.user.hasMany(db.comment, {foreignKey: 'id_user'});
db.comment.belongsTo(db.user, {foreignKey: 'id_user'})

db.topic.hasMany(db.comment, {foreignKey: 'id_topic'});
db.comment.belongsTo(db.topic, {foreignKey: 'id_topic'})

db.challenge.hasMany(db.submission, {foreignKey: 'id_challenge'});
db.submission.belongsTo(db.challenge, {foreignKey: 'id_challenge'})

db.scientific_area.hasMany(db.challenge, {foreignKey: 'id_area'});
db.challenge.belongsTo(db.scientific_area, {foreignKey: 'id_area'})

db.state.hasMany(db.challenge, {foreignKey: 'id_state'});
db.challenge.belongsTo(db.state, {foreignKey: 'id_state'})

db.challenge_category.hasMany(db.challenge, {foreignKey: 'id_category'});
db.challenge.belongsTo(db.challenge_category, {foreignKey: 'id_category'})

db.scientific_area.hasMany(db.event, {foreignKey: 'id_area'});
db.event.belongsTo(db.scientific_area, {foreignKey: 'id_area'})

db.state.hasMany(db.event, {foreignKey: 'id_state'});
db.event.belongsTo(db.state, {foreignKey: 'id_state'})

db.event_category.hasMany(db.event, {foreignKey: 'id_category'});
db.event.belongsTo(db.event_category, {foreignKey: 'id_category'})

module.exports = db;