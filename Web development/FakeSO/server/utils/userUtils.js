const User = require('../models/User');

const updateUserReputation = async (userId, likes) => {
    try {
        const user = await User.findById(userId);
        if (user) {
            // Update reputation based on the number of upvotes
            const reputationIncrement = calculateReputationIncrement(likes);
            user.reputation += 5;
            console.log(user.reputation);
            await user.save();
        }
    } catch (error) {
        console.error("Error updating user reputation:", error);
    }
};

const updateUserReputationdown = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (user) {
            user.reputation -= 10;
            console.log(user.reputation);
            await user.save();
        }
    } catch (error) {
        console.error("Error updating user reputation:", error);
    }
};

const calculateReputationIncrement = (upvotes) => {
    const reputationIncrement = Math.floor(upvotes / 10);

    return reputationIncrement;
};

module.exports = {
    updateUserReputation, updateUserReputationdown
};
