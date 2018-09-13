/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: wechat 路由配置
 */

'use strict';

var express = require('express'),
router      = express.Router(),
wechat      = require('wechat'),
moment      = require('moment'),
jwt         = require('jwt-simple'),
request     = require('request'),
setting     = require('../../setting/config.js').wechat,
service     = require('../service/wechat.service'),
user_server = require('../service/user.service');


router.get('/wechat/url', (req, res, next) => {
	service.getUrl(setting.url + setting.oauth, '123', 'snsapi_userinfo')
	.then(url => res.send(url))
})
console.log('setting.oauth', setting.oauth)


router.route(setting.oauth)
.get((req, res, next) => {
	const code = req.query.code;
	console.log('code', code)
	service.getOpenId(code)
	.then(openid => {
		user_server.getUserForOpenId(openid, user => {
			if(user) {
				console.log(moment(), '找到登录用户信息', openid)

				req.session.user = user;
				res.send(user)
			} else {
				console.log(moment(), '未找到登录用户信息', openid)
				service.getUserAndInsert(openid)
				.then(user => {
					console.log(moment(), '获取并新增用户', openid)
					res.send(user)
				})
				.catch(err => res.status(500).send())
			}
		})
	})
	.catch(err => {
		console.error(err)
		// res.redirect('/')
		res.status(500).send({code, status : false})
	})
})


router.route('/wechat/menu/set')
.get((req, res) => {
	const menu = {
		"button" :[{
			"type" : "view",
			"name" : "汉斯格雅商城",
			"url"  : "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx06c82c3cbb012752&redirect_uri=http%3A%2F%2Ffiltration.hansgrohe.com.cn%2Fshop&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
		},{
			"type" : "view",
			"name" : "注册",
			"url"  : "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx06c82c3cbb012752&redirect_uri=http%3A%2F%2Ffiltration.hansgrohe.com.cn%2F&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
		}]
	}
	service.createMenu(menu, result => {
		console.log('create menu', result);
		res.send(result)
	});
})


module.exports = app => {
	app.use(express.query());
	app.use('/', router);
	app.use('/wechat', wechat(setting.token,
		wechat.text((message, req, res, next) => {
			res.reply()
		})
		.image((message, req, res, next) => {
			res.reply()
		})
		.voice((message, req, res, next) => {
			res.reply()
		})
		.video((message, req, res, next) => {
			res.reply()
		})
		.location((message, req, res, next) => {
			res.reply()
		})
		.link((message, req, res, next) => {
			res.reply()
		})
		.event((message, req, res, next) => {
			if(message.Event == 'subscribe') {
				console.log(moment(), '关注用户', message)
				service.getUserAndInsert(message.FromUserName)
				.then((doc) => {
					const {user, is_sub} = doc;
					console.log(moment(),'user subscribe', message.FromUserName)
					socket.emit('subscribe', {status : true, user : user, is_sub, subscribe : true})
					res.reply('欢迎关注')
				})
				.catch((doc) => {
					const {user, is_sub} = doc;
					socket.emit('subscribe', {status : false, is_sub, subscribe : true})
					console.error(moment(), 'user subscribe error', err);
					res.reply('欢迎关注')
				})
				
			} else if(message.Event == 'unsubscribe') {
				console.log(moment(),'user unsubscribe', message.FromUserName)
				service.Subscribe(message.FromUserName, 0)
				.then(user => socket.emit('subscribe', {status : true, user, is_sub : false, subscribe : false}))
				.catch(err => console.log(err))
				res.reply()
			} else if(message.Event == 'VIEW') {
				console.log( moment(), 'check menu', message.FromUserName)
				res.reply()
			} else {
				res.reply()
			}
		})
	))
}