/*
 * Author: Kain·Altion <kain@foowala.com>
 * 球队
 */

'use strict';

const mongoose = require('mongoose'),
moment         = require('moment'),
Schema         = mongoose.Schema,
item_Schema    = new Schema({
	player     : { type : Schema.Types.ObjectId, ref : 'identity' },
	CreateTime : { type : Date, default : Date.now }		// 申请时间
}),
_Schema        = new Schema({
	identity   : { type : Schema.Types.ObjectId, ref : 'identity'},		// 创建者身份信息
	uid        : { type : String, default : ''},						// 球队UID
	info       : { type : Object, default : {
		address     : '',
		city        : '',
		coach_name  : '',
		group       : '',
		header_logo : '',
		name        : '',
		desc        : ''
	}},										// 球队信息
	players    : [{type : Schema.Types.ObjectId, ref : 'identity' }],	// 球员
	apply      : [item_Schema],											// 申请列表
	CreateTime : { type : Date, default : Date.now }
});

function addNumber(_idx){
	var str = '';
	for(var i = 0; i < _idx; i += 1){
		str += Math.floor(Math.random() * 10);
	}
	return str;
}

_Schema.virtual('date').get(() => {
  this._id.getTimestamp();
});

_Schema.statics = {
	findById(_id, callback) {
		this.findOne({_id})
		.exec((err, doc) => callback(doc));
	},
	findUid(uid, callback) {
		this.findOne({uid}).exec((err, doc) => {
			if(doc) return callback(false);
			else callback(true);
		})
	},
	install(mongo, callback) {
		const uid = addNumber(6);
		this.findUid(uid, bo => {
			if(bo) {
				mongo.uid = uid;
				mongo.save(err => {
					if(err) return callback(null);
					else return callback(mongo);
				})
			}
			else this.install(callback);
		})
	}
}

mongoose.model('team', _Schema, 'team');