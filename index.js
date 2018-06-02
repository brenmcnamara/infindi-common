const Config = require('./lib/config');
const DBUtils = require('./lib/db-utils');

module.exports = {
  initialize: Config.initialize,
  initializeAsAdmin: Config.initializeAsAdmin,

  DBUtils,
};
