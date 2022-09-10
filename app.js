const express = require('express');
const { slackReceiver } = require('./slack');
const { auth0 } = require('./auth0');
const { requiresAuth } = require('express-openid-connect');
const {
  getHomeData
} = require('./services/home');

var slackRouter = require('./slack/routes/install');

const app = express();
const port = 3000;

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth0);


/**
 * SLACK INTEGRATION START
 */
// slack app attached /slack/events routes to the base
app.use(slackReceiver.router);

// add routes by /slack will be managed here
app.use('/slack', slackRouter);
/**
 * SLACK INTEGRATION END
 */


// fetch user profile data from oidc
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// Base url of slack app
app.get('/', (req, res) => {
  // console.log(req.oidc.accessToken);
  if(req.oidc.accessToken) {
    let { token_type, access_token } = req.oidc.accessToken;
    // call /logged endpoint if accessToken exists

    getHomeData({token_type, access_token}).then( (data) => {
      // user data
      console.log(data);
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    });

  }
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});