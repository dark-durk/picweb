const commentDao = require('../db/commentDao')
const base = require('../db/base')
const vertoken = require('../util/token')

// 增加一条评论
exports.addComment = function (req, res) {
  let composeId = req.body.composeId
  let content = req.body.content
  let type = req.body.type
  let token = req.headers['authorization']
  vertoken.verToken(token).then((data) => {
    let uid = data.id
    let comment = { id: 0, uid: uid, compose_id: composeId, content: content, compose_type: type }
    commentDao.insert(comment, (result) => {
      if (result.affectedRows > 0) {
        res.json({ code: 1, msg: '评论成功' })
      } else {
        res.json({ code: 0, msg: '评论失败' })
      }
    })

  })
}
// 根据评论id删除一条评论
exports.deleteComment = function (req, res) {
  let id = req.body.id
  commentDao.deleteComment({ id: id }, (result) => {
    if (result.affectedRows > 0) {
      res.send('评论删除成功')
    } else {
      res.send('评论删除失败')
    }
  })
}
// 进入作品页面时展示已有的所有相关评论
exports.getComments = function (req, res) {
  let compose_id = req.body.pId
  let token = req.headers['authorization']
  if (token) {
    vertoken.verToken(token).then((data) => {
      let uid = data.id
      commentDao.getComments({ compose_id: compose_id }, (result) => {
        res.send(JSON.stringify({ comments: result, uid: uid }))
      })
    })
  } else {  //用户没有登录
    commentDao.getComments({ compose_id: compose_id }, (result) => {
      res.send(JSON.stringify({ comments: result }))
    })
  }
}