<template>
  <div class="register-bg">
    <div class="register-logo"/>
    <div class="fuzzy"/>
    <div class="register-wrap">
      <h2>登录</h2>
      <div class="login-form">
        <div>
          <input id="username" ref="username" type="text" placeholder="用户名" maxlength="10" autocomplete="off">
        </div>
        <div>
          <input id="password" ref="password" type="password" placeholder="密码" maxlength="26">
        </div>
        <span id="warnInfo" class="error"/>
        <p>
          登录即表示您已同意我们的<a href="">服务协议</a>和<a href="">隐私政策</a>
        </p>
        <input class="button blue" type="button" value="登录" @click="login">
        <p>还没有账户？<a href="#/register">注册</a></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {

    }
  },
  methods: {
    check() {
      this.warnInfo = document.getElementById('warnInfo')
      if (this.$refs.username.value === '') {
        this.warnInfo.innerText = '用户名不能为空'
        this.warnInfo.style.display = 'block'
        return false
      } else if (this.$refs.password.value === '') {
        this.warnInfo.innerText = '密码不能为空'
        this.warnInfo.style.display = 'block'
        return false
      }
      return true
    },
    login() {
      if (!this.check()) {
        return false
      }
      let params = {
        username: this.$refs.username.value,
        password: this.$refs.password.value
      }
      this.$http.post('/api/login', this.$qs.stringify(params))
        .then((res) => {
          if (res.data.code === 1) {
            window.localStorage.setItem('token', res.data.token)
            this.$store.commit('saveUserLogin', true)
            this.$router.push({ path: res.data.url, query: { t: 'rating' }})
          } else if (res.data.code === 2) {
            window.localStorage.setItem('token', res.data.token)
            this.$router.push({ path: res.data.url })
          } else {
            this.warnInfo.innerText = res.data.msg
            this.warnInfo.style.display = 'block'
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="scss">
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
    padding-top: 60px;
    padding-bottom: 20px;
  }
  p{
    margin: 20px 0;
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
.login-form{
  input{
    width: 300px;
    height: 46px;
    margin:40px 0 20px 0px;
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
  display: none;
}
</style>
