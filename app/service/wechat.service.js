/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description:  wechat 功能
 */

'use strict';

var OAuth    = require('wechat-oauth'),
setting      = require('../../setting/config.js').wechat,
mongoose     = require('mongoose'),
moment       = require('moment'),
request_post = require('request'),
mongo        = mongoose.model('token'),
user_service = require('./user.service'),
WechatAPI    = require('wechat-api'),
api          = new WechatAPI(setting.appid, setting.appsecret),
client       = new OAuth(
	setting.appid,
	setting.appsecret,
	(openid, callback) => {
		mongo.getToken(openid)
		.then(result => callback(null, result))
		.catch(err => callback(err))
	},
	(openid, token, callback) => {
		mongo.setToken(openid, token)
		.then(result => callback(result))
		.catch(err => callback())
	})

module.exports = {
	getUrl(url, state, scope) {
		return new Promise((resolve, reject) => {
			resolve(client.getAuthorizeURL(url, state, scope))
		})
	},
	createMenu(menu, callback) {
		api.createMenu(menu, callback);
	},
	getOpenId(code) {
		return new Promise((resolve, reject) => {
			console.log('get token', code)
			client.getAccessToken(code, (err, result) => {
				if(err && err != 'undefined') return reject(err);
				resolve(result.data.openid)
			})
		})
	},
	getOpenUser(access_token, openid) {
		return new Promise((resolve, reject) => {
			request_post({
				url    : "https://api.weixin.qq.com/sns/userinfo?access_token="+access_token+"&openid="+openid,
				method : 'GET'
			}, (error, response, body) => {
				if (error) {
					console.log(moment(), '获取用户详细信息失败, openid:', openid);
					reject(error);
				} else if(body.errcode) {
					console.log(moment(), '获取用户详细信息失败, openid:', body)
					reject(body);
				}
				else {
					let user = JSON.parse(body);
					console.log(moment(), '获取用户详细信息成功', user);
					user.name = user.nickname;
					user_service.InsertUser(user)
					.then((doc) => {
						console.log(moment(), 'PC 最新关注', doc);
						resolve(doc);
						cart_service.Init(doc.user._id);
					})
					.catch(doc => reject(doc))
				}
			});
		})
	},
	getOauthUser(code) {
		const that = this;
		return new Promise((resolve, reject) => {
			that.getOpenId(code)
			.then(openid => {
				console.log('openid', openid)
				client.getUser(openid, (err, result) => {
					console.log('err', err)
					console.log('result', result)
					if(err) return reject(err)
					resolve(result)
				})
			})
			.catch(err => reject(err))
		})
	},
	getUserAndInsert(openid) {
		return new Promise((resolve, reject) => {
			api.getUser(openid, (err, user) => {
				console.log(moment(), '获取用户信息', user);
				if(err) return reject(err);
				user.name = user.nickname;
				user_service.InsertUser(user)
				.then((doc) => resolve(doc))
				.catch(doc => reject(doc))
			});
		})	
	},
	Subscribe(openid, status) {
		return new Promise((resolve, reject) => {
			user_service.SelectByOpenId(openid)
			.then(user => {
				console.log('subscribe', user)
				if(user) {
					user.subscribe = status;
					user.save(err => {
						if(err) return reject(err)
						resolve(user);
					})
				} else reject({})
			})
			.catch(err => reject(err))
		})
	}
}

