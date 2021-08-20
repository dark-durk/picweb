<template>
  <div class="mainnav">
    <ul class="mainnav-wrap">
      <li class="discovery-logo">
        <img src="../../static/img/svg/logo-500px-2020.svg" alt="">
      </li>
      <li class="discovery-text">
        发现<img class="down-arrow" src="../../static/img/svg/down_arrow.svg" alt="">
        <div class="rec"/>
        <ul class="header-pop">
          <li><a href="/#/community/discover?t=rating">热门</a></li>
          <li><a href="/#/community/discover?t=fresh">新作</a></li>
        </ul>
      </li>
      <!-- <li class="discovery-text">
        <el-input
          v-model="keywords"
          placeholder="请输入搜索内容">
          <i slot="suffix" class="el-input__icon el-icon-search" style="cursor:pointer" @click="search"/>
        </el-input>
      </li> -->
      <li v-if="!this.$store.state.userLogin" class="discovery-text login">
        <a href="#/login/" >登录</a>
      </li>
      <li v-if="!this.$store.state.userLogin" class="discovery-text register">
        <a href="#/register" >注册</a>
      </li>
      <li v-if="this.$store.state.userLogin" class="discovery-text person">
        <a :href="'/#/personpage?uid='+this.$store.state.userInfo.id+'&tabs=published_works'">
          <img :data-uid="this.$store.state.userInfo.id" :src="this.$store.state.userInfo.headImg" class="headimg" alt="">{{ this.$store.state.userInfo.username }}
        </a>
        <div class="rec"/>
        <ul class="header-pop">
          <li><a href="#/community/personinfo">个人信息</a></li>
          <li><a href="" @click="exit">退出登录</a></li>
        </ul>
      </li>
      <li v-if="this.$store.state.userLogin" class="discovery-text">
        <a class="upload" href="#/upload/single_pic">
          <img class="up-arrow" src="../../static/img/svg/up_arrow.svg" alt="">上传
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      // 默认用户头像地址
      src: '../../static/img/default_tx.png',
      keywords: ''
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    // 获取用户名和头像
    getInfo() {
      this.$http.post('/api/community/getUserInfo')
        .then(res => {
          if (res.data.code === 0) { // token失效
            localStorage.removeItem('token')
            this.$store.commit('saveUserLogin', false)
            return
          }
          this.$store.commit('saveUserLogin', true)
          if (res.data.headImg !== null) {
            res.data.headImg = this.$host + res.data.headImg
            this.$store.commit('saveUserInfo', res.data)
          } else {
            res.data.headImg = this.src
            this.$store.commit('saveUserInfo', res.data)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    // 退出登录,删除token
    exit() {
      if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('token')
        this.$store.commit('saveUserLogin', false)
        this.$router.push({ path: '/community/discover', query: { t: 'rating' }})
        return false
      } else {
        return false
      }
    },
    search() {

    }
  }
}
</script>

<style lang="scss" scoped>
.mainnav{
  width: 100%;
  min-width: 1200px;
  height: 72px;
  padding: 0 30px 0 40px;
  background: #fff;
  border-bottom:1px solid rgb(238, 239, 242);
}
.mainnav-wrap{
  width: 100%;
  min-width: 1200px;
  height: 72px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  font-size: 16px;
  letter-spacing: .025em;
  color: #525558;
  &>li{
    height: 100%;
    padding: 0 14px;
    display: flex;
    align-items: center;
    position: relative;
    &:hover .header-pop{
      display: block;
    }
    &:hover .rec{
      display: block;
    }
  }
  .discovery-logo>img{
    width:92px;
    height: 72px;
  }
  .down-arrow{
    width: 16px;
    height: 16px;
  }
  .discovery-text{
    cursor: pointer;
    &:hover{
      color: #0099e5;
    }
  }
  @mixin a($bgColor:#fff,$color:#525558){
    height: 72px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: .025em;
    background-color: $bgColor;
    color: $color;
    padding: 0 20px;
  }
  .login{
    margin-left: auto;
    a{
      @include a(#fff,);
      border-bottom: 1px solid #eeeff2;
    }
     &:hover a{
      color: #0099e5;
    }
  }
  .register{
    a{
      @include a(#34bf49,#fff)
    }
    &:hover a{
      background-color: #41cb56;
    }
  }
  .person{
    display: flex;
    align-items: center;
    margin-left: auto;
    &>a{
      display: flex;
      align-items: center;
      color: #525558;
      &:hover{
         color: #0099e5;
      }
    }
    img{
      width:25px;
      height:25px;
      margin: 0 5px 0 0;
      border-radius: 50%;
    }
  }
  .upload{
    width: 96px;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 23px;
    border: 2px solid #222;
    background: #fff;
    color: #222;
    font-weight: 700;
    line-height: 24px;
    &:hover{
      background: rgba(34,34,34,.2);
      color: #222;
    }
  }
}
.header-pop{
  width: inherit;
  position: absolute;
  top: 65px;
  left: 50%;
  transform: translate(-50%,0%);
  display: none;
  background: #fff;
  z-index: 101;
  box-shadow: 0 4px 12px rgba(0,0,0,.16), 0 0 4px rgba(0,0,0,.08);
  li{
    width: 88px;
    height: 35px;
    text-align: center;
    line-height: 35px;
    &:hover{
      background-color: #0870d1;
      a{
        color: #fff;
      }
    }
  }
  a{
    font-size: 14px;
    color: #222222;
  }
}
.rec{
    position: absolute;
    top:51px;
    left: 50%;
    width: 15px;
    height: 15px;
    display: none;
    transform: translate(-50%,50%) rotateZ(135deg);
    box-shadow: -2px 2px 3px rgba(0,0,0,.1);
    border: 1px solid #fff;
  }
</style>
