/*
 * Author: Kain·Altion <kain@foowala.com>
 * 球员信息
 */

'use strict';

const mongoose = require('mongoose'),
moment         = require('moment'),
Schema         = mongoose.Schema,
_Schema        = new Schema({
	identity   : { type : Schema.Types.ObjectId, ref : 'identity'},	// 填写身份
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
		.exec(callback);
	}
}

mongoose.model('player', _Schema, 'player');