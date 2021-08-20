const ws = require('nodejs-websocket')

//在线客户端数组，{socketId,connection}
let clients = new Map()
let service = ''  //管理员

// 创建websocket服务
function createServer() {
  let server = ws.createServer(connection => {
    // 关闭连接
    connection.on('close', function (e) {
      // console.log('关闭连接--' + e.code + '---' + e.reason + ' ' + e.wasClean)
      let identity = connection.path.split('/')
      if (identity[1] == 'client') {
        clients.delete(identity[2])
      } else {
        service = ''
      }
    })
    connection.on('error', function (err) {
      // console.log('异常关闭--' + err)
    })
    connection.on('text', function (str) {
      let identity = connection.path.split('/')
      let obj = JSON.parse(str)

      if (obj.isRegister) { //第一次连接，保存到数组
        if (identity[1] == 'client') {
          clients.set(identity[2], connection)
        } else {
          service = connection
        }
      } else {
        if (obj.heartCheck == 'heartCheck') { //心跳检测
          connection.sendText('alive')
          return
        }
        if (obj.receiver == 'admin') { //用户给管理员发消息
          if (service) {  //管理员在线
            service.send(JSON.stringify({ sender: obj.sender, content: obj.content }))
          } else {  //管理员不在线
            connection.sendText('offline')
          }
        } else {  //管理员给用户发消息
          if (clients.get(obj.receiver)) {
            clients.get(obj.receiver).send(JSON.stringify({ sender: 'admin', content: obj.content }))
          } else {
            connection.sendText('offline')
          }
        }
      }
    })
  }).listen(3000)
  return server
}

// 广播通知
function broadcast(server, info) {
  console.log('broadcast---' + info)
  server.connections.forEach(function (conn) {
    conn.sendText(info)
  })
}
// 根据key获取value,前提是value唯一
function getKey(v, map) {
  for (let item of map.entries()) {
    if (item[1] === v) {
      return item[0]
    }
  }
  return false
}

let server = createServer()
module.exports.server = server
// 获取所有的在线client
module.exports.getClients = function (req, res) {
  if (clients.size == 0) {
    res.json({ code: 0, msg: '暂无用户咨询' })
  } else {
    let arr = []
    for (let key of clients.keys()) {
      let obj = {}
      obj.socketId = key
      arr.push(obj)
    }
    setTimeout(() => {
      res.json({ code: 1, clients: arr })
    }, 10)
  }
}