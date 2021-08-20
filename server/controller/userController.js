const userDao = require('../db/userDao')
const up = require('../util/upload')
const date = require('../util/date')
const vertoken = require('../util/token')
const sms = require('../util/sms')
const base = require('../db/base')
const { json } = require('body-parser')
const { commentSql } = require('../db/sql')
// 用户登录
exports.login = function (req, res) {
  let username = req.body.username
  let password = req.body.password

  let params = { username: username, password: password }
  userDao.query(params, (result) => {
    // console.log(result)
    if (result.length > 0) {
      //生成token
      vertoken.setToken(username, result[0].id, result[0].role).then((token) => {
        let data = {
          msg: "登陆成功",
          token: token
        }
        if (result[0].role === 'admin') {//管理员
          data.code = 2
          data.url = "/manager/user_management"
          res.send(JSON.stringify(data))
        } else {//普通用户
          data.code = 1
          data.url = "/community/discover"
          res.send(JSON.stringify(data))
        }
      })
    } else {
      let data = {
        code: 0,
        msg: "用户名或者密码错误，请重新登录！",
        url: "/login"
      }
      res.send(JSON.stringify(data))
    }
  })
}
exports.sendSms = function (req, res) {
  let phoneNum = req.body.phoneNum
  sms(phoneNum).then(function (data) {
    res.json({ code: 1, smsCode: data[0] })
  }).catch(function (err) {
    res.json({ code: 0, msg: '失败' })
  })
}
// 用户注册
exports.register = function (req, res) {
  let username = req.body.username
  let password = req.body.password
  let phoneNum = req.body.phoneNum
  userDao.insert({ id: 0, username: username, password: password, phone_num: phoneNum, role: 'normal' }, (result) => {
    if (result.affectedRows > 0) {
      res.json({ code: 1, url: '/login' })
    } else {
      res.send('注册失败')
    }
  })
}
// 获取一个用户所有信息
exports.getUserInfo = function (req, res) {
  let token = req.headers['authorization'];
  if (token == undefined || token == '') {
    return
  }
  vertoken.verToken(token).then((data) => {
    // console.log(data)
    let id = data.id
    userDao.query({ id: id }, function (result) {
      let headImg = result[0].head_img
      let sex = result[0].sex
      let birthday = date.toDate(result[0].birthday)
      let phoneNum = result[0].phone_num
      let username = result[0].username
      let password = result[0].password
      let user = { id: id, password: password, username: username, headImg: headImg, sex: sex, birthday: birthday, phoneNum: phoneNum }
      res.json(user)
    })
  })
}
// 更新用户信息
exports.updateUserInfo = function (req, res) {
  let token = req.headers['authorization']
  vertoken.verToken(token).then((data) => {
    let id = data.id
    let role = data.role
    let user = { id: id }
    if (role === 'admin') { //管理员重置密码
      user.id = req.body.id
      user.password = req.body.password
      userDao.update(user, function (result) {
        if (result.affectedRows > 0) {
          res.json({ code: 1, msg: "保存成功" })
        } else {
          res.json({ code: 0, msg: "保存失败" })
        }
      })
    } else {
      let headImg = req.files[0]
      let sex = req.body.sex
      let birthday = req.body.birthday
      let phoneNum = req.body.phoneNum
      let password = req.body.password
      if (phoneNum) {
        user.phone_num = phoneNum
      }
      if (sex) {
        user.sex = sex
      }
      if (birthday) {
        user.birthday = birthday
      }
      if (password) {
        user.password = password
      }
      if (!headImg) {
        userDao.update(user, function (result) {
          if (result.affectedRows > 0) {
            res.json({ code: 1, msg: "保存成功" })
          } else {
            res.json({ code: 0, msg: "保存失败" })
          }
        })
      } else {
        up.upload(headImg, ['.jpg', '.png'], '/public/headImg/', function (result) {
          if (result.code == 1) {
            let url = result.file_url
            user.head_img = url
            userDao.update(user, function (result) {
              if (result.affectedRows > 0) {
                res.json({ code: 1, msg: "保存成功" })
              } else {
                res.json({ code: 0, msg: "保存失败" })
              }
            })
          } else {
            console.log('usercontroller.updateUserInfo===' + result)
            res.json(result)
          }
        })
      }
    }
  })
}

// 用户上传图片
exports.uploadSinglePic = function (req, res) {
  let photo = req.files[0]
  let tit = req.body.tit
  let type = req.body.type
  let des = req.body.des
  let token = req.headers['authorization']
  vertoken.verToken(token).then((data) => {
    let uid = data.id
    up.upload(photo, ['.jpg', '.png'], '/public/images/', function (result) {
      if (result.code == 1) {
        let url = result.file_url
        let img = { id: 0, uid: uid, tit: tit, url: url, type: type, pass: 0 }
        if (des.length > 0) {
          img.des = des
        }
        userDao.insertImg(img, function (result) {
          if (result.affectedRows > 0) {
            res.json({ code: 1, msg: "上传图片成功" })
          } else {
            res.json({ code: 0, msg: "上传图片失败" })
          }
        })
      } else {
        console.log('usercontroller.uploadSinglePic===' + result)
        res.json(result)
      }
    })
  })
}

// 检查用户名是否存在
exports.checkUsername = function (req, res) {
  let username = req.body.username
  userDao.query({ username: username }, function (result) {
    if (result.length == 0) {
      res.json({ code: 0, msg: '用户名不存在' })
    } else {
      res.json({ code: 1, msg: '用户名存在' })
    }
  })
}
// 检查手机号是否存在
exports.checkPhone = function (req, res) {
  let phoneNum = req.body.phoneNum
  let token = req.headers['authorization']
  vertoken.verToken(token).then((data) => {
    let uid = data.id
    userDao.query({ phone_num: phoneNum }, function (result) {
      if (result.length == 0 || uid == result[0].id) {
        res.json({ code: 0, msg: '' })
      } else {
        res.json({ code: 1, msg: '手机号存在' })
      }
    })
  })
}

// 检查用户查看的主页是否是自己的
exports.checkUser = function (req, res) {
  let id = req.query.uid  //被查看用户的id
  let token = req.headers['authorization']
  vertoken.verToken(token).then((data) => {
    let uid = data.id //当前登陆用户的id
    let role = data.role
    userDao.query({ id: id }, function (result) {
      let username = result[0].username
      let headImg = result[0].head_img
      if (role == 'admin') { //管理员查看用户主页
        res.json({ code: 1, isAdmin: true, username: username, headImg: headImg })
        return
      }
      if (uid == id) {  //查看的是自己的主页
        res.json({ code: 1, username: username, headImg: headImg })
      } else {
        res.json({ code: 0, username: username, headImg: headImg })
      }
    })
  })
}
// 获取所有用户信息
exports.getUsers = function (req, res) {
  userDao.getUsers(function (result) {
    for (let i = 0; i < result.length; i++) {
      result[i].birthday = date.toDate(result[i].birthday)
    }
    res.send(JSON.stringify(result))
  })
}
// 删除一个用户
exports.deleteUser = function (req, res) {
  let id = req.body.id
  let sql = 'select url from image where uid=' + id
  new Promise((resolve, reject) => {
    base.executeQuery2(sql, function (result2) {
      for (let i = 0; i < result2.length; i++) {
        let url = result2[i].url.split('/')
        up.deleteFile(url[url.length - 1])
      }
    })
    resolve()
  }).then(() => {
    userDao.deleteUser({ id: id }, function (result) {
      if (result.affectedRows > 0) {
        res.json({ code: 1, msg: '删除成功!' })
      } else {
        res.json({ code: 0, msg: '删除失败!' })
      }
    })
  })
}

function getCountSql(table, time, param, callback) {
  let sql = 'select a.click_date,ifnull(b.count,0) as count from (SELECT curdate() as click_date union all SELECT date_sub(curdate(), interval 1 day) as click_date union all SELECT date_sub(curdate(), interval 2 day) as click_date union all SELECT date_sub(curdate(), interval 3 day) as click_date union all SELECT date_sub(curdate(), interval 4 day) as click_date union all  SELECT date_sub(curdate(), interval 5 day) as click_date union all SELECT date_sub(curdate(), interval 6 day) as click_date) a left join(select DATE_FORMAT(' + time + ', "%Y-%m-%d") as datetime, count(*) as count from ' + table + ' where ' + param[0] + '=' + param[1] + ' group by DATE_FORMAT(' + time + ', "%Y-%m-%d")) b on a.click_date = b.datetime  order by a.click_date'
  base.executeQuery2(sql, function (result) {
    let data = []
    for (let i = 0; i < result.length; i++) {
      let time = date.toDateTime(result[i].click_date)
      let count = result[i].count
      data.push([time, count])
    }
    callback(data)
  })
}
// 最近7天的关注/粉丝数量变化
exports.getCount = function (req, res) {
  let id = req.body.id
  let data = {}
  getCountSql('follow', 'time', ['fans', id], res => {
    data.concern = res
  })
  getCountSql('follow', 'time', ['concern', id], res => {
    data.fans = res
  })
  getCountSql('comment', 'time', ['uid', id], res => {
    data.comment = res
  })
  getCountSql('image', 'upload_date', ['uid', id], res => {
    data.pics = res
  })
  setTimeout(() => {
    res.json({ data: data })
  }, 1000)
}