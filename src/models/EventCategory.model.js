module.exports = (sequelize, DataTypes) => {
    const EventCategory = sequelize.define("event_category", {
        category: {
            type: DataTypes.STRING
        }
    },
    {
        timestamps: false
    });
    return EventCategory;
};