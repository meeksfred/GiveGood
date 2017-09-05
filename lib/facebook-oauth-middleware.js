'use strict';

const request = require('superagent');
const debug = require('debug')('givegood:facebook-oauth-middleware');

module.exports = function(req, res, next){
  debug('getting facebook user info');

  let tokenData = {
    code: `code=${req.query.code}`,
    client_id: `client_id=${process.env.FACEBOOK_CLIENT_ID}`,
    client_secret: `client_secret=${process.env.FACEBOOK_CLIENT_SECRET}`,
    redirect_uri: `redirect_uri=${process.env.API_URL}/api/auth/facebook_oauth_callback`, // need to setup a route on either Profile or User router to catch the redirect_uri
  };

  console.log(tokenData);

  let accessToken, tokenTTL;

  request.get(`https://graph.facebook.com/v2.8/oauth/access_token?${tokenData.client_id}&${tokenData.redirect_uri}&${tokenData.client_secret}&${tokenData.code}`)
  .then( response => {
    console.log(response.body, 'response');
    accessToken = response.body.access_token;
    tokenTTL = response.body.expires_in;
    return request.get(`https://graph.facebook.com/v2.8/me?access_token=${accessToken}&fields=id,name,email,likes`); // need to access a couple more fields, including likes, total likes, etc.
  })
  .then( response => {
    console.log(response.text, 'response.text');
    let parsed = JSON.parse(response.text);
    parsed.name = parsed.name.split(' ');
    console.log(parsed, 'parsed');
    console.log(parsed.name, 'PARSED.NAME');
    req.facebookOAUTH = { // double-check with model to make sure objects are the same.
      facebookID: parsed.id,
      firstName: parsed.name[0],
      lastName: parsed.name[1],
      email: parsed.email,
      likes: parsed.likes,
      tokenTTL,
      accessToken,
    };
    next();
  })
  .catch( (err) => {
    req.facebookError = err;
    next();
  });
};
