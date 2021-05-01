module.exports = (sequelize, DataTypes) => {
    const Challenge = sequelize.define("challenge", {
        title: {
            type: DataTypes.STRING,
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
        img: {
            type: DataTypes.STRING
        },
        rules: {
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
    return Challenge;
};
