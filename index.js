const Config = require('./lib/config');
const DBUtils = require('./lib/db-utils');
const ErrorUtils = require('./lib/error-utils');
const ObjUtils = require('./lib/obj-utils');

module.exports = {
  initialize: Config.initialize,
  initializeAsAdmin: Config.initializeAsAdmin,

  DBUtils,
  ErrorUtils,
  ObjUtils,
};
