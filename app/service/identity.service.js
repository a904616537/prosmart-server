/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config = require('../../setting/config'),
mongoose     = require('mongoose'),
moment       = require('moment'),
_mongo       = mongoose.model('identity'),
user_mongo   = mongoose.model('user');

module.exports = {
	findIdentity(user, type, callback) {
		_mongo.findIdentity(user, type, callback);
	},
	// 创建
	Install(model) {
		return new Promise((resolve, reject) => {
			const mongo  = new _mongo(model);
			_mongo.install(mongo, doc => {
				if(doc) {
					resolve(doc);
					user_mongo.findOne({_id : mongo.user})
					.exec((err, user) => {
						user.identity = doc._id;
						user.save(err => {
							if(err)console.error('用户身份保存失败');
						})
					})
				}
				else reject()
			})
		})
	},
	Update(_id, info) {
		return new Promise((resolve, reject) => {
			_mongo.findById(_id, doc => {
				if(doc) {
					doc.info = info;
					doc.save(err => {
						// console.error(err)
						if(err) reject('数据保存出错');
						else resolve(doc);
					})
				} else reject('用户不存在');
			})
		})
	}
}

	
