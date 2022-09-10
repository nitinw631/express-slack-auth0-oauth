const { App, ExpressReceiver } = require('@slack/bolt');
const { registerListeners } = require('./listeners');
const database = require("../database/db");

var express = require('express');
var router = express.Router();

// const routes = require('./routes/router');
// var slackReceiver = require('./routes/receiver');


database.connect();

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: process.env.STATE_SECRET,
  scope:[process.env.BOT_SCOPE],
  user_scope:[process.env.BOT_SCOPE],
});
const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: process.env.STATE_SECRET,
  receiver,
  installerOptions: {
    stateVerification: false,
  },
  scope:[process.env.BOT_SCOPE],
  user_scope:[process.env.BOT_SCOPE],
  installationStore: {
    storeInstallation: async (installation) => {
      console.log('storeInstallation');
      // Bolt will pass your handler an installation object
      // Change the lines below so they save to your database
      if (installation.isEnterpriseInstall && installation.enterprise !== undefined) {
        // handle storing org-wide app installation
        return await orgInstall.saveUserOrgInstall(installation);
      }
      if (installation.team !== undefined) {
        // single team app installation
        return await workspaceAuth.saveUserWorkspaceInstall(installation);
      }
      throw new Error('Failed saving installation data to installationStore');
    },
    fetchInstallation: async (installQuery) => {
      console.log('fetchInstallation');
      // Bolt will pass your handler an installQuery object
      // Change the lines below so they fetch from your database
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
        // handle org wide app installation lookup
        return await database.findUser(installQuery.enterpriseId);
      }
      if (installQuery.teamId !== undefined) {
        // single team app installation lookup
        return await database.findUser(installQuery.teamId);
      }
      throw new Error('Failed fetching installation');
    },
    deleteInstallation: async (installQuery) => {
      console.log('deleteInstallation');
      // Bolt will pass your handler  an installQuery object
      // Change the lines below so they delete from your database
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
        // org wide app installation deletion
        return await database.delete(installQuery.enterpriseId);
      }
      if (installQuery.teamId !== undefined) {
        // single team app installation deletion
        return await database.delete(installQuery.teamId);
      }
      throw new Error('Failed to delete installation');
    },
  },
});
registerListeners(app);

// workspaceInstallHtml = ` <a href='https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=${process.env.BOT_SCOPE}&redirect_uri=${oauthRedirect}' style='align-items:center;color:#fff;background-color:#4A154B;border:0;border-radius:4px;display:inline-flex;font-family:Lato,sans-serif;font-size:40px;font-weight:600;height:112px;justify-content:center;text-decoration:none;width:552px'><svg xmlns='http://www.w3.org/2000/svg' style='height:48px;width:48px;margin-right:12px' viewBox='0 0 122.8 122.8'><path d='M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z' fill='#e01e5a'></path><path d='M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z' fill='#36c5f0'></path><path d='M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z' fill='#2eb67d'></path><path d='M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z' fill='#ecb22e'></path></svg>Add to Slack</a>`
// userScopesInstallHtml = `<a href='https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=&user_scope=${process.env.ADMIN_SCOPE}&redirect_uri=${oauthRedirect}' style='align-items:center;color:#fff;background-color:#4A154B;border:0;border-radius:4px;display:inline-flex;font-family:Lato,sans-serif;font-size:40px;font-weight:600;height:112px;justify-content:center;text-decoration:none;width:552px'><svg xmlns='http://www.w3.org/2000/svg' style='height:48px;width:48px;margin-right:12px' viewBox='0 0 122.8 122.8'><path d='M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z' fill='#e01e5a'></path><path d='M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z' fill='#36c5f0'></path><path d='M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z' fill='#2eb67d'></path><path d='M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z' fill='#ecb22e'></path></svg>Add to Slack</a>`

// index page will add to slack option
router.get('/', (req, res, next) => {
  const url = __dirname + '/pages/index';
  const oauthRedirect = process.env.AUTH0_LOGIN_URL
  const data = {
    slack: {
      clientId: process.env.SLACK_CLIENT_ID,
      scope: process.env.BOT_SCOPE,
      oauthRedirect
    }
  }
  res.render(url, data);
});

module.exports = router
module.exports.slackReceiver = receiver;