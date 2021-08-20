<template>
  <div class="bg">
    <el-container>
      <el-header>
        <div class="header">在线咨询</div>
      </el-header>
      <el-main>
        <div v-for="(msg,index) in msgList" :key="index" class="msg">
          <i :class="['avatar',msg.isLeft?'msg-left':'msg-right avatar-right']">
            <img v-if="msg.isLeft" src="../../static/img/portrait2x.png" alt="">
            <img v-else src="../../static/img/ico-kefu@2x.png" alt="">
          </i>
          <div :class="['msg-bubble', msg.isLeft?'msg-left':'msg-right msg-bubble-right']">
            <div :class="['arrow',msg.isLeft?'arrow-left':'arrow-right']"/>
            <div class="p">{{ msg.content }}</div>
          </div>
        </div>
        <el-divider v-if="!isOnline">{{ divider }}</el-divider>
      </el-main>
      <el-footer>
        <div>
          <textarea v-model="content" rows="4" resize="none" placeholder="请输入消息..." class="textarea"/>
        </div>
        <el-button type="primary" class="send-button" @click="send()">发送</el-button>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  // 在子组件当中通过 inject获取父组件传过来的reload
  inject: ['reload'],
  data() {
    return {
      content: '', // 用户输入的内容
      msgList: [], // 消息集合
      isOnline: true, // 管理员是否在线
      divider: '', // 分割线内容

      ipUrl: 'ws://localhost:3000',
      ws: null, // 建立的连接
      lockReconnect: false, // 是否真正建立连接
      timeout: 30 * 1000, // 30秒一次心跳
      timeoutObj: null, // 心跳心跳倒计时
      serverTimeoutObj: null, // 心跳倒计时
      timeoutnum: null // 断开 重连倒计时
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.query.socketId !== from.query.socketId) {
        this.reload()
      }
    }
  },
  created() {
    this.initWebpack()
    this.$nextTick(() => {
      if (sessionStorage.getItem(this.$route.query.socketId)) {
        this.msgList = JSON.parse(sessionStorage.getItem(this.$route.query.socketId))
      }
    })
  },
  updated: function() {
    this.scrollToBottom()
  },
  destroyed() {
    this.ws.close()
  },
  beforeRouteLeave(to, from, next) {
    this.ws.close()
    next()
  },
  methods: {
    send() {
      if (this.content.length === 0) {
        return
      }
      this.msgList.push({ content: this.content, isLeft: false })
      let content = this.content
      this.ws.send(JSON.stringify({ sender: 'admin', receiver: this.$route.query.socketId, content: content }))
      this.content = ''
      sessionStorage.setItem(this.$route.query.socketId, JSON.stringify(this.msgList))
    },
    initWebpack() {
      this.ws = new WebSocket(this.ipUrl + '/admin/')
      this.ws.onopen = this.onopen
      this.ws.onmessage = this.onmessage
      this.ws.onclose = this.onclose
      this.ws.onerror = this.onerror
    },
    onopen() {
      this.ws.send(JSON.stringify({ isRegister: true }))
      this.start()// 开启心跳
    },
    onmessage(e) {
      this.reset()// 收到服务器信息，心跳重置
      if (e.data === 'alive') {
        // console.log('alive')
      } else if (e.data === 'offline') {
        alert('客户已离线')
      } else {
        let data = JSON.parse(e.data)
        this.msgList.push({ content: data.content, isLeft: true })
        sessionStorage.setItem(this.$route.query.socketId, JSON.stringify(this.msgList))
      }
    },
    onclose(e) {
      // console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
      // 重连
      this.reconnect()
    },
    onerror(e) {
      this.reconnect()
    },
    reconnect() { // 重新连接
      let _this = this
      if (_this.lockReconnect) {
        return
      }
      _this.lockReconnect = true
      // 没连接上会一直重连，设置延迟避免请求过多
      _this.timeoutnum && clearTimeout(_this.timeoutnum)
      _this.timeoutnum = setTimeout(() => {
        // 新连接
        _this.initWebpack()
        _this.lockReconnect = false
      }, 5000)
    },
    reset() { // 重置心跳
      let _this = this
      // 清除时间
      clearTimeout(_this.timeoutObj)
      clearTimeout(_this.serverTimeoutObj)
      // 重启心跳
      _this.start()
    },
    start() { // 开启心跳
      var _this = this
      _this.timeoutObj && clearTimeout(_this.timeoutObj)
      _this.serverTimeoutObj && clearTimeout(_this.serverTimeoutObj)
      _this.timeoutObj = setTimeout(() => {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (_this.ws.readyState === 1) { // 如果连接正常
          _this.ws.send(JSON.stringify({ heartCheck: 'heartCheck' }))
        } else { // 否则重连
          _this.reconnect()
        }
        _this.serverTimeoutObj = setTimeout(function() {
          // 超时关闭
          _this.ws.close()
        }, _this.timeout)
      }, _this.timeout)
    },
    scrollToBottom: function () {
      this.$nextTick(() => {
        let container = this.$el.querySelector('.el-main')
        container.scrollTop = container.scrollHeight
      })
    }
  }
}
</script>
<style scoped>
.bg{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #BABBBF;
}
  .el-container{
    width: 590px;
    height: 550px;
    margin: 20px auto;
  }
  .el-header {
    height: 48px !important;
    background-color: #B3C0D1;
  }
  .el-main {
    height: 380px;
    background-color: #f0f1f2;
    color: #333;
  }
  .el-footer{
    position: relative;
    width: 100%;
    height: 125px !important;
    padding:0;
    background-color: #fbfbfb;
    border-color:#e1e3e6 ;
  }
  .el-divider__text{
    background-color: #f0f1f2;
  }
  /* 头部 */
  .header{
    float: left;
    font-size: 16px;
    color: #fff;
    line-height: 48px;
  }
  /* 底部发送消息部分 */
  .textarea{
    width: 100%;
    margin-top: 10px;
    padding: 0 10px;
    overflow: auto;
    resize: none;
    outline: none;
    border-color:#fbfbfb ;
    font-size: 14px;
    background-color: #fbfbfb;
  }
  .send-button{
    position: absolute;
    right: 5px;
    padding: 8px 20px;
    margin-top:5px ;
  }
  /* 设置滚动条样式 */
  .textarea::-webkit-scrollbar{
    width: 7px;
    height: 7px;
  }
  .textarea::-webkit-scrollbar-button{
    display: none;
  }
  .textarea::-webkit-scrollbar-track{
    background-color: transparent;
  }
  .textarea::-webkit-scrollbar-thumb{
    border-radius: 3px;
    background-color: #ccd5d8;
  }
  .el-main::-webkit-scrollbar{
    width: 7px;
    height: 7px;
  }
  .el-main::-webkit-scrollbar-button{
    display: none;
  }
  .el-main::-webkit-scrollbar-track{
    background-color: transparent;
  }
  .el-main::-webkit-scrollbar-thumb{
    border-radius: 3px;
    background-color: #ccd5d8;
    }
  /* 消息样式 */
  .avatar{
    width: 38px;
    height: 38px;
    border-radius: 50%;
    overflow: hidden;
  }
  .avatar img{
    width: 100%;
    height: 100%;
  }
  .avatar-right{
    background-color: #409EFF;
  }
  .msg-left{
    float: left;
    margin-right: 10px;
  }
  .msg-right{
    float: right;
    margin-left: 10px;
  }

  .msg{
    font-size: 14px;
    text-align: left;
    margin-bottom: 20px;
  }
  .msg::after{
    display: block;
    clear: both;
    visibility: hidden;
    height: 0;
    overflow: hidden;
    content: ".";
  }
  .msg-bubble{
    max-width: 60%;
    min-width: 50px;
    position: relative;
    padding: 12px;
    border-radius: 8px;
    background-color: #fff;
    color: #333;
    line-height: 1.5;
    box-sizing: border-box;
    word-wrap: break-word;
  }
  .msg-bubble-right{
    background-color: #409EFF;
  }
  .arrow{
    position: absolute;
    top: 15px;
    width: 0;
    height: 0;
    border: 0 solid #fff;
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
  }
  .arrow-left{
    left: -6px;
    border-right-width: 6px;
  }
  .arrow-right{
    right: -6px;
    border: 0 solid #409EFF;
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
    border-left-width: 6px;
  }
</style>
