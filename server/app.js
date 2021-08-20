/* eslint-disable no-unused-vars */
// 加载模块
const express = require('express')
const app = express() // 执行express返回express实例对象
const path = require('path')
const bodyparser = require('body-parser') // 这个模块是用于简化网页提交方法的模块
const hbs = require('hbs') // 加载hbs模块,这个模块是node中常用的模板渲染引擎模板
const multer = require('multer');              // 文件上传需要用的到模块
const expressJwt = require('express-jwt');


// 加载自定义模块
const routes = require('./routes/api') // 路由模块
const ws = require("./util/ws"); //websocket
const vertoken = require('./util/token')


// 使用body这个模块方便输入数据的操作
app.use(bodyparser.json());     // 使用boddyparser中间件
app.use(bodyparser.urlencoded({ extended: true }));
let filePath = __dirname + '/public/tmp'
app.use(multer({ dest: filePath }).array('image'));       // 设置文件上传的配置,注意前台文件上传时的名字要叫image

// 调用路由模块, 并且把服务器实例对象进行传参
routes(app)

// 解析token获取用户信息
app.use(function (req, res, next) {
  var token = req.headers['authorization'];
  if (token == undefined) {
    return next();
  } else {
    vertoken.verToken(token).then((data) => {
      req.data = data;
      return next();
    }).catch((error) => {
      return next();
    })
  }
});
//验证token是否过期并规定哪些路由不用验证
app.use(expressJwt({
  secret: 'mes_qdhd_mobile_xhykjyxgs', // 签名的密钥
  algorithms: ['HS256'],
  credentialsRequired: false   //// 无token请求不进行解析，并且抛出异常
}).unless({
  path: ['/', '/api/login', '/api/register', ' /^\/community\/discover?t.*/'] // 指定路径不经过 Token 解析
}));
//当token失效返回提示信息
app.use(function (err, req, res, next) {
  if (err.status == 401) {
    return res.status(401).json({ msg: 'token失效', code: 0 });
  }
});

// app.use(express.static(__dirname + '/public/dist'))	// 设置vue项目静态资源文件夹
app.use('/public/images', express.static(path.join(__dirname, '/public/images'))) //设置图片保存地址
app.use('/public/headImg', express.static(path.join(__dirname, '/public/headImg')))

app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type,Authorization");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

let server = ws.server


app.listen(8888, (err) => {
  if (err) {
    console.log('服务器开启失败，详细信息为：')
    console.log(err)
  } else {
    console.log('服务器开启成功：端口为：8888')
  }
})
