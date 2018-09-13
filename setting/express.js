/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: express 配置
 */

'use strict';

const express  = require('express'),
glob           = require('glob'),
logger         = require('morgan'),
cookieParser   = require('cookie-parser'),
bodyParser     = require('body-parser'),
compress       = require('compression'),
methodOverride = require('method-override'),
jwt            = require('jwt-simple'),
zlib           = require('zlib'),
cors           = require('cors'),
session        = require('express-session'),
livereload     = require('connect-livereload'),
mongoStore     = require('connect-mongo')(session);


module.exports = (app, config) => {
    // app.use(express.static(config.root + '/app/view'));
    app.use(express.static(config.root + '/public'));
    
    // app.set('views', config.root + '/app/view');
    // app.engine('html', ejs.__express);
    // app.set('view engine', 'html');

    app.use(livereload());
    app.use(logger('dev'))
    app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({
			extended : true,
			limit    : 2000000
		})
    )

    app.use(methodOverride());
    app.use(cookieParser());
    app.use(compress({
		level    : zlib.Z_BEST_COMPRESSION,
		memLevel : 1
    }));

    app.use(session({
		name              : config.cookie.sessionName,
		secret            : config.cookie.secret,
		store             : new mongoStore({url: config.mongo, autoRemove: 'native', ttl: 10 * 60 }),
		saveUninitialized : true,
		resave            : false,
		cookie            : { httpOnly: true, maxAge: 1000 * 3600 * 24 }
    }));
    
    app.use(cors({
        origin               : "*",
        methods              : "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders       : ['Content-Type', 'Content-Length', 'token', 'Accept', 'X-Requested-With'],
        exposedHeaders       : ['Content-Range', 'X-Content-Range'],
        preflightContinue    : false,
        optionsSuccessStatus : 204
    }))

    socket.on('connection', socket => {
        console.log('start socket', socket.id)
    })


    //登录拦截器

    let privateUrl = [
        "/user",
        "/payment/wechat"
    ];

    app.use((req, res, next) => {
        const url = req._parsedUrl.pathname;
        console.log('pathname', privateUrl.includes(url))
        if (privateUrl.includes(url)) {
            const token = req.headers.token;
            console.log('token', token)
            if (token && token != 'null') {
                console.log('拦截？')
                try {
                    const u = jwt.decode(token, config.app.name);
                    next();

                    // let member_id = '';
                    // if(u.iss.user && typeof u.iss.user == "string") member_id = u.iss.user;
                    // else if(u.iss._id) member_id = u.iss._id;
                    // else member_id = u.iss.user._id
                    // member_service.getById(member_id, user => {
                    //     req.session.user = user;
                    //     next()
                    // })

                } catch (err) {
                    console.error(err)
                    return res.status(401).send({err : 401});
                }
            } else {
                res.status(401).send({err : 401});
                return
            }
        } else next();
    });

    // express 路由处理
    const routers = glob.sync(config.root + '/app/router/*.js');
    routers.forEach(router => {
        console.log('Loading Router：', router)
        require(router)(app)
    })

    app.use((req, res, next) => {
        var err = new Error('Not Found')
        err.status = 404
        res.send('404', {
            message : '您访问的页面不存在',
            error   : err,
            title   : '404'
        })
    })

    app.use((err, req, res, next) => {
        console.log('err', err)
        // res.status(err.status || 500)
        res.send('error', {
            message: err.message,
            error  : {},
            title  : 'error'
        })
    })
    
}