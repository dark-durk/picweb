const mysql = require('mysql')
// 数据库连接配置
const mysql_config = {
  host: 'localhost',  // 新建数据库连接时的 主机名或ID地址 内容
  user: 'root',
  password: '12345', // root 密码
  database: 'picweb', // 数据库名
  port: '3306'
}
function getConn() {
  let conn = mysql.createConnection(mysql_config)

  return conn;
}
// conn.connect(function (err) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log('	数据库连接成功!');
// })
//关闭connection
// conn.end(function (err) {
//   if (err) {
//     return;
//   }
//   console.log('[connection end] succeed!');
// }
module.exports = getConn;