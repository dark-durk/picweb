const { token } = require('morgan')
const zanDao = require('../db/zanDao')
const vertoken = require('../util/token')

// 点赞行为,先进行查询，用户是否对该作品点过赞，存在记录就修改is_delete字段，不存在就一条记录

exports.dianZan = function (req, res) {
  let compose_id = req.body.composeId
  let token = req.headers['authorization']
  vertoken.verToken(token).then(data => {
    let uid = data.id
    zanDao.query({ compose_id: compose_id, uid: uid }, (result) => {
      if (result.length > 0) {  // 已存在记录，直接修改字段
        if (result[0].is_delete == 0) {
          zanDao.update({ id: result[0].id, is_delete: 1 }, (r) => {
            if (r.affectedRows > 0) {
              res.json({ code: 1 })
            } else {
              res.json({ code: 0 })
            }
          })
        } else {
          zanDao.update({ id: result[0].id, is_delete: 0 }, (r) => {
            if (r.affectedRows > 0) {
              res.json({ code: 1 })
            } else {
              res.json({ code: 0 })
            }
          })
        }
      } else { //不存在，插入一条记录
        zanDao.insert({ id: 0, compose_id: compose_id, uid: uid, is_delete: 1 }, (r) => {
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
// 获取点赞数
exports.getZanCount = function (req, res) {
  let compose_id = req.body.composeId
  let token = req.headers['authorization']
  if (!token) {
    zanDao.countZan({ compose_id: compose_id, is_delete: 1 }, (r) => {
      res.json({ likeCount: r[0].likeCount, isDelete: 0 })
    })
  } else {
    vertoken.verToken(token).then(data => {
      let uid = data.id
      zanDao.query({ compose_id: compose_id, uid: uid }, (result) => {
        zanDao.countZan({ compose_id: compose_id, is_delete: 1 }, (r) => {
          if (result.length == 0) {
            res.json({ likeCount: r[0].likeCount, isDelete: 0 })
          } else {
            res.json({ likeCount: r[0].likeCount, isDelete: result[0].is_delete })
          }
        })
      })
    })
  }
}