const imageDao = require('../db/imageDao')
const upload = require('../util/upload')

exports.getPic = function (req, res) {
  let t = req.query.t
  type = req.query.type
  let page = req.query.page //已加载图片的数量
  if (t == 'rating') {
    let sql = `select url,image.id,uid,username,head_img,type from image left join user on image.uid=user.id where pass=1 ${type == '所有' ? '' : 'and type="' + type + '"'} order by click_count desc limit ${page * 20},20`
    imageDao.getPic(sql, function (result) {
      res.send(JSON.stringify(result))
    })
  }
  if (t == 'fresh') {
    let sql = `select url,image.id,uid,username,head_img,type from image left join user on image.uid=user.id where pass=1 ${type == '所有' ? '' : 'and type="' + type + '"'} order by image.upload_date desc limit ${page * 20},20`
    imageDao.getPic(sql, function (result) {
      res.send(JSON.stringify(result))
    })
  }

}
// 根据图片id获取它的详细信息
exports.getPhotoDetails = function (req, res) {
  let id = req.query.pId
  let sql = 'image join user on image.uid=`user`.id where image.id=' + id
  imageDao.getPhotoDetails(sql, function (result) {
    res.send(JSON.stringify(result))
  })
  imageDao.updateCount([id], function (result) {
    // console.log('更新图片点击量成功------' + result)
  })
}
// 根据用户id返回他上传过的所有图片
exports.getPersonAllImg = function (req, res) {
  let uid = req.query.uid
  let page = req.query.page
  let pass = req.query.pass
  if (typeof (pass) == 'object') {
    let sql = 'image join user on image.uid=user.id where user.id=' + uid + ' and pass in (' + pass[0] + ',' + pass[1] + ')' + ' limit ' + (page * 20) + ',20'
    imageDao.getPersonAllImg(sql, function (result) {
      res.send(JSON.stringify(result))
    })
  } else {
    let sql = 'image join user on image.uid=user.id where user.id=' + uid + ' and pass=' + pass + ' limit ' + (page * 20) + ',20'
    imageDao.getPersonAllImg(sql, function (result) {
      res.send(JSON.stringify(result))
    })
  }
}
// 根据传入的图片id删除一张图片
exports.deletePhoto = function (req, res) {
  let pid = req.body.pid
  let url = req.body.url.split('/')
  imageDao.deletePhoto({ id: pid }, function (result) {
    if (result.affectedRows > 0) {
      upload.deleteFile(url[url.length - 1])
      res.json({ msg: '删除图片成功' })
    } else {
      res.json({ msg: '删除图片失败' })
    }
  })
}
// 编辑图片信息
exports.editPhoto = function (req, res) {
  let pid = req.body.img.id
  let tit = req.body.img.tit
  let des = req.body.img.des
  let type = req.body.img.type
  let img = { id: pid, tit: tit, des: des, type: type, pass: 0 }
  imageDao.editPhoto(img, function (result) {
    if (result.affectedRows > 0) {
      res.json({ code: 1, msg: '编辑图片成功' })
    } else {
      res.json({ code: 0, msg: '编辑图片失败' })
    }
  })

}
// 获取所有未审核过的图片，pass=0
exports.getUnpassPic = function (req, res) {
  imageDao.getUnpassPic(result => {
    res.send(JSON.stringify(result))
  })
}
// 修改pass的值，图片审核通过--令pass=1；图片上传未审核--pass=0；审核未通过--pass=2
exports.editPicPass = function (req, res) {
  let id = req.body.id
  let pass = req.body.pass
  let reason = ''
  new Promise((resolve, reject) => {
    if (pass == 2) {
      reason = req.body.reason.join(';')
    }
    resolve()
  }).then(() => {
    imageDao.editPicPass({ id: id, pass: pass, unpass_reason: reason }, result => {
      if (result.affectedRows > 0) {
        res.json({ code: 1 })
      } else {
        res.json({ code: 0 })
      }
    })
  })
}