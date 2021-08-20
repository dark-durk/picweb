const sql = require('./sql')
const base = require('./base')
const getConn = require('./dbconfig')
const conn = getConn()

module.exports = {
  getPic: function (sql, callback) {
    base.executeQuery2(sql, callback)
  },
  getPhotoDetails: function (params, callback) {
    base.executeQuery('select image.id,url,tit,des,uid,username,head_img,type from ', params, callback)
  },
  getPersonAllImg: function (params, callback) {
    base.executeQuery('select url,image.id,uid,username,pass,unpass_reason from ', params, callback)
  },
  deletePhoto: function (params, callback) {
    base.execute(sql.imageSql.delete, params, callback)
  },
  editPhoto: function (params, callback) {
    base.execute(sql.imageSql.update, params, callback)
  },
  // 更新图片点击量
  updateCount: function (params, callback) {
    let query = conn.query(sql.imageSql.updateCount, params, (err, result) => {
      if (err) {
        console.log('[execute ERROR] - ', err.message);
        return;
      }
      callback(result);
    })
    // console.log('sql======' + query.sql)
  },

  getUnpassPic: function (callback) {
    base.executeQuery2(sql.imageSql.queryUnpassPic, callback)
  },
  editPicPass: function (params, callback) {
    base.execute(sql.imageSql.update, params, callback)
  },
}