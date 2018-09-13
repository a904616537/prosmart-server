/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: 路由配置
 */

'use strict';

var express = require('express'),
_service    = require('../service/user.service'),
help        = require('../helper/page.help.js'),
router      = express.Router();

router.route('/')
.get((req, res) => {
	let { page, per_page, sort, query } = req.query;
	page     = parseInt(page);
	per_page = parseInt(per_page);
	_service.getUser(page, per_page, sort, (users, count) => {
		let { total, last_page, next_page_url, prev_page_url} = help.calculate(page, per_page, count, '/user?query=' + query);
		res.send({data: users, current_page: page, total, per_page, last_page, next_page_url, prev_page_url })
	})
})

router.route('/info')
.get((req, res) => {
	const {openid} = req.query;

	_service.getUserForOpenId(openid, (user) => {
		res.send(user)
	})
})

router.get('/sms', (req, res, next) => {
	const {phone} = req.query;
	console.log('sms phone', phone);
	_service.getSMSCode(phone, result => {
		if(result.status) res.send(result)
		else res.status(500).send()
	})
})



module.exports = app => {
	app.use('/user', router);
}