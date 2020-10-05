
const CONFIG = require('../../config');
/********************************
 **** Managing all the services ***
 ********* independently ********
 ********************************/
module.exports = {
    authService: require(`./hm/authService`),
    fileUploadService: require(`./hm/fileUploadService`),
    sessionService: require(`./hm/sessionService`),
    socketService: require(`./hm/socketService`),
    swaggerService: require(`./hm/swaggerService`),
    userService: require(`./hm/userService`),
};