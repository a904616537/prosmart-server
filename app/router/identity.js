/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: 路由配置
 */

'use strict';

const express = require('express'),
_service      = require('../service/identity.service'),
router        = express.Router();



router.route('/')
.get((req, res) => {
	console.log('identity page')
	res.send('identity')
})
.post((req, res) => {
	const model = req.body;
	_service.Install(model)
	.then(mongo => res.send(mongo))
	.catch(err => res.status(500).send('身份已存在，或信息出错！'))
})
.put((req, res) => {
	let {_id, info} = req.body;
	// info = JSON.parse(info);
	console.log('req.body', req.body)
	_service.Update(_id, info)
	.then(mongo => res.send(mongo))
	.catch(err => res.status(500).send('保存出错'))
})

module.exports = app => {
	app.use('/identity', router);
}