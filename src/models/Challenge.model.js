module.exports = (sequelize, DataTypes) => {
    const Challenge = sequelize.define("challenge", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Title can not be empty!" } }
        },
        description: {
            type: DataTypes.STRING
        },
        date_ini: {
            type: DataTypes.DATE
        },
        date_end: {
            type: DataTypes.DATE
        },
        scheme: {
            type: DataTypes.STRING
        },
    }, {
        timestamps: false
    });
    return Challenge;
};
