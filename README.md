# NodeJS middleware for authenticating express based APIs with JWT - wrapper of [npm-usermanagement-cloudant](https://github.com/RAW21/npm-usermanagement-cloudant.git)
This repository serves as a middleware for [JWT](https://jwt.io/) based authentication for nodejs-express apis. A token is generated with successfully posting of user credentials at authentication path. This token can be used against the use of the other endpoints.

## Features and Description
- Express based routing
- Authorization required for all routes starting from and including base-path

## Usage
Install module:
```bash
npm install git+https://github.com/RAW21/npm-api-authenticator-cloudant.git --save
```

Require and use in your code:

Note:
- Order is important!
  * Write all routes before using `authenticator.router` that are to be used without auth (e.g. public)
  * All the other routes should be written after using `authenticator.router`.

```javascript
const bodyParser = require('body-parser');
const express = require('express');
let app = express();
const AuthenticatorRouter = require('.');
const authenticator = new AuthenticatorRouter({
  base_path: '/',
  expiration: Math.floor(Date.now() / 1000) + (60 * 60), // after 1 hour expiration of token
  authenticate_path: '/authenticate',
  sharedSecret: 'koelnerDom'
});

// // or simply
// const authenticator = new AuthenticatorRouter({});

app.use(bodyParser.json());

app.get('/woauth', (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Should get it with or without the authorization header i.e. no authentication required'
  });
});

app.use(authenticator.router);

app.get('/wiauth', (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Should get it only with the authorization header'
  });
});

app.listen(process.env.npm_package_config_dev_port);
```


## Options
### Default Options
```js
new AuthenticatorRouter({
  base_path: '/',
  expiration: Math.floor(Date.now() / 1000) + (60 * 60), // after 1 hour expiration of token
  authenticate_path: '/authenticate',
  sharedSecret: 'koelnerDom'
})
```

### base_path
Base path where this authentication router is applied to.

### authenticate_path
Path where the user credentials are `POST`ed to verify.

### expiration
Token age in seconds.

### sharedSecret
Shared secret string, required to create a new user, as the `createuser_path` and `createuser_page` do not use authentication. To make completely open user registrations, the `sharedSecret` can be set to empty string.
