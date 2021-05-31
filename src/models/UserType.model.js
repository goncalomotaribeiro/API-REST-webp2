module.exports = (sequelize, DataTypes) => {
    const UserType = sequelize.define("user_type", {
        type: {
            type: DataTypes.STRING
        }
    },
    {
        timestamps: false
    });
    return UserType;
};