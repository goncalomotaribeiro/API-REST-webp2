module.exports = (sequelize, DataTypes) => {
    const State = sequelize.define("state", {
        state: {
            type: DataTypes.STRING
        }
    },
    {
        timestamps: false
    });
    return State;
};