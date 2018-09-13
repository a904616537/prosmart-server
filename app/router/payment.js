/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description:  支付处理
 */

'use strict';

var express = require('express'),
router      = express.Router(),
path        = require('path'),
fs          = require('fs'),
rootPath    = path.normalize(__dirname + '/../..'),
moment      = require('moment'),
ip          = require('ip'),
wechat      = require('../../setting/config.js').wechat,
Payment     = require('wechat-pay').Payment,
WXPay = require('weixin-pay');
 
const payinfo = wechat.pay;

var wxpay = WXPay({
	nonce_str        : Math.random().toString().substr(2, 10),
	partnerKey : payinfo.partnerKey,
	appId      : payinfo.appId,
	mchId      : payinfo.mchId,
	notifyUrl  : payinfo.notifyUrl,		//微信商户平台API密钥 
	pfx        : payinfo.pfx,			//微信商户平台证书 
});


const initConfig = {
	partnerKey : payinfo.partnerKey,
	appId      : payinfo.appId,
	mchId      : payinfo.mchId,
	notifyUrl  : payinfo.notifyUrl,		//微信商户平台API密钥 
	pfx        : payinfo.pfx,			//微信商户平台证书 
};



const payment = new Payment(initConfig);
const middleware = require('wechat-pay').middleware;

router.route('/wechat')
.post((req, res) => {
	const {order, total, open_id} = req.body;
	var body = {
		body             : 'Hansgrohe',
		out_trade_no     : order + '_' + Math.random().toString().substr(2, 5),
		total_fee        : parseInt(total) * 100,
		spbill_create_ip : ip.address(),
		// openid           : 'o60iixCfolqTD0XqAd511lWVhWKA',
		openid           : open_id,
		trade_type       : 'JSAPI'
	};

	// wxpay.getBrandWCPayRequestParams({
	// 	openid           : open_id,
	// 	body             : 'Hansgrohe',
	// 	detail           : 'Hansgrohe',
	// 	out_trade_no     : order + '_' + Math.random().toString().substr(2, 5),
	// 	total_fee        : parseInt(total) * 100,
	// 	spbill_create_ip : ip.address(),
	// 	notify_url       : 'http://filtration.hansgrohe.com.cn/payment'
	// }, (err, payargs) => {
	// 	console.log('payargs', payargs)
	// 	res.json(payargs);
	// });


	console.log('initConfig', initConfig)
	console.log('body', payment)
	payment.getBrandWCPayRequestParams(body, (err, payargs) => {
		console.log('error', err)
		console.log('payargs', payargs)
		res.json(payargs);
	});
})


router.use('/wechat/notify', middleware(initConfig).getNotify().done((message, req, res, next) => {
	var openid = message.openid,
	order_id   = message.out_trade_no.split("_", 1),
	attach     = {};
	try{
		attach = JSON.parse(message.attach);
		console.log(moment(), 'notify message', message)
	}catch(e) {}
	console.log(moment(), 'wechat payment notify order id:', order_id)
	/**
	* 查询订单，在自己系统里把订单标为已处理
	* 如果订单之前已经处理过了直接返回成功
	*/
	res.reply('success');

	/**
	* 有错误返回错误，不然微信会在一段时间里以一定频次请求你
	* res.reply(new Error('...'))
	*/
}));

module.exports = app => {
	app.use('/payment', router);
}