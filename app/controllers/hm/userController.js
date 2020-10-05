"use strict";
const HELPERS = require("../../helpers");
const { MESSAGES, ERROR_TYPES, NORMAL_PROJECTION, OPERATION_TYPES, SOCKET_EVENTS, SOCKET_EVENTS_TYPES } = require('../../utils/constants');
const SERVICES = require('../../services');
const { compareHash, encryptJwt, createResetPasswordLink, createAccountRestoreLink, sendEmail } = require(`../../utils/utils`);

/**************************************************
 ***** Auth controller for authentication logic ***
 **************************************************/
let userController = {};

/**
 * function to get server response.
 */

userController.getServerResponse = async (payload) => {
  return HELPERS.responseHelper.createSuccessResponse(MESSAGES.SERVER_IS_WORKING_FINE);

};

/**
 * function to register a user to the system.
 */
userController.registerNewUser = async (payload) => {
  let isUserAlreadyExists = await SERVICES.userService.getUser({ email: payload.email }, { _id: 1 });
  if (!!isUserAlreadyExists) throw HELPERS.responseHelper.createErrorResponse(MESSAGES.EMAIL_ALREADY_EXISTS, ERROR_TYPES.BAD_REQUEST);
  let newRegisteredUser = (await SERVICES.userService.createUser(payload))._doc;
  delete newRegisteredUser.password;
  return Object.assign(HELPERS.responseHelper.createSuccessResponse(MESSAGES.USER_REGISTERED_SUCCESSFULLY), { user: newRegisteredUser });
};

/**
 * function to login a user to the system.
 */
userController.loginUser = async (payload) => {
  // check is user exists in the database with provided email or not.
  let user = await SERVICES.userService.getUser({ email: payload.email }, NORMAL_PROJECTION);
  if (user) {
    // compare user's password.
    if (compareHash(payload.password, user.password)) {
      const dataForJwt = { id: user._id, date: Date.now() };
      return Object.assign(HELPERS.responseHelper.createSuccessResponse(MESSAGES.LOGGED_IN_SUCCESSFULLY), { token: encryptJwt(dataForJwt) });
    }
    throw HELPERS.responseHelper.createErrorResponse(MESSAGES.INVALID_PASSWORD, ERROR_TYPES.BAD_REQUEST);
  }
  throw HELPERS.responseHelper.createErrorResponse(MESSAGES.INVALID_EMAIL, ERROR_TYPES.BAD_REQUEST);
};


/**
 * function to create and update user based on the operation type. 
 */
userController.createAndUpdateUser = async (payload) => {
  let criteria = { email: payload.email, isDeleted: false }, dataToUpdate = payload;
  if (payload.operationType === OPERATION_TYPES.DELETE) {
    dataToUpdate = { $set: { isDeleted: true } };
  }
  let user = await SERVICES.userService.updateUser(criteria, dataToUpdate, { new: true, upsert: true });
  return Object.assign(HELPERS.responseHelper.createSuccessResponse(MESSAGES.USER_UPDATED_SUCCESSFULLY), { data: user });
};

/**
 * function to upload the file to the s3 
 * @param {*} payload 
 */
userController.uploadFile = async (payload) => {
  let fileUrl = await SERVICES.fileUploadService.uploadFileToS3(payload, payload.file.originalname);
  return Object.assign(HELPERS.responseHelper.createSuccessResponse(MESSAGES.FILE_UPLOADED_SUCCESSFULLY), { fileUrl })
}

/* export userController */
module.exports = userController;