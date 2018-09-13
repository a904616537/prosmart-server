/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config   = require('../../setting/config'),
mongoose       = require('mongoose'),
moment         = require('moment'),
user_mongo     = mongoose.model('user'),
sms            = require('../helper/sms'),
encryption     = require('../helper/encryption');

module.exports = {
	getUserById(user_id, callback) {
		user_mongo.findOne({_id : user_id})
		.exec((err, user) => callback(user))
	},
	// 获取用户
	getUser(page = 1, size = 1, sort = 'CreateTime|asc', callback) {
		let q = {};
		user_mongo.count(q)
		.exec((err, count) => {
			let start = (page - 1) * size;
			let query = user_mongo.find(q)
			query.limit(size)
			query.skip(start)
			if(sort && sort != '') {
				console.log('sort', sort)
				sort = sort.split("|")
				if(sort[1] == 'asc') sort = sort[0]
				else sort = '-' + sort[0]
				query.sort(sort)
			}
			query.exec((err, users) => {
				return callback(users, count)
			})
		})
	},
	getUserForOpenId(openid, callback) {
		user_mongo.findOne({openid})
		.populate({
			path     : 'identity',
			model    : 'identity',
		})
		.exec((err, user) => callback(user))
	},

	UpdateImage(demo) {
		return new Promise((resolve, reject) => {
			user_mongo.findOne({_id : demo._id})
			.exec((err, user) => {
				if(user) {
					user.headimgurl = demo.url;
					user.save(err => {
						if(err) return reject(err)
						resolve(user);
					})
				} else reject()
			})
		})
	},
	
	Update(user) {
		return new Promise((resolve, reject) => {
			delete user._id;
			user_mongo.findOne({openid:user.openid})
			.exec((err, user) => {
				if(user) {
					user_mongo.update(
					{openid: user.openid},
					user,
					{upsert : true},
					err => {
						if(err) return reject(err)
						resolve(user);
					})
				} else reject()
			})
		})
	},
	InsertUser(user) {
		return new Promise((resolve, reject) => {
			user_mongo.findOne({openid : user.openid})
			.exec((err, mongo) => {
				if(mongo) {
					user_mongo.update(
					{openid: user.openid},
					user,
					{upsert : true},
					err => {
						if(err) return reject(err)
						resolve(user);
					})
				} else {
					var model  = new user_mongo(user);
					model.save(err => {
						if(err) return reject(err)
						resolve(model);	
					})
				}
			})
		})
	},

	SelectByOpenId(openid) {
		return new Promise((resolve, reject) => {
			user_mongo.findOne({openid})
			.exec((err, doc) => {
				if (err) return reject(err);
				resolve(doc);
			})
        })
	},
	// 账户注册
	Register(user) {
		return new Promise((resolve, reject) => {
			user_mongo.findByUser([user.phone, user.email], (err, doc) => {
				if(doc) return reject();

				encryption.cipher(user.password, (pwd, key) => {
					user = new user_mongo({
						name     : user.name,
						phone    : user.phone,
						email    : user.email,
						password : pwd,
						key      : key,
					})
					user.save(err => {
						if(err) return reject(err);
					})
				})
			})
		})
	},

	// 发送短信验证码
	getSMSCode(phone, callback) {
		let Num = "";

	    for (var i = 0; i < 6; i++) {
	        Num += Math.floor(Math.random() * 10);
	    }
	    console.log(`验证码: ${Num}, 电话: ${phone}`);

	    let str = '【汉斯格雅】您的验证码是';
	    sms.sendSMS(str + Num, phone, (bo) => {
	    	if(bo) callback({status : true, code : Num, phone});
	    	else callback({status : false})
	    });
	}
}

	
