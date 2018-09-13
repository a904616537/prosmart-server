/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

var mongoose = require('mongoose'),
Schema       = mongoose.Schema,
_Schema  = new Schema({
	img        : String,
	order      : { type : Number, default : 20 },
	CreateTime : { type : Date, default : Date.now }
});


_Schema.virtual('date').get(() => {
  this._id.getTimestamp();
});

_Schema.statics = {
	findById(_id, callback) {
		this.findOne({_id})
		.exec(callback);
	}
}

mongoose.model('banner', _Schema, 'banner');