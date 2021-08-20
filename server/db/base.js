const getConn = require('./dbconfig')
const conn = getConn()

module.exports = {
  // sql查询语句拼接--where后面的部分
  splice: function (querySql, where) {
    if (typeof where == 'object') {
      let where_arr = [];
      for (key in where) {
        where_arr.push("`" + key + "`='" + where[key] + "'");
      }
      querySql = querySql + where_arr.join(' and ');
    }
    if (typeof where == 'string') {
      querySql = querySql + where;
    }
    return querySql;
  },
  // 更新语句拼接，set后面部分
  // { id: id, head_img: url, sex: sex, birthday: birthday, phone_num: phoneNum }
  updateSplice: function (updateSql, params) {
    let arr = []
    let keys_arr = Object.keys(params)
    let key = keys_arr[0]
    let index = keys_arr[0] + "=" + params[key]
    for (let i = 1; i < keys_arr.length; i++) {
      key = keys_arr[i]
      arr.push("`" + keys_arr[i] + "`='" + params[key] + "'")
    }
    updateSql = updateSql + arr.join(',') + ' where ' + index
    return updateSql
  },
  // 插入语句拼接
  // insertSplice('insert into image', { id: 0, uid: 9, tit: 'tit', url: 'url', type: 'type' })
  // => insert into image(id,uid,tit,url,type) values('0','9','tit','url','type')
  insertSplice: function (insertSql, params) {
    let keys = []
    let values = []
    for (let key in params) {
      keys.push(key)
      values.push("'" + params[key] + "'")
    }
    insertSql = `${insertSql}(${keys.join(',')}) values(${values.join(',')})`
    return insertSql
  },
  // 执行一条非查询sql语句
  execute: function (sql, params, callback) {
    if (sql.indexOf('update') == 0) {
      sql = this.updateSplice(sql, params)
    } else if (sql.indexOf('insert') == 0) {
      sql = this.insertSplice(sql, params)
    }
    let query = conn.query(sql, params, (err, result) => {
      if (err) {
        console.log('[execute ERROR] - ', err.message);
        return;
      }
      callback(result);
    })
    // console.log('sql======' + query.sql)
    // conn.end()
  },
  // 执行一条查询sql语句
  executeQuery: function (sql, params, callback) {
    sql = this.splice(sql, params)
    let query = conn.query(sql, (err, result) => {
      if (err) {
        console.log('[executeQuery ERROR] - ', err.message);
        return;
      }
      callback(result);
    })
    // console.log('sql======' + query.sql)
  },
  executeQuery2: function (sql, callback) {
    let query = conn.query(sql, (err, result) => {
      if (err) {
        console.log('[executeQuery ERROR] - ', err.message);
        return;
      }
      callback(result);
    })
    // console.log('sql======' + query.sql)
  }
}