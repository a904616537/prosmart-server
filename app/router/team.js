/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: 路由配置
 */

'use strict';

const express = require('express'),
_service      = require('../service/team.service'),
router        = express.Router();



router.route('/')
.get((req, res) => {
	console.log('team page')
	res.send('team')
})
.post((req, res) => {
	const model = req.body;
	_service.Install(model)
	.then(mongo => res.send(mongo))
	.catch(err => res.status(500).send('身份已存在，或信息出错！'))
})
.put((req, res) => {
	let {_id, info} = req.body;
	info = JSON.parse(info);
	console.log('req.body', req.body)
	_service.Update(_id, info)
	.then(mongo => res.send(mongo))
	.catch(err => res.status(500).send('保存出错'))
})
router.route('/player')
// 申请球队
.post((req, res) => {
	let {_id, player} = req.body;

	_service.apply(_id, player)
	.then(mongo => res.send(mongo))
	.catch(err => res.status(500).send(err))
})
// 申请处理
.put((req, res) => {
	let {_id, player, agree} = req.body;
	console.log('req.body', req.body);
	_service.agree(_id, player, agree)
	.then(mongo => res.send(mongo))
	.catch(err => res.status(500).send(err))
})
// 踢出球队
.delete((req, res) => {

	const {_id, player} = req.body;
	_service.reomvePlayer(_id, player)
	.then(doc => res.send(doc))
	.catch(err => res.send(err).status(500));
})

module.exports = app => {
	app.use('/team', router);
}