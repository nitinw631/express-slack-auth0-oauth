const http = require('https');

const getHomeData = async (payload) => {
  const options = {
    hostname: process.env.QARROT_GENERAL_HOSTNAME,
    path: '/api/users/logged',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': (payload.token_type + ' ' + payload.access_token),
    }
 };
  return new Promise((resolve, reject) => {
    return http.get(options, (res) => {
      if(res.statusCode === 200) {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            const body = JSON.parse(rawData);
            resolve(body);
          } catch (e) {
            reject({
              message: 'Something went wrong while parsing data. Try again later',
            })
          }
        });
      } else {
        reject({
          message: res.statusCode + ': Something went wrong while parsing data. Try again later',
        })
      }
    })
  });
};
module.exports = { getHomeData };