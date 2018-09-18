/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: 路由配置
 */

'use strict';

var express = require('express'),
_service    = require('../service/user.service'),
router      = express.Router();

router.route('/')
.get((req, res, next) => {
	console.log('index page')
	res.send('index')
})

router.route('/login')
.post((req, res, next) => {
	const {openid} = req.body;
	_service.getUserForOpenId(openid, user => {
		res.send({user});
	})
});


module.exports = app => {
	app.use('/', router);
}