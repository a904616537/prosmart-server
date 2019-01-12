/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config = require('../../setting/config'),
mongoose     = require('mongoose'),
moment       = require('moment'),
_mongo       = mongoose.model('team');

module.exports = {
	get(_id, callback) {
		_mongo.findOne({_id})
		.populate({
			path     : 'identity',
			model    : 'identity'
		})
		.populate({
			path     : 'players',
			model    : 'identity',
			populate : {
				path     : 'user',
				model    : 'user'
			}
		})
		.populate({
			path     : 'apply.player',
			model    : 'identity',
			populate : {
				path     : 'user',
				model    : 'user'
			}
		})
		.exec((err, doc) => callback(doc))
	},
	all(callback) {
		_mongo.find({})
		.populate({
			path     : 'identity',
			model    : 'identity'
		})
		.populate({
			path     : 'players',
			model    : 'identity'
		})
		.populate({
			path     : 'apply.player',
			model    : 'identity',
			populate : {
				path     : 'user',
				model    : 'user'
			}
		})
		
		.exec((err, doc) => {
			callback(doc);
		})
	},
	getMyTeam(identity_id, callback) {
		_mongo.find({})
		.or([
			{'identity': { $in: [identity_id] }},
			{'players': { $in: [identity_id] }}
		])
		.exec((err, doc) => callback(doc))
	},
	Search(query, callback) {
		_mongo.find({})
		.or([
			{'uid': { $in: [parseInt(query)] }},
			{'info.name': { $in: [query] }}
		])
		.populate({
			path     : 'identity',
			model    : 'identity'
		})
		.populate({
			path     : 'players',
			model    : 'identity'
		})
		.populate({
			path     : 'apply.player',
			model    : 'identity'
		})
		.exec((err, doc) => {
			callback(doc);
		})
	},
	// 创建
	Install(model) {
		return new Promise((resolve, reject) => {
			console.log('model', model)
			_mongo.findOne({identity : model.identity})
			.exec((err, doc) => {
				console.log('doc', doc)
				if(doc) return reject();
				else {
					const mongo  = new _mongo(model);
					_mongo.install(mongo, doc => {
						if(doc) resolve(doc);
						else reject()
					})
				}
			})
		})
	},
	Update(_id, info) {
		return new Promise((resolve, reject) => {
			_mongo.findById(_id, doc => {
				if(doc) {
					doc.info = info;
					doc.save(err => {
						// console.error(err)
						if(err) reject('数据保存出错');
						else resolve(doc);
					})
				} else reject('用户不存在');
			})
		})
	},
	addPlayer(_id, player) {
		return new Promise((resolve, reject) => {
			_mongo.findById(_id, doc => {
				if(doc) {
					doc.players.push(player)
					doc.save(err => {
						// console.error(err)
						if(err) reject('数据保存出错');
						else resolve(doc);
					})
				} else reject('用户不存在');
			})
		})
	},
	reomvePlayer(_id, player) {
		return new Promise((resolve, reject) => {
			_mongo.findById(_id, doc => {
				console.log('reomvePlayer', _id, player,doc)
				if(doc) {
					const index = doc.players.findIndex(val => val==player);
					doc.players.splice(index, 1);
					doc.save(err => {
						// console.error(err)
						if(err) reject('数据保存出错');
						else resolve(doc);
					})
				} else reject('用户不存在');
			})
		})
	},
	apply(_id, player) {
		return new Promise((resolve, reject) => {
			_mongo.findById(_id, doc => {
				if(doc) {
					// 查找申请
					const index = doc.apply.findIndex(val => val.player == player);
					const player_index = doc.players.findIndex(val => val == player);
					if(index > -1) return reject('你已经申请过这个球队！');
					if(player_index > -1) return reject('你已经是这个球队的成员！');

					doc.apply.push({player});
					doc.save(err => {
						// console.error(err)
						if(err) reject('数据保存出错');
						else resolve(doc);
					})
				} else reject('用户不存在');
			})
		})
	},
	agree(_id, player, agree = false) {
		return new Promise((resolve, reject) => {
			_mongo.findById(_id, doc => {
				if(doc) {
					// 查找申请
					const index = doc.apply.findIndex(val => val.player == player);
					const player_index = doc.players.findIndex(val => val == player);
					if(index == -1) return reject('申请已经被处理');
					if(agree && player_index == -1) doc.players.push(player);

					doc.apply.splice(index, 1);
					doc.save(err => {
						// console.error(err)
						if(err) reject('数据保存出错');
						else resolve(doc);
					})
				} else reject('用户不存在');
			})
		})
	}
}

	
