/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: 路由配置
 */

'use strict';

const express = require('express'),
_service      = require('../service/course.service'),
help          = require('../helper/page.help.js'),
router        = express.Router();


router.route('/')
.get((req, res) => {
	_service.getList(arr => {
		console.log('getList', arr);
		res.send(arr);
	})
})
.post((req, res) => {
	const model = req.body;
	_service.Install(model)
	.then(mongo => res.send(mongo))
	.catch(err => res.status(500).send(err))
})
.put((req, res) => {
	let course = req.body;
	console.log('course', course)
	_service.Update(course)
	.then(mongo => res.send(mongo))
	.catch(err => res.status(500).send(err))
})
.delete((req, res) => {
	const {_id} = req.query;
	
	_service.delete(_id)
	.then(mongo => res.send(mongo))
	.catch(err => res.status(500).send(err))
})

router.route('/all')
.get((req, res) => {
	let { page, per_page, sort } = req.query;
	page     = parseInt(page);
	per_page = parseInt(per_page);

	_service.getCourses(page, per_page, sort, (courses, count) => {
		let { total, last_page, next_page_url, prev_page_url} = help.calculate(page, per_page, count, '/course');
		res.send({data: courses, current_page: page, total, per_page, last_page, next_page_url, prev_page_url })
	});
})

router.route('/video')
.get((req, res) => {
	const {_id} = req.query;
	_service.getCourse(_id, doc => res.send(doc));
})
.post((req, res) => {
	const model = req.body;
	_service.addVideo(model.pid, model)
	.then(mongo => res.send(mongo))
	.catch(err => res.status(500).send(err))
})
.put((req, res) => {
	const model = req.body;
	_service.updateVideo(model.pid, model)
	.then(mongo => res.send(mongo))
	.catch(err => res.status(500).send(err))
})
.delete((req, res) => {
	const model = req.body;
	_service.removeVideo(model.pid, model._id)
	.then(mongo => res.send(mongo))
	.catch(err => res.status(500).send(err))
})

module.exports = app => {
	app.use('/course', router);
}