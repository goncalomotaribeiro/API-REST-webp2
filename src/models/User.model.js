module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        username: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        biography: {
            type: DataTypes.STRING
        },
        location: {
            type: DataTypes.STRING
        },
        url: {
            type: DataTypes.STRING
        },
        // profile_picture: {
        //     type: DataTypes.BLOB
        // },
        id_school: {
            type: DataTypes.INTEGER
        },
        id_type: {
            type: DataTypes.INTEGER,
        },
        id_level: {
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: false
    });
    return User;
};
