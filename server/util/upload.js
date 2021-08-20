// 用于文件上传的模块
// 需要用到的模块进行加载
const fs = require('fs')
const path = require('path')

// file指文件，fill_arr是上传的文件类型 ['.jpg', '.png'],path文件保存路径,如/public/images/
exports.upload = function (file, file_arr, filepath, fun) {
  let arr = file.originalname.split('.')
  let file_type = '.' + arr[arr.length - 1]       // 得到的是原文件的后缀名
  let type_status = false
  for (let val of file_arr) {
    if (val == file_type) {
      type_status = true
    }
  }
  if (!type_status) {
    fun({ code: 0, msg: "上传文件格式不对" })
    return
  }

  let file_name = new Date().getTime() + Math.round(Math.random() * 100) + file_type
  let file_path = process.cwd() + "/server" + filepath + file_name;
  let file_url = filepath + file_name;
  // console.log('file_path=' + file_path)
  // console.log('file_url=' + file_url)
  // console.log('file.path=' + file.path)
  // 读取文件
  fs.readFile(file.path, function (err, data) {
    // fs.writeFile() 把内容写入文件中，如果已经存在该文件就把它覆盖
    fs.writeFile(file_path, data, function (err) {
      if (err) {
        console.log(err);
      } else {
        fun({ code: 1, file_url: file_url, msg: "上传成功！" })
      }
    });
  });
}
// 删除服务器上的图片
exports.deleteFile = function (fileName) {
  // 删除名为“ fileName”的图片文件
  let target_path = path.resolve('./server/public/images', fileName) //文件名拼接
  fs.unlink(target_path, function (err) {
    if (err) throw err;
    // 如果没有错误，则文件已成功删除
    console.log('File deleted!----' + target_path);
  });
}