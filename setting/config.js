const path = require('path'),
fs         = require('fs'),
rootPath   = path.normalize(__dirname + '/..'),
env        = process.env.NODE_ENV || 'production',
port       = 8081

console.log('当前环境', env)

const project = 'prosmart';

const config = {
	//开发者环境配置
	development: {
		root         : rootPath,
		port         : port,
		maxOrderTime : 1080,
		app          : {
			name : `${project}`,
			local: 'http://localhost:' + port
		},
		mongo : `mongodb://127.0.0.1/${project}`,
		main  : {
			languagePath : rootPath + '/language/'
		},
		cookie : {
			secret      : project,
			sessionName : 'session'
		},
		yunpian : {
			apiKey  : '336622ee05a97de6b23b5c6a5a76e3f7'
		},
		wechat : {
			// Kain 的测试公众号
			appid          : 'wx1020286e395af06c',
			appsecret      : 'd9353526d9ebe7093325b5d2de244af8',
			token          : project,
			encodingAESKey : '',
			url            : `http://filtration.${project}.com.cn`,
			oauth          : '/wechat/oauth/login',
			local          : '47.100.162.54',
			pay : {
				partnerKey : "C373DDCA1B97E59F7424553D36795A62",
				appId      : "wx06c82c3cbb012752",
				mchId      : "1493918942",
				notifyUrl  : `http://filtration.${project}.com.cn/server/payment`,
				// pfx        : fs.readFileSync(rootPath + '/setting/apiclient_cert.p12')
			}
		}
	},
	// 线上产品配置
	production : {
		root         : rootPath,
		port         : port,
		maxOrderTime : 1080,
		app          : {
			name : `${project}`,
			local: 'http://localhost:' + port
		},
		mongo : `mongodb://127.0.0.1/${project}`,
		main  : {
			languagePath : rootPath + '/language/'
		},
		cookie : {
			secret      : project,
			sessionName : 'session'
		},
		yunpian : {
			apiKey  : '336622ee05a97de6b23b5c6a5a76e3f7'
		},
		wechat : {
			appid          : 'wxee206e1414616120',
			appsecret      : '26c3defea7c82775698b0e9fcceb78d0',
			token          : project,
			encodingAESKey : 'RwWdU9k689mFy5JF2BcQqpdXf7AKAcPLXEeivy6SE3P',
			url            : `http://sportgochina.com`,
			oauth          : '/wechat/oauth/login',
			local          : '47.100.162.54',
			pay : {
				partnerKey : "",
				appId      : "wxee206e1414616120",
				mchId      : "",
				notifyUrl  : ``,
				// pfx        : fs.readFileSync(rootPath + '/setting/apiclient_cert.p12')
			}
		}
	}
}

module.exports = config[env];
