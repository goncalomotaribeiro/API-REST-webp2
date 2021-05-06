module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("comment", {
        comment: {
            type: DataTypes.STRING,
        },
        date: {
            type: DataTypes.DATE,
        },
        id_user: {
            type: DataTypes.INTEGER,
        }
    }, {
        timestamps: false
    });
    return Comment;
};