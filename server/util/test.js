const fs = require('fs')
const path = require('path')
const StringRandom = require('string-random')
const target_path = path.resolve('./server/public/images') //写入的文件夹
const file_path = path.resolve('./server/public/dist/500pxPic')

// 将文件进行移动并命名
function getFileUrl(file_path, callback) {
  let arr = []
  fs.readdir(file_path, function (err, files) {
    if (err) {
      console.log(err)
    } else {
      files.forEach(function (file_name) {
        let file_dir = path.join(file_path, file_name)
        let fileName = new Date().getTime() + Math.round(Math.random() * 100) + '.jpg'  //写入后的文件名
        let target_dir = path.join(target_path, fileName)
        arr.push('/public/images/' + fileName)
        // console.log(file_dir)    //d:\vueProject\picweb\server\public\dist\static\500pxPic\500px1025228228.jpg
        // 同步操作移动并重命名文件
        fs.renameSync(file_dir, target_dir)
      })
    }
    callback(arr)
  })
}
// 随机生成类型
function getType() {
  let types = ['未分类', '抽象', '动物', '人物', '自然', '黑白', '生活', '美食', '城市', '水下', '街拍']
  let num = Math.floor(Math.random() * 11)
  // console.log(num)
  return types[num]
}

// 生成一条批量插入的sql语句
getFileUrl(file_path, (arr_url) => {
  let values = []
  for (let url of arr_url) {
    let type = getType()
    let uid = Math.ceil(Math.random() * 10)
    let value = `(0,'${StringRandom(4, { numbers: false })}', '${url}', '${StringRandom(12)}', '${type}', ${uid},0)`
    values.push(value)
  }
  let sql = 'insert into `image`(`id`,`tit`,`url`,`des`,`type`,`uid`,`click_count`) values' + values.join(',')
  console.log(sql)
})
