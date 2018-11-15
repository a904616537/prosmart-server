/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config = require('../../setting/config'),
mongoose     = require('mongoose'),
moment       = require('moment'),
_mongo       = mongoose.model('course');

module.exports = {
	getList(callback) {
		_mongo.find({}, ['title', 'desc', 'img', 'leve', 'order'])
		.sort({order : 1})
		.exec((err, doc) => callback(doc));
	},
	getCourses(page = 1, size = 1, sort = 'createTime|asc', callback) {

		_mongo.count()
		.exec((err, count) => {
			let start = (page - 1) * size;
			let query = _mongo.find({})
			query.limit(size)
			query.skip(start)
			if(sort && sort != '') {
				sort = sort.split("|")
				if(sort[1] == 'asc') sort = sort[0]
				else sort = '-' + sort[0]
				query.sort(sort)
			}
			query.exec((err, courses) => callback(courses, count));
		})
	},
	getCourse(_id, callback) {
		_mongo.findById(_id, callback);
	},
	// 创建
	Install(model) {
		return new Promise((resolve, reject) => {
			const mongo  = new _mongo(model);
			mongo.save(err => {
				if(err) reject('数据保存出错');
				else resolve(mongo);
			})
		})
	},
	Update(course) {
		console.log('course', course)
		return new Promise((resolve, reject) => {
			_mongo.findById(course._id, doc => {
				if(doc) {
					doc.title = course.title;
					doc.desc  = course.desc;
					doc.img   = course.img;
					doc.item  = course.item;
					doc.level = course.level;
					doc.order = course.order;
					doc.save(err => {
						// console.error(err)
						if(err) reject('数据保存出错');
						else resolve(doc);
					})
				} else reject('课程不存在');
			})
		})
	},
	addVideo(_id, video) {
		return new Promise((resolve, reject) => {
			_mongo.findById(_id, doc => {
				if(doc) {
					doc.item.push(video);
					doc.save(err => {
						// console.error(err)
						if(err) reject('数据保存出错');
						else resolve(doc);
					})
				} else reject('课程不存在');
			})
		})
	},
	updateVideo(_id, video) {
		return new Promise((resolve, reject) => {
			_mongo.findById(_id, doc => {
				if(doc) {
					const index = doc.item.findIndex(val => val._id == video._id);
					if(index > -1) {
						doc.item.splice(index, 1, video);
						doc.save(err => {
							// console.error(err)
							if(err) reject('数据保存出错');
							else resolve(doc);
						})
					} else resolve(doc);
				} else reject('课程不存在');
			})
		})
	},
	removeVideo(_id, video_id) {
		return new Promise((resolve, reject) => {
			_mongo.findById(_id, doc => {
				if(doc) {
					const index = doc.item.findIndex(val => val._id == video_id);
					if(index > -1) {
						doc.item.splice(index, 1);
						doc.save(err => {
							// console.error(err)
							if(err) reject('数据保存出错');
							else resolve(doc);
						})
					} else resolve(doc);
				} else reject('课程不存在');
			})
		})
	}
}