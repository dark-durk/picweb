const sql = require('./sql')
const base = require('./base')

module.exports = {
  query: function (params, callback) {
    base.executeQuery(sql.followSql.query, params, callback)
  },
  insert: function (params, callback) {
    base.execute(sql.followSql.insert, params, callback)
  },
  update: function (params, callback) {
    base.execute(sql.followSql.update, params, callback)
  },
  getFollowCount: function (param, callback) {
    base.executeQuery2('select sum(concern=' + param + ') as fansCount,sum(fans=' + param + ') as concernCount from follow where is_delete=1', callback)
  },
  getFollowList: function (params, callback) {
    if (params.flag == 'concern') {
      base.executeQuery2('select concern,fans,is_delete,`user`.id,username,head_img from follow left join `user` on follow.concern=`user`.id where is_delete=1 and fans=' + params.uid, callback)
    } else {
      base.executeQuery2('select concern,fans,is_delete,`user`.id,username,head_img from follow left join `user` on follow.fans=`user`.id where is_delete=1 and concern=' + params.uid, callback)
    }
  }
}