module.exports = (sequelize, DataTypes) => {
    const ScientificArea = sequelize.define("scientific_area", {
        area: {
            type: DataTypes.STRING
        },
        color: {
            type: DataTypes.STRING
        }
    },
    {
        timestamps: false
    });
    return ScientificArea;
};