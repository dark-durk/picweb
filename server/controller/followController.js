const followDao = require('../db/followDao')
const vertoken = require('../util/token')

// 关注行为
exports.follow = function (req, res) {
  let concern = req.body.concern
  let token = req.headers['authorization']
  vertoken.verToken(token).then(data => {
    let fans = data.id
    followDao.query({ concern: concern, fans: fans }, (result) => {
      if (result.length > 0) {  // 已存在记录，直接修改字段
        if (result[0].is_delete == 0) {
          followDao.update({ id: result[0].id, is_delete: 1 }, (r) => {
            if (r.affectedRows > 0) {
              res.json({ code: 1 })
            } else {
              res.json({ code: 0 })
            }
          })
        } else {
          followDao.update({ id: result[0].id, is_delete: 0 }, (r) => {
            if (r.affectedRows > 0) {
              res.json({ code: 1 })
            } else {
              res.json({ code: 0 })
            }
          })
        }
      } else { //不存在，插入一条记录
        followDao.insert({ id: 0, concern: concern, fans: fans, is_delete: 1 }, (r) => {
          if (r.affectedRows > 0) {
            res.json({ code: 1 })
          } else {
            res.json({ code: 0 })
          }
        })
      }
    })
  })
}
// 判断用户是否关注了某位用户
exports.isFollow = function (req, res) {
  let concern = req.body.concern
  let token = req.headers['authorization']
  vertoken.verToken(token).then(data => {
    let fans = data.id
    followDao.query({ concern: concern, fans: fans }, (result) => {
      if (result.length == 0 || result[0].is_delete == 0) {
        res.json({ isFollow: 0 })
      } else {
        res.json({ isFollow: 1 })
      }
    })
  })
}
// 获取粉丝,关注者的数量
exports.getFollowCount = function (req, res) {
  let uid = req.body.uid
  followDao.getFollowCount(uid, result => {
    let fansCount = result[0].fansCount
    let concernCount = result[0].concernCount
    res.json({ fansCount: fansCount, concernCount: concernCount })
  })
}
// 根据id获取用户粉丝或者关注者的信息数组
exports.getFollowList = function (req, res) {
  let uid = req.body.uid
  let flag = req.body.flag
  followDao.getFollowList({ uid: uid, flag: flag }, result => {
    res.json(result)
  })
}