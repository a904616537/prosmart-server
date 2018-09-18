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
	_service.all(doc => {
		res.send(doc)
	})
})
// 创建球队
.post((req, res) => {
	const model = req.body;
	_service.Install(model)
	.then(mongo => res.send(mongo))
	.catch(err => res.status(500).send('球队已存在，或信息出错！'))
})
.put((req, res) => {
	let {_id, info} = req.body;
	info = JSON.parse(info);
	console.log('req.body', req.body)
	_service.Update(_id, info)
	.then(mongo => res.send(mongo))
	.catch(err => res.status(500).send('保存出错'))
})

// 搜索球队
router.route('/search')
.get((req, res) => {
	console.log('req', req.query)
	const {query} = req.query;
	_service.Search(query, (teams) => {
		console.log('teams', teams);
		res.send(teams);
	})
	
})

router.route('/player')
.get((req, res) => {
	let {identity_id} = req.query;

	_service.getMyTeam(identity_id, doc => res.send(doc))
})
// 申请球队
.post((req, res) => {
	let {_id, player} = req.body;

	_service.apply(_id, player)
	.then(mongo => {
		res.send({status : true, data : mongo})
		setTimeout(() => {
			_service.agree(_id, player, true)
			.then(mongo => console.log('自动完成加入球队'))
			.catch(err => console.log(err))
		}, 60000);
	})
	.catch(err => res.send({status : false, msg : err}))
})
// 申请处理
.put((req, res) => {
	let {_id, player, agree} = req.body;
	console.log('req.body', req.body);
	_service.agree(_id, player, agree)
	.then(mongo => res.send({status : true, data : mongo}))
	.catch(err => res.send({status : false, msg : err}))
})
// 踢出球队
.delete((req, res) => {

	const {_id, player} = req.query;

	_service.reomvePlayer(_id, player)
	.then(doc => res.send(doc))
	.catch(err => res.send(err).status(500));
})

module.exports = app => {
	app.use('/team', router);
}