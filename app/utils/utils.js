let CONSTANTS = require('./constants');
const MONGOOSE = require('mongoose');
const BCRYPT = require("bcrypt");
const JWT = require("jsonwebtoken");
const HANDLEBARS = require('handlebars');

const CONFIG = require('../../config');

const AWS = require('aws-sdk');
AWS.config.update({ accessKeyId: CONFIG.AWS.accessKeyId, secretAccessKey: CONFIG.AWS.secretAccessKey , region: CONFIG.AWS.region});
var ses = new AWS.SES();


let commonFunctions = {};

/**
 * incrypt password in case user login implementation
 * @param {*} payloadString 
 */
commonFunctions.hashPassword = (payloadString) => {
  return BCRYPT.hashSync(payloadString, CONSTANTS.SECURITY.BCRYPT_SALT);
};

/**
 * @param {string} plainText 
 * @param {string} hash 
 */
commonFunctions.compareHash = (payloadPassword, userPassword) => {
  return BCRYPT.compareSync(payloadPassword, userPassword);
};

/**
 * function to get array of key-values by using key name of the object.
 */
commonFunctions.getEnumArray = (obj) => {
  return Object.keys(obj).map(key => obj[key]);
};

/** used for converting string id to mongoose object id */
commonFunctions.convertIdToMongooseId = (stringId) => {
  return MONGOOSE.Types.ObjectId(stringId);
};

/** create jsonwebtoken **/
commonFunctions.encryptJwt = (payload) => {
  let token = JWT.sign(payload, CONSTANTS.SECURITY.JWT_SIGN_KEY, { algorithm: 'HS256' });
  return token;
};

commonFunctions.decryptJwt = (token) => {
  return JWT.verify(token, CONSTANTS.SECURITY.JWT_SIGN_KEY, { algorithm: 'HS256' })
}

/**
 * function to convert an error into a readable form.
 * @param {} error 
 */
commonFunctions.convertErrorIntoReadableForm = (error) => {
  let errorMessage = '';
  if (error.message.indexOf("[") > -1) {
    errorMessage = error.message.substr(error.message.indexOf("["));
  } else {
    errorMessage = error.message;
  }
  errorMessage = errorMessage.replace(/"/g, '');
  errorMessage = errorMessage.replace('[', '');
  errorMessage = errorMessage.replace(']', '');
  error.message = errorMessage;
  return error;
};

/***************************************
 **** Logger for error and success *****
 ***************************************/
commonFunctions.messageLogs = (error, success) => {
  if (error)
    console.log(`\x1b[31m` + error);
  else
    console.log(`\x1b[32m` + success);
};

/**
 * function to get pagination condition for aggregate query.
 * @param {*} sort 
 * @param {*} skip 
 * @param {*} limit 
 */
commonFunctions.getPaginationConditionForAggregate = (sort, skip, limit) => {
  let condition = [
    ...(!!sort ? [{ $sort: sort }] : []),
    { $skip: skip },
    { $limit: limit }
  ];
  return condition;
};

/**
 * function to remove undefined keys from the payload.
 * @param {*} payload 
 */
commonFunctions.removeUndefinedKeysFromPayload = (payload = {}) => {
  for (let key in payload) {
    if (!payload[key]) {
      delete payload[key];
    }
  }
};

// /**
//  * Send an email to perticular user mail 
//  * @param {*} email email address
//  * @param {*} subject  subject
//  * @param {*} content content
//  * @param {*} cb callback
//  */
// commonFunctions.sendEmail = async (userData, type) => {
//   const transporter = require('nodemailer').createTransport(CONFIG.SMTP.TRANSPORT);
//   /** setup email data with unicode symbols **/
//   const mailData = commonFunctions.emailTypes(userData, type), email = userData.email;
//   let template = handleBars.compile(mailData.template);

//   let result = template(mailData.data);

//   let emailToSend = {
//     to: email,
//     from: CONFIG.SMTP.SENDER,
//     subject: mailData.Subject,
//     html: result
//   }
//   return await transporter.sendMail(emailToSend);
// };


commonFunctions.emailTypes = (user, type) => {
  let EmailData = {
    Subject: '',
    data: {},
    template: ''
  };
  switch (type) {
    case CONSTANTS.EMAIL_TYPES.FORGOT_PASSWORD_EMAIL:
      EmailData['Subject'] = CONSTANTS.EMAIL_SUBJECTS.FORGOT_PASSWORD_EMAIL;
      EmailData.template = CONSTANTS.EMAIL_CONTENTS.FORGOT_PASSWORD_EMAIL;
      EmailData.data['token'] = user.token;
      break;
    case CONSTANTS.EMAIL_TYPES.EMAIL_VERIFICATION_EMAIL:
      EmailData['Subject'] = CONSTANTS.EMAIL_SUBJECTS.EMAIL_VERIFICATION_EMAIL;
      EmailData.template = CONSTANTS.EMAIL_CONTENTS.EMAIL_VERIFICATION_EMAIL;
      EmailData.data['token'] = user.token;
      break;
    case CONSTANTS.EMAIL_TYPES.LOGIN_VERIFICATION_EMAIL:
      EmailData['Subject'] = CONSTANTS.EMAIL_SUBJECTS.LOGIN_VERIFICATION_EMAIL;
      EmailData.template = CONSTANTS.EMAIL_CONTENTS.LOGIN_VERIFICATION_EMAIL;
      EmailData.data['token'] = user.token;
      break;
    case CONSTANTS.EMAIL_TYPES.ACCOUNT_RESTORATION_EMAIL:
      EmailData['Subject'] = CONSTANTS.EMAIL_SUBJECTS.ACCOUNT_RESTORATION_EMAIL;
      EmailData.template = CONSTANTS.EMAIL_CONTENTS.ACCOUNT_RESTORATION_EMAIL;
      EmailData.data['name'] = user.userName;
      EmailData.data['confirmationLink'] = user.confirmationLink;
      break;
    default:
      EmailData['Subject'] = 'Welcome Email!';
      break;
  }
  return EmailData;
};

commonFunctions.renderTemplate = (template, data) => {
  return HANDLEBARS.compile(template)(data);
};

/**
 * function to create reset password link.
 */
commonFunctions.createResetPasswordLink = (userData) => {
  let dataForJWT = { _id: userData._id, Date: Date.now, email: userData.email };
  let resetPasswordLink = CONFIG.SERVER_URL + '/v1/user/resetpassword/' + commonFunctions.encryptJwt(dataForJWT);
  return resetPasswordLink;
};

/**
 * function to create reset password link.
 */
commonFunctions.createResetPasswordLink = (userData) => {
  let dataForJWT = { _id: userData._id, Date: Date.now, email: userData.email };
  let resetPasswordToken = commonFunctions.encryptJwt(dataForJWT);
  let resetPasswordLink = CONFIG.UI_PATHS.BASE_PATH + CONFIG.UI_PATHS.RESET_PASSWORD_PATH + resetPasswordToken;
  return { resetPasswordLink, resetPasswordToken };
};

/**
 * function to generate random alphanumeric string
 */
commonFunctions.generateAlphanumericString = (length) => {
  let chracters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var randomString = '';
  for (var i = length; i > 0; --i) randomString += chracters[Math.floor(Math.random() * chracters.length)];
  return randomString;
};
 
/**
 * function to generate random otp
 */
commonFunctions.generateOtp = (length) => {
  let chracters = '0123456789';
  var randomString = '';
  for (var i = length; i > 0; --i) randomString += chracters[Math.floor(Math.random() * chracters.length)];
  return randomString;
};

/**
 * Send an email to perticular user mail 
 * @param {*} email email address
 * @param {*} subject  subject
 * @param {*} content content
 * @param {*} cb callback
 */
commonFunctions.sendEmail = async (userData, type) => {
  const mailData = commonFunctions.emailTypes(userData, type), email = userData.email;
  let template = HANDLEBARS.compile(mailData.template);
  let result = template(mailData.data);
  var params = {
    Destination: { ToAddresses: [email] },
    Message: {
      Body: {
        Html: {
          Data: result,
          Charset: "UTF-8"
        },
        Text: {
          Data: 'Hello demo',
          Charset: "UTF-8",
        }
      },
      Subject: { Data: mailData.Subject }
    },
    Source: CONFIG.AWS.senderEmail,
  };

  ses.sendEmail(params).promise()
    .then(data => {
      console.log("email submitted to SES", data);
    })
    .catch(error => {
      console.log(error);
    });
};

module.exports = commonFunctions;

