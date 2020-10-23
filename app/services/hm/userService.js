'use strict';
const { userModel } = require(`../../models`);

let userService = {};

/**
 * function to  create an activity.
 */
userService.createUser = async (user) => {
  return await new userModel(user).save();
};

/**
 * function to fetch user from the system based on criteria.
 */
userService.getUser = async (criteria, projection, options) => {
  if (options && options.instance) return await userModel.findOne(criteria, projection);
  return await userModel.findOne(criteria, projection).lean();
};

/**
 * function to update user. 
 */
userService.updateUser = async (criteria = {}, dataToUpdate = {}, options = {}) => {
  return await userModel.findOneAndUpdate(criteria, dataToUpdate, { ...options, useFindAndModify:true}).lean();
};

module.exports = userService;