/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const mongoose = require('mongoose'),
moment         = require('moment'),
Schema         = mongoose.Schema,
_Schema        = new Schema({
	user       : { type : Schema.Types.ObjectId, ref : 'user'},			// 关联的用户
	uid        : { type : String, default : ''},
	type       : { type : Number, default : 0},							// 身份类型,默认学员身份, 0:学员，1:助教，2:教练
	info       : { type : Object},
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
	findIdentity(user, type, callback) {
		this.findOne({user, type})
		.exec((err, doc) => callback(doc));
	},
	install(mongo, callback) {
		this.findIdentity(mongo.user, mongo.type, doc => {
			if(doc) callback(doc);
			else {
				const uid = addNumber(8);
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
		})
	}
}

mongoose.model('identity', _Schema, 'identity');