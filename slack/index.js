const { App, ExpressReceiver } = require('@slack/bolt');
const { registerListeners } = require('./listeners');
const database = require("../database/db");
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
module.exports.slackReceiver = receiver;