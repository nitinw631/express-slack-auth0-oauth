const express = require('express');
const { slackReceiver } = require('./slack');
const { auth0 } = require('./auth0');
const { requiresAuth } = require('express-openid-connect');
const {
  getHomeData
} = require('./services/home');

const app = express();
const port = 3000;

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth0);

// slack app attached /slack/events routes to the base
app.use(slackReceiver.router);

// respond with "hello world" when a GET request is made to the homepage
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
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});