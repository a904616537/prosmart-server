/*
 * Author: Kain·Altion <kain@foowala.com>
 * 课程
 */

'use strict';

const mongoose = require('mongoose'),
moment         = require('moment'),
Schema         = mongoose.Schema,
Item_Schema    = new Schema({
	title      : { type : String, default : ''},	// 视频标题
	desc       : { type : String, default : ''},
	img        : { type : String, default : ''}, 	// 视频封面
	video      : { type : String},					// 视频地址
	order      : { type : Number, default : 20},
	CreateTime : { type : Date, default : Date.now }
}),
_Schema        = new Schema({
	title      : { type : String, default : ''},
	desc       : { type : String, default : ''},
	img        : { type : String, default : ''},	// 课程封面
	leve       : { type : Number, default : 0},		// 课程等级,0:初级，1:中级，2:高级
	item       : [Item_Schema],
	order      : { type : Number, default : 20},
	CreateTime : { type : Date, default : Date.now }
});

_Schema.virtual('date').get(() => {
  this._id.getTimestamp();
});

_Schema.statics = {
	findById(_id, callback) {
		this.findOne({_id})
		.exec((err, doc) => callback(doc));
	},
}

mongoose.model('course', _Schema, 'course');