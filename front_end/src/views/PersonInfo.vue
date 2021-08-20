<template>
  <div>
    <Header ref="header">header</Header>
    <div id="personInfo">
      <div class="personWraper">
        <div>
          <label for="headImg">头像</label>
          <input id="headImg" type="file" name="headImg" accept="image/*" @change="getFile($event)">
          <img :src="src" alt="" class="head-img">
        </div>
        <div>
          <label for="phoneNum">电话号码</label>
          <input id="phoneNum" v-model="phoneNum" type="text" name="phoneNum">
          <span :class="{'error':phone_error}">{{ phone_message }}</span>
        </div>
        <div>
          <label for="male">性别</label>
          <div>
            <label for="male">男</label>
            <input id="male" v-model="sex" value="男" type="radio" name="sex" checked="checked">
            <label for="sex">女</label>
            <input id="female" v-model="sex" value="女" type="radio" name="sex">
          </div>
        </div>
        <div>
          <label for="birthday">出生日期</label>
          <input id="birthday" v-model="birthday" :max="maxAge" type="date" name="birthday" min="1900-01-01">
        </div>
        <el-button v-if="!isEdit" type="danger" style="display:block;margin-bottom='20px'" size="small" @click="isEdit=!isEdit">修改密码</el-button>
        <div v-if="isEdit">
          <label for="oldPsw">请输入原密码</label>
          <input id="oldPsw" v-model="oldPsw" type="password" name="oldPsw">
          <span :class="{'error':oldPsw_error}">{{ oldPsw_message }}</span>
        </div>
        <div v-if="isEdit">
          <label for="oldPsw"> 请输入新密码</label>
          <input id="newPsw" v-model="newPsw" type="password" name="newPsw">
          <span :class="{'error':newPsw_error}">{{ newPsw_message }}</span>
        </div>
        <input type="button" value="保存修改" class="button blue" @click="submit($event)">
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'

export default {
  name: 'PersonInfo',
  components: {
    Header
  },
  data() {
    return {
      isEdit: false, // 是否需要修改密码
      dcHeight: '',
      id: '',
      oldPsw: '',
      oldPswT: '',
      newPsw: '',
      sex: '',
      birthday: '',
      phoneNum: '',
      headImg: '',
      src: '',
      maxAge: '',
      phone_error: true,
      phone_message: '', // 错误提示信息
      oldPsw_message: '',
      newPsw_message: '',
      oldPsw_error: true,
      newPsw_error: true
    }
  },
  mounted: function() {
    this.dcHeight = document.documentElement.clientHeight
    this.changeHeight()
    this.getUserInfo()
    this.setMaxAge()
  },
  methods: {
    // 改变修改个人信息框的高度
    changeHeight() {
      window.onresize = function() {
        document.getElementById('personInfo').style.height = (this.dcHeight - 50 - 72) + 'px'
      }
    },
    // 获取图片
    getFile(event) {
      this.headImg = event.target.files[0]
      this.readAsDataURL(this.headImg)
    },
    // 前台预览
    readAsDataURL(file) {
      let windowurl = window.URL || window.webkitURL
      this.src = windowurl.createObjectURL(file)
    },
    // 像服务器提交数据
    submit(event) {
      event.preventDefault()// 取消默认行为
      if (!this.checkPhone()) {
        return false
      }
      if (this.isEdit && !this.checkPsw()) {
        return false
      }
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data' // 以表单传数据的格式来传递fromdata
        }
      }
      let formData = new FormData()
      formData.append('id', this.id)
      formData.append('sex', this.sex)
      formData.append('birthday', this.birthday)
      formData.append('phoneNum', this.phoneNum)
      formData.append('password', this.newPsw)
      formData.append('image', this.headImg)
      this.$http.post('/api/community/personinfo', formData, config)
        .then(res => {
          alert(res.data.msg)
        }).catch((err) => {
          console.log(err)
        })
    },
    // 像服务器获取用户信息
    getUserInfo() {
      this.$http.post('/api/community/getUserInfo', this.$qs.stringify({ token: localStorage.getItem('token') }))
        .then(res => {
          this.src = this.$host + res.data.headImg
          // eslint-disable-next-line eqeqeq
          if (res.data.headImg === null) {
            this.src = '../../static/img/svg/settings_person.svg'
          }
          this.phoneNum = res.data.phoneNum
          this.sex = res.data.sex
          this.birthday = res.data.birthday
          this.oldPswT = res.data.password
        }).catch((err) => {
          console.log(err)
        })
    },
    // 检查用户输入的原密码是否正确，新密码的长度 6-30
    checkPsw() {
      if (!this.oldPsw) {
        this.oldPsw_message = '密码不能为空'
        this.oldPsw_error = true
        return false
      } else {
        this.oldPsw_message = ''
        this.oldPsw_error = false
      }
      if (this.oldPsw !== this.oldPswT) {
        this.oldPsw_message = '密码错误'
        this.oldPsw_error = true
        return false
      } else {
        this.oldPsw_message = ''
        this.oldPsw_error = false
      }
      if (this.newPsw.length < 6 || this.newPsw.length > 30) {
        this.newPsw_message = '密码长度为6-30位'
        this.newPsw_error = true
        return false
      } else {
        this.newPsw_message = ''
        this.newPsw_error = false
      }
      return true
    },
    // 设置用户出生日期选择不能超过当前日期
    setMaxAge() {
      let now = new Date()
      let year = now.getFullYear()
      let month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)
      let date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
      this.maxAge = year + '-' + month + '-' + date
    },
    // 检查手机号是否使用
    checkPhone() {
      let reg = new RegExp(/^[1]([3-9])[0-9]{9}$/)
      if (this.phoneNum === '') {
        this.phone_message = '手机号不能为空'
        this.phone_error = true
        return false
      }
      if (!reg.test(this.phoneNum)) {
        this.phone_message = '手机号格式不正确'
        this.phone_error = true
        return false
      } else {
        // 去后端查手机号是否存在
        this.$http.post('/api/checkPhone', this.$qs.stringify({ phoneNum: this.phoneNum }))
          .then((res) => {
            if (res.data.code === 1) {
              this.phone_message = '手机号已存在'
              this.phone_error = true
              return false
            } else {
              this.phone_message = ''
              this.phone_error = false
            }
          })
      }
      return true
    }
  }
}
</script>

<style lang='scss' scope>
#personInfo{
  width: 980px;
  height: 510px;
  margin: 30px auto 0;
  padding: 10px 0;
  background: #fff;
}
.personWraper{
  width: 400px;
  height: 100%;
  margin: 0 auto;
  padding: 0 0 0 50px;
  position: relative;
  &>div{
    height: 65px;
    margin: 10px 0;
    div>label{
      display: inline;
    }
  }
  label{
    width: 100%;
    display: block;
    font-weight: 400;
    margin: 0 0 10px;
    font-size: 15px;
    text-align: left;
  }
  input[type]{
    width: 300px;
    height: 30px;
    padding: 5px;
    font-size: 13px;
    border: 1px solid #aeafb0;
    border-radius: 3px;
  }
  input[type=button]{
     width: 150px;
     height: 35px;
  }
  input[type=radio]{
     width: 15px;
     height:15px;
     margin: 0 50px 0 0;
  }
  .head-img{
    width: 60px;
    height: 60px;
    position: absolute;
    top: 0;
    right: -60px;
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
</style>
