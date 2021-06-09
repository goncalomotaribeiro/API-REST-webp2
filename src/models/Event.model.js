module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("event", {
        title: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING
        },
        edition: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.DATE
        },
        img: {
            type: DataTypes.BLOB
        },
        url: {
            type: DataTypes.STRING
        },
        id_user: {
            type: DataTypes.INTEGER
        },
        id_area: {
            type: DataTypes.INTEGER
        },
        id_category: {
            type: DataTypes.INTEGER
        },
        id_state: {
            type: DataTypes.INTEGER
        },
    }, {
        timestamps: false
    });
    return Event;
};
