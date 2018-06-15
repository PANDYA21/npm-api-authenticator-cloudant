const express = require('express');
const api = express.Router();
const verbose = process.env.is_dev || false;
const api_methods = require('./api_methods.js');


/**
 * @apiDefine unauthenticated
 * @apiError (401) message Unauthenticated usage.
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1 401 
 *    Unauthorized.
 */

/*
 * @api {get} /api/v1 Request API
 * @apiName Info
 * @apiHeader {String} authorization Authentication token, received by posing at <code>/authentication</code>.
 * @apiGroup API
 *
 * @apiSuccess {Object} msg Basic information.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        msg: "Hello world!"
 *     }
 * @apiUse unauthenticated
 */
api.get('/v1', (req, res, next) => {
	let msg = api_methods.helloWorld();
	res.status(200).json({ msg });
});

module.exports = api;