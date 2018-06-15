const express = require('express');
const auth = require('./module');
const _ = require('lodash');
const usermanagement = require('usermanagement-cloudant-middleware/callbackify');
const shared_secret = 'koelnerDom';

class AuthenticatorRouter {
	constructor() {
		this.routes = {
			base_path: arguments[0].base_path || '/',
			authenticate_path: arguments[0].authenticate_path || '/authenticate'
		};
		this.expiration = arguments[0].expiration || Math.floor(Date.now() / 1000) + (60 * 60); // 1 hour
		this.sharedSecret = arguments[0].sharedSecret || 'koelnerDom';
		this.router = express.Router();
		this.authenticationRouter();
		this.authorizationRouter();
		this.errHandler();
	}

	parseCreds(req, callback) {
		let token = req.headers.authorization;
		token = token.replace('Bearer ', '');
		if (!token) {
			return callback(new Error('No token provided!'), null);
		}
		return auth.decodeToken(token, this.sharedSecret, callback);
	}

	extractUserCreds(req) {
		try {
			const { username, password } = req.body;
			return { username, password };
		} catch(e) {
			return { username: null, password: null };
		}
	}

	authenticationRouter() {
		this.router.post(this.routes.authenticate_path, (req, res, next) => {
			const { username, password } = this.extractUserCreds(req);
			if (!username || !password) {
				return res.status(400).json({
					success: false,
					message: 'No credentials provided!'
				});
			}
			usermanagement.authenticateUserCb(req.body.username, Buffer.from(req.body.password, 'base64').toString(), (err, result) => {
				if (err) {
					return res.status(401).json({
						success: false,
						message: err
					});
				}
				auth.getToken(req.body, this.sharedSecret, (err, token) => {
					err ? res.status(500).send(err) : res.status(200).json({
						success: true,
						token
					});
				}, this.expiration);
			});
		});
	}

	authorizationRouter() {
		this.router.use(this.routes.base_path, (req, res, next) => {
			this.parseCreds(req, (err, parsed_creds) => {
				if (err) {
					return res.status(500).json({
						success: false,
						message: err.message || err.error || err.stack
					});
				}
				if (typeof parsed_creds === 'undefined') {
					return res.status(401).json({
						success: false,
						message: 'Unauthorized'
					});
				}
				usermanagement.authenticateUserCb(parsed_creds.data.username, Buffer.from(parsed_creds.data.password, 'base64').toString(), (err, result) => {
					if (err) {
						return res.status(401).json({
							success: false,
							message: 'Unauthorized'
						});
					}
					next();
				});
			});			
		});
	}

	// error handler
	errHandler() {
		this.router.use((err, req, res, next) => {
			res.status(500).json({ success: false, error: err.message || err.stack });
		});
	}

}

module.exports = AuthenticatorRouter;
