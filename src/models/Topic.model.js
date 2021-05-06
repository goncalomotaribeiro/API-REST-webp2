module.exports = (sequelize, DataTypes) => {
    const Topic = sequelize.define("topic", {
        title: {
            type: DataTypes.STRING,
        },
        text: {
            type: DataTypes.STRING
        },
        // img: {
        //     type: DataTypes.STRING
        // },
        date: {
            type: DataTypes.DATE
        },
        id_user: {
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
    return Topic;
};
