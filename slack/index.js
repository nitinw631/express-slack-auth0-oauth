const { App, ExpressReceiver } = require('@slack/bolt');
const { registerListeners } = require('./listeners');

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});
const app = new App({
    token: process.env.SLACK_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    receiver,
});
registerListeners(app);

module.exports.slackReceiver = receiver;