const sql = require('./sql')
const base = require('./base')
const { query } = require('./userDao')

module.exports = {
  // 插入一条用户评论
  insert: function (params, callback) {
    base.execute(sql.commentSql.insert, params, callback)
  },
  // 删除一条用户评论
  deleteComment: function (params, callback) {
    base.execute(sql.commentSql.delete, params, callback)
  },
  // 查询该作品此时已有的所有评论
  getComments: function (params, callback) {
    base.executeQuery2('select `comment`.*,`user`.head_img,`user`.username from `comment` left join `user` on `comment`.uid=`user`.id where compose_id=' + params.compose_id + ' order by time desc', callback)
  }
}