"use strict";
const HELPERS = require("../../helpers");
const { MESSAGES, ERROR_TYPES, NORMAL_PROJECTION, OPERATION_TYPES, SOCKET_EVENTS, SOCKET_EVENTS_TYPES } = require('../../utils/constants');
const SERVICES = require('../../services');
const { compareHash, encryptJwt, createResetPasswordLink, sendEmail, decryptJwt, hashPassword } = require(`../../utils/utils`);

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
  const dataForJwt = { id: newRegisteredUser._id, date: Date.now() };
  newRegisteredUser.token = encryptJwt(dataForJwt);
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
      delete user.password;
      user.token = encryptJwt(dataForJwt);
      return Object.assign(HELPERS.responseHelper.createSuccessResponse(MESSAGES.LOGGED_IN_SUCCESSFULLY), { user });
    }
    throw HELPERS.responseHelper.createErrorResponse(MESSAGES.INVALID_PASSWORD, ERROR_TYPES.BAD_REQUEST);
  }
  throw HELPERS.responseHelper.createErrorResponse(MESSAGES.INVALID_EMAIL, ERROR_TYPES.BAD_REQUEST);
};


/**
 * funciton to send a link to registered email of an user who forgots his password.
 */
userController.forgotPassword = async (payload) => {
  let requiredUser = await SERVICES.userService.getUser({ email: payload.email }, { _id: 1, email: 1 });
  if (requiredUser) {
    // create reset-password link.
    let { resetPasswordLink, resetPasswordToken } = createResetPasswordLink(requiredUser);
    let updatedUser = await SERVICES.userService.updateUser({ _id: requiredUser._id }, { resetPasswordToken });
    // send forgot-password email to user.
    let data = { email: updatedUser.email, resetPasswordLink }
    console.log(data);
    // await sendEmail(data, EMAIL_TYPES.FORGOT_PASSWORD_EMAIL);
    return HELPERS.responseHelper.createSuccessResponse(MESSAGES.EMAIL_SENT_TO_REGISTERED_EMAIL_WITH_RESET_PASSWORD_LINK);
  }
  throw HELPERS.responseHelper.createErrorResponse(MESSAGES.NO_USER_FOUND, ERROR_TYPES.BAD_REQUEST);
};

/**
 * verify otp for phone verification and forgot password
 * @param {object} requiredUser
 * @param {string} otp
 * @returns
 */
userController.resetPassword = async (payload) => {

  let { email } = decryptJwt(payload.token);
  let requiredUser = await SERVICES.userService.getUser({ email }, { resetPasswordToken: 1 });
  console.log(requiredUser.resetPasswordToken);
  if (requiredUser && (payload.token == requiredUser.resetPasswordToken) /*&&  (new Date() > new Date(expiresAt))*/) {
    await SERVICES.userService.updateUser({ email }, { $unset: { resetPasswordToken: 1 }, password: hashPassword(payload.password) });
    return HELPERS.responseHelper.createSuccessResponse(MESSAGES.PASSWORD_RESET_SUCCESSFULLY);
  }
  throw HELPERS.responseHelper.createErrorResponse(MESSAGES.INVALID_CREDENTIALS, ERROR_TYPES.BAD_REQUEST);

}

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