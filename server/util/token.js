//用于生成和解析token
var jwt = require('jsonwebtoken');
var signkey = 'mes_qdhd_mobile_xhykjyxgs';  // 这是加密的key（密钥）

exports.setToken = function (username, userId, role) {
  return new Promise((resolve, reject) => {
    const token = jwt.sign({
      username: username,
      id: userId,
      role: role
    }, signkey, { expiresIn: 60 * 60 * 24 * 10 }); //10天后过期
    resolve(token);
  })
}

exports.verToken = function (token) {
  return new Promise((resolve, reject) => {
    var info = jwt.verify(token.split(' ')[1], signkey);
    resolve(info);
  })
}