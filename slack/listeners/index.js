// const shortcutsListener = require('./shortcuts');
// const viewsListener = require('./views');
// const actionsListener = require('./actions');
const eventsListener = require('./events');

module.exports.registerListeners = (app) => {
  // shortcutsListener.register(app);
  // viewsListener.register(app);
  // actionsListener.register(app);
  eventsListener.register(app);
};