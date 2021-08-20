/* eslint-disable eqeqeq */
<template>
  <div class="register-bg">
    <div class="register-logo"/>
    <div class="fuzzy"/>
    <div class="register-wrap">
      <h2>注册</h2>
      <div class="register-form">
        <div>
          <span :class="{'error':username_error}">{{ username_message }}</span>
          <input id="username" v-model="username" type="text" autocomplete="off" placeholder="用户名" maxlength="14">
        </div>
        <div>
          <span :class="{'error':password_error}">{{ password_message }}</span>
          <input id="password" v-model="password" type="password" placeholder="密码" maxlength="26">
        </div>
        <div>
          <span :class="{'error':phone_error}">{{ phone_message }}</span>
          <input id="phoneNum" v-model="phoneNum" autocomplete="off" type="text" placeholder="手机号">
        </div>
        <div>
          <span id="checkCodeMsg" :class="{'error':codeMsg_error}">{{ code_message }}</span>
          <input id="codeMsg" v-model="codeMsg" type="text" placeholder="验证码">
          <s-identify ref="myIdentify" class="code" @identify-code="getIdentifyCode"/>
        </div>
        <div>
          <span :class="{'error':sms_error}">{{ sms_message }}</span>
          <input id="sms" v-model="sms" type="text" placeholder="短信验证码">
          <el-button :disabled="isAble" type="danger" style="width:110px;margin-left:20px;padding:12px 10px" @click="sendSms">{{ smsBtn }}</el-button>
        </div>
      </div>
      <p>
        注册即表示您已同意我们的<a href="">服务协议</a>和<a href="">隐私政策</a>
      </p>
      <input :disabled="isRegister" :class="['button',isRegister?'disabled':'blue']" type="button" value="注册" @click="register">
      <p>已经拥有账户？<a href="#/login">登录</a></p>
    </div>
  </div>
</template>

<script>
import SIdentify from '@/components/SIdentify'
export default {
  name: 'Register',
  components: {
    SIdentify
  },
  data() {
    return {
      identifyCode: '',
      username: '',
      password: '',
      phoneNum: '',
      codeMsg: '',
      sms: '', // 前端短信验证码值
      smsCode: '', // 服务器返回的短信验证码值
      // 错误信息样式是否显示
      username_error: false,
      password_error: false,
      codeMsg_error: false,
      phone_error: false,
      sms_error: true,
      // 错误信息提示
      username_message: '',
      password_message: '',
      code_message: '',
      phone_message: '',
      sms_message: '',
      // 是否同名，是返回true
      flag: false,
      smsBtn: '发送短信',
      isRegister: true, // 注册按钮被禁用
      isAble: false, // 短信按钮是否被禁用
      totalTime: 60 // 倒计时
    }
  },
  methods: {
    // 获取验证码
    getIdentifyCode(code) {
      this.identifyCode = code
    },
    // 发送短信验证码
    sendSms() {
      if (!this.checkUserName() || !this.checkPhone() || !this.checkPassword() || !this.checkCodeMsg()) {
        return false
      }
      this.isAble = true
      this.isRegister = false
      this.sms_error = false
      this.sms_message = ''
      // 调用短信api发送短信
      this.$http.post('/api/sendSms', this.$qs.stringify({ phoneNum: this.phoneNum })).then(res => {
        if (res.data.code === 1) { this.smsCode = res.data.smsCode }
      })
      let _this = this
      let timer = setInterval(() => {
        _this.smsBtn = _this.totalTime-- + 's后发送短信'
        if (_this.totalTime < 0) {
          clearInterval(timer)
          _this.totalTime = 10
          _this.smsBtn = '发送短信'
          _this.isAble = false
        }
      }, 1000)
    },
    register() {
      // eslint-disable-next-line eqeqeq
      if (this.smsCode !== this.sms) {
        this.sms_error = true
        this.sms_message = '验证码错误'
        return
      }
      let params = {
        username: this.username,
        password: this.password,
        phoneNum: this.phoneNum
      }
      this.$http.post('/api/register', this.$qs.stringify(params))
        .then((res) => {
          if (res.data.code === 1) {
            window.location.href = '#' + res.data.url
          }
        }).catch(function(error) {
          console.log(error)
        })
    },
    // 检查手机号是否使用
    checkPhone() {
      let reg = new RegExp(/^[1]([3-9])[0-9]{9}$/)
      if (this.phoneNum === '') {
        this.phone_message = '手机号不能为空'
        this.phone_error = true
        return false
      } else if (!reg.test(this.phoneNum)) {
        this.phone_message = '手机号格式不正确'
        this.phone_error = true
        return false
      } else {
        this.phone_message = ''
        this.phone_error = false
      }
      return true
    },
    // 检查用户名格式,以及是否重名
    checkUserName() {
      let reg = new RegExp(/^[a-zA-Z0-9_-]{3,16}$/) // 字符串正则表达式 4到14位（字母，数字，下划线，减号）
      if (this.username === '') {
        this.username_message = '用户名不能为空'
        this.username_error = true
        return false
      } else {
        this.username_error = false
      }
      if (!reg.test(this.username)) {
        this.username_message = '用户名格式不正确'
        this.username_error = true
        return false
      } else {
        this.username_message = ''
        this.username_error = false
      }
      return true
    },
    // 去后端检查用户名使用数量
    checkSameName() {
      this.$http.post('/api/checkUsername', this.$qs.stringify({ username: this.username }))
        .then((res) => {
          if (res.data.code === 1) {
            this.username_message = '用户名已存在'
            this.username_error = true
            this.flag = false
          } else {
            this.username_message = ''
            this.username_error = false
            this.flag = true
          }
        })
    },
    // 检查密码是否正确
    checkPassword() {
      if (this.password === '') {
        this.password_message = '密码不能为空'
        this.password_error = true
        return false
      } else if (this.password.length < 6) {
        this.password_message = '密码长度不能小于6位'
        this.password_error = true
        return false
      } else if (this.password.length > 26) {
        this.password_message = '密码长度不能大于26位'
        this.password_error = true
        return false
      } else {
        this.password_message = ''
        this.password_error = false
      }
      return true
    },
    // 检查验证码是否正确
    checkCodeMsg() {
      if (this.codeMsg === '') {
        this.code_message = '验证码不能为空'
        this.codeMsg_error = true
        return false
      // eslint-disable-next-line eqeqeq
      } else if (this.codeMsg.toLowerCase() != this.identifyCode.toLowerCase()) {
        this.code_message = '验证码错误'
        this.codeMsg_error = true
        this.$refs.myIdentify.createdCode()
        return false
      } else {
        this.code_message = ''
        this.codeMsg_error = false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.disabled{
  background-color: #b9bfc1;
}
.register-bg{
  width: 100%;
  min-width: 1200px;
  height: 100%;
  position: absolute;
  background: url('../../static/img/500px229526245.jpg') center no-repeat;
  background-size: 100% 100%;
}
.fuzzy{
  background: #fff;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  opacity: 0.6;
}
.register-logo{
  width: 104px;
  height: 40px;
  position: absolute;
  top: 36px;
  left: 45px;
  z-index: 2;
  background-size: 100% 100%;
  background: url('../../static/img/svg/500px_bk.svg') center no-repeat;
}
.register-wrap{
  width: 500px;
  height: 600px;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  opacity: 0.9;
  background: #fff;
  h2{
    font-weight: 500;
    font-size: 24px;
    line-height: 24px;
    padding-top: 40px;
    padding-bottom: 20px;
  }
  p{
    margin: 10px 0;
    font-size: 14px;
    a{
      color: #56abee;
      padding-left: 5px;
    }
  }
  input[type=button]{
    width: 270px;
    height: 46px;
    margin-top: 20px;
  }
}
.register-form{
  input{
    width: 300px;
    height: 46px;
    margin:0 0 20px 0px;
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid #c4c6ca;
    font-size: 18px;
    outline: none;
  }
}
.error{
  display: block;
  margin: 0 0 0 -200px;
  margin-bottom: 6px;
  line-height: 12px;
  color: red;
  font-size: 12px;
}
#codeMsg,#sms{
 width: 150px;
 margin-right: 10px;
}
.code{
  display: inline-block;
}
</style>
