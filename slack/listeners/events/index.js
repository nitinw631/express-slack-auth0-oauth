const { appHomeOpenedCallback } = require('./home');

module.exports.register = (app) => {
  app.event('app_home_opened', appHomeOpenedCallback);
};