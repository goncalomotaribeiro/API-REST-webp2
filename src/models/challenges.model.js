module.exports = (sequelize, DataTypes) => {
    const Challenge = sequelize.define("challenge", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Title can not be empty!" } }
        },
        description: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false
    });
    return Challenge;
};
