'use strict';
const CONFIG = require('../../config');
/********************************
 **** Managing all the models ***
 ********* independently ********
 ********************************/
module.exports = {
    userModel: require(`../models/hm/userModel`),
    versionModel: require(`../models/hm/versionModel`)
};