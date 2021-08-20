const sql = require('./sql')
const base = require('./base')
const getConn = require('./dbconfig')
const conn = getConn()

module.exports = {
  createAlbum: function (params, callback) {
    base.execute(sql.albumSql.insert, params, callback)
  },
  deleteAlbum: function (params, callback) {
    base.execute(sql.albumSql.delete, params, callback)
  },
  getAlbums: function (params, callback) {
    base.executeQuery(sql.albumSql.query, params, callback)
  },
  getAlbumById: function (params, callback) {
    base.executeQuery('select * from album where', params, callback)
  },
  setAlbumCoverPic: function (params, callback) {
    base.execute('update album set ', params, callback)
  },
  getAlbumsIdByPic: function (params, callback) {
    let sql = 'select album_id from album_image where find_in_set(' + params + ',image_id)'
    base.executeQuery2(sql, callback)
  },
  getPicByAlbumId: function (params, callback) {
    let sql = 'select * from (select image_id from album_image where album_image.album_id=' + params + ') as a left join image on a.image_id=image.id'
    base.executeQuery2(sql, callback)
  },
  addPicAlbum: function (params, callback) {
    let sql = 'insert into album_image'
    base.execute(sql, params, callback)
    callback(result);
  },
  deletePicAlbum: function (params, callback) {
    let sql = 'delete from album_image where album_id=' + params.album_id + ' and image_id=' + params.image_id
    base.executeQuery2(sql, callback)
    callback(result);
  }
}