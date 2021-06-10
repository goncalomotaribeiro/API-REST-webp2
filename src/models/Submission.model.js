module.exports = (sequelize, DataTypes) => {
    const Submission = sequelize.define("submission", {
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Url can not be empty!" } }
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: { notNull: { msg: "Date can not be empty!" } }
        },
        classification: {
            type: DataTypes.INTEGER,
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: { msg: "User can not be empty!" } }
        }
    }, {
        timestamps: false
    });
    return Submission;
};