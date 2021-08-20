const userController = require('../controller/userController')
const imageController = require('../controller/imageController')
const commentController = require('../controller/commentController')
const zanController = require('../controller/zanController')
const followController = require('../controller/followController')
const albumController = require('../controller/albumController')
const ws = require('../util/ws')

module.exports = function (app) {
  //登陆注册
  app.post('/api/login', userController.login)
  app.post('/api/register', userController.register)
  // 发送短信验证码
  app.post('/api/sendSms', userController.sendSms)
  //更新个人用户信息
  app.post('/api/community/personinfo', userController.updateUserInfo)
  //获取个人用户信息
  app.post('/api/community/getUserInfo', userController.getUserInfo)
  // 检查用户名是否存在
  app.post('/api/checkUsername', userController.checkUsername)
  // 检查手机号是否存在
  app.post('/api/checkPhone', userController.checkPhone)
  // 检查用户查看的主页是否是自己的
  app.get('/api/checkUser', userController.checkUser)
  // 获取所有用户信息
  app.post('/api/getUsers', userController.getUsers)
  // 删除一个用户
  app.post('/api/deleteUser', userController.deleteUser)
  // 最近7天的关注/粉丝数量变化
  app.post('/api/getCount', userController.getCount)


  //图片展示
  app.get('/api/community/discover', imageController.getPic)
  //上传单张图片
  app.post('/api/upload/single_pic', userController.uploadSinglePic)
  // 获取图片详情页面,图片标题,描述等
  app.get('/api/community/photo-details', imageController.getPhotoDetails)
  // 获取某一个用户上传的所有图片
  app.get('/api/personpage', imageController.getPersonAllImg)
  // 根据传入的图片id删除一张图片
  app.post('/api/deletePhoto', imageController.deletePhoto)
  // 根据传入的图片id编辑一张图片
  app.post('/api/single_pic_edit', imageController.editPhoto)

  // 用户评论存入数据库
  app.post('/api/addComment', commentController.addComment)
  // 查询某一作品下的所有评论
  app.post('/api/getComments', commentController.getComments)
  // 根据id删除某一条评论
  app.post('/api/deleteComment', commentController.deleteComment)

  // 用户点赞行为
  app.post('/api/dianzan', zanController.dianZan)
  app.post('/api/getzancount', zanController.getZanCount)
  // 关注行为
  app.post('/api/follow', followController.follow)
  app.post('/api/isfollow', followController.isFollow)
  // 获取粉丝和关注者的数量
  app.post('/api/getfollowcount', followController.getFollowCount)
  // 获取用户所有的粉丝或者关注者的头像，用户名
  app.post('/api/getfollowlist', followController.getFollowList)

  // 创建一个影集
  app.post('/api/createAlbum', albumController.createAlbum)
  // 删除一个影集
  app.post('/api/deleteAlbum', albumController.deleteAlbum)
  // 获取用户创建的所有影集
  app.post('/api/getAlbums', albumController.getAlbums)
  // 通过图片id获取包含它的所有影集id
  app.post('/api/getAlbumsIdByPic', albumController.getAlbumsIdByPic)
  app.post('/api/getAlbumById', albumController.getAlbumById)
  // 通过影集id获取它包含的所有图片
  app.post('/api/getPicByAlbumId', albumController.getPicByAlbumId)
  // 向影集中添加一张图片
  app.post('/api/addPicAlbum', albumController.addPicAlbum)
  // 向影集中删除一张图片
  app.post('/api/deletePicAlbum', albumController.deletePicAlbum)
  // 设置影集封面
  app.post('/api/setAlbumCoverPic', albumController.setAlbumCoverPic)


  // 获取所有未审核过的图片，pass=0
  app.post('/api/getUnpassPic', imageController.getUnpassPic)
  // 修改pass的值，图片审核通过--令pass=1；图片上传未审核--pass=0；审核未通过--pass=2
  app.post('/api/editPicPass', imageController.editPicPass)
  // 获取所有在线咨询用户
  app.post('/api/getClients', ws.getClients)
}