module.exports = (sequelize, DataTypes) => {
    const myEvent = sequelize.define("my_event", {
        id_user: {
            type: DataTypes.INTEGER
        },
        id_event: {
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: false
    });
    return myEvent;
};
