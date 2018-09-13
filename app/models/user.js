/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: user mongoose
 */

'use strict';

var mongoose = require('mongoose'),
Schema       = mongoose.Schema,
user_Schema  = new Schema({
	subscribe      : Number,
	openid         : String,
	nickname       : String,
	sex            : Number,
	language       : String,
	city           : String,
	province       : String,
	country        : String,
	headimgurl     : String,
	unionid        : String,
	remark         : String,
	phone          : String,
	email          : String,
	identity       : { type : Schema.Types.ObjectId, ref : 'identity'},	// 用户身份
	CreateTime     : { type : Date, default : Date.now }
});


user_Schema.virtual('date').get(() => {
  this._id.getTimestamp();
});

user_Schema.statics = {
	findById(_id, callback) {
		this.findOne({_id})
		.select({
			password : 0,
			key      : 0
		})
		.exec(callback);
	},
	findByUser(select, callback) {
		this.findOne({})
		.or([
			{'phone': { $in: select }},
			{'email': { $in: select }}
		])
		.exec(callback)
	}
}

mongoose.model('user', user_Schema, 'user');