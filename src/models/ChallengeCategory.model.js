module.exports = (sequelize, DataTypes) => {
    const ChallengeCategory = sequelize.define("challenge_category", {
        category: {
            type: DataTypes.STRING
        }
    },
    {
        timestamps: false
    });
    return ChallengeCategory;
};