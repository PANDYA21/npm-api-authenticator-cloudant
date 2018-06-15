// set cloudant creds for dev env
if (process.env.is_dev == 'TRUE') {
	process.env.VCAP_SERVICES = JSON.stringify({
		cloudantNoSQLDB: [{
			credentials: require('./cloudant_creds.json')
		}]
	});
}

const bodyParser = require('body-parser');
const express = require('express');
let app = express();
const AuthenticatorRouter = require('.');
const authenticator = new AuthenticatorRouter({});

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