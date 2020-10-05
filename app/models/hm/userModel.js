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
    firstName: { type: String },
    lastName: { type: String },
    userName: { type: String },
    contactNumber: { type: String },
    email: { type: String },
    password: { type: String },
    isDeleted: { type: Boolean, default: false },
    role: { type: Number, enum: [USER_ROLE.ADMIN, USER_ROLE.USER] }
});

userSchema.set('timestamps', true);

// pre-hook to encrypt user's password and store it in the database.
userSchema.pre('save', async function (next) {
    this.password = hashPassword(this.password);
    next();
});

module.exports = MONGOOSE.model('user', userSchema);



