const sql = require('./sql')
const base = require('./base')

module.exports = {
  query: function (params, callback) {
    base.executeQuery(sql.zanSql.query, params, callback)
  },
  insert: function (params, callback) {
    base.execute(sql.zanSql.insert, params, callback)
  },
  update: function (params, callback) {
    base.execute(sql.zanSql.update, params, callback)
  },
  countZan: function (params, callback) {
    base.executeQuery(sql.zanSql.count, params, callback)
  }
}