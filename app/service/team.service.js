/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config = require('../../setting/config'),
mongoose     = require('mongoose'),
moment       = require('moment'),
_mongo       = mongoose.model('team');

module.exports = {
	// 创建
	Install(model) {
		return new Promise((resolve, reject) => {
			const mongo  = new _mongo(model);
			_mongo.install(mongo, doc => {
				if(doc) resolve(doc);
				else reject()
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

	
