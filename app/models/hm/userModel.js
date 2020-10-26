"use strict";
/************* Modules ***********/
const { USER_ROLE } = require('../../utils/constants')
const { hashPassword } = require(`../../utils/utils`);

const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;
/**************************************************
 ************* User Model or collection ***********
 **************************************************/
const userSchema = new Schema({
    userName: { type: String },
    email: { type: String },
    password: { type: String },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verficationToken: { type: String },
    resetPasswordToken: { type: String },
    loginToken: { type: String },
    role: { type: Number, enum: [USER_ROLE.ADMIN, USER_ROLE.USER] },
    resetPasswordToken: String
});

userSchema.set('timestamps', true);

// // pre-hook to encrypt user's password and store it in the database.
// userSchema.pre('save', async function (next) {
//     if(this.password) this.password = hashPassword(this.password);
//     next();
// });

module.exports = MONGOOSE.model('user', userSchema);



