/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: 路由配置
 */

'use strict';

var express      = require('express'),
_service         = require('../service/user.service'),
identity_service = require('../service/identity.service'),
help             = require('../helper/page.help.js'),
router           = express.Router();

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
.put((req, res) => {
	const {user, type} = req.body;
	console.log(user, type)
	identity_service.findIdentity(user, type, identity => {
		if(identity) {
			_service.UpdateIdentity(user, identity._id, result => {
				if(result == null) res.send({identity : null}).status(500);
				else res.send({identity});
			})
		} else res.send({identity : null});
	})
})

router.route('/info')
.get((req, res) => {
	const {openid} = req.query;

	_service.getUserForOpenId(openid, (user) => {
		res.send(user)
	})
})
.put((req, res) => {
	console.log('updateuser', req.body);
	_service.updateUser(req.body)
	.then(user => res.send(user))
	.catch(err => res.status(500))
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