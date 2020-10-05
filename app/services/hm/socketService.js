'use strict';
const userModel = require(`../../models/hm/userModel`);

let socketService = {};

/**
 * function to update user's socket id.
 */
socketService.updateUserSocketId = async (userId, socketId) => {
    return await userModel.findOneAndUpdate({ _id: userId }, { $set: { socketId } }, { new: true }).lean();
};

/**
 * function to remove user's socket id.
 */
socketService.removeUserSocketId = async (socketId) => {
    return await userModel.findOneAndUpdate({ socketId }, { $unset: { socketId: 1 } }, { new: true }).lean();
};

module.exports = socketService;