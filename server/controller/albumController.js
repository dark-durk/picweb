const albumDao = require('../db/albumDao')

exports.createAlbum = function (req, res) {
  let uid = req.body.uid
  let tit = req.body.tit
  let des = req.body.des
  let album = { uid: uid, tit: tit }
  if (des) {
    album.des = des
  }
  albumDao.createAlbum(album, result => {
    if (result.affectedRows > 0) {
      res.json({ code: 1, id: result.insertId })
    } else {
      res.json({ code: 0 })
    }
  })
}
exports.deleteAlbum = function (req, res) {
  let id = req.body.id
  albumDao.deleteAlbum({ id: id }, result => {
    if (result.affectedRows > 0) {
      res.json({ code: 1 })
    } else {
      res.json({ code: 0 })
    }
  })
}
// 获取用户创建的所有的影集
exports.getAlbums = function (req, res) {
  let uid = req.body.uid
  albumDao.getAlbums({ uid: uid }, result => {
    res.json({ code: 1, albums: result })
  })
}
exports.getAlbumById = function (req, res) {
  let id = req.body.id
  albumDao.getAlbumById({ id: id }, result => {
    res.json({ code: 1, album: result[0] })
  })
}
// 通过图片id获取包含它的所有影集id
exports.getAlbumsIdByPic = function (req, res) {
  let image_id = req.body.image_id
  albumDao.getAlbumsIdByPic(image_id, result => {
    let arr = []
    for (let i = 0; i < result.length; i++) {
      arr.push(result[i].album_id)
    }
    res.json({ albumsId: arr })
  })
}
// 向影集中加入图片
exports.addPicAlbum = function (req, res) {
  let obj = {
    album_id: req.body.album_id,
    image_id: req.body.image_id,
    url: req.body.url
  }
  albumDao.addPicAlbum(obj, result => {
    res.json({ code: 1, msg: '成功' })
  })
}
// 向影集中删除图片
exports.deletePicAlbum = function (req, res) {
  let obj = {
    album_id: req.body.album_id,
    image_id: req.body.image_id,
  }
  albumDao.deletePicAlbum(obj, result => {
    res.json({ code: 1, msg: '成功' })
  })
}
// 获取影集中的所有图片
exports.getPicByAlbumId = function (req, res) {
  let album_id = req.body.album_id
  albumDao.getPicByAlbumId(album_id, result => {
    res.json({ code: 1, imgList: result })
  })
}
//  设置影集封面
exports.setAlbumCoverPic = function (req, res) {
  let album_id = req.body.album_id
  let url = req.body.url
  albumDao.setAlbumCoverPic({ id: album_id, cover_pic: url }, result => {
    res.json({ code: 1 })
  })
}