const sql = require('./sql')
const base = require('./base')

module.exports = {
  // 查询
  query: function (params, callback) {
    base.executeQuery(sql.userSql.query, params, callback)
  },
  // 插入一条用户数据--用户名，id，密码
  insert: function (params, callback) {
    base.execute(sql.userSql.insert, params, callback)
  },
  // 更新用户信息
  update: function (params, callback) {
    base.execute(sql.userSql.update, params, callback)
  },
  // 用户上传一张图片
  insertImg: function (params, callback) {
    base.execute(sql.userSql.insertImg, params, callback)
  },
  getUsers: function (callback) {
    base.executeQuery2(sql.userSql.queryAll, callback)
  },
  // 删除一个用户
  deleteUser: function (params, callback) {
    base.execute(sql.userSql.delete, params, callback)
  }
}