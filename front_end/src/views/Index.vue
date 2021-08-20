<template>
  <div>
    <div class="header-wrap">
      <div class="header">
        <div class="header_left">
          <img src="../../static/img/svg/500px.svg" alt="" >
          <ul>
            <li>
              <a href="/#/community/discover?t=rating"> 发现</a>
              <img src="../../static/img/svg/down_arrow.svg" alt="">
              <div class="rec"/>
              <ul class="header-pop">
                <li><a href="/#/community/discover?t=rating">热门</a></li>
                <li><a href="/#/community/discover?t=fresh">新作</a></li>
                <!-- <li><a href="">排名上升</a></li>
                <li><a href="">编辑推荐</a></li>
                <li><a href="">图文</a></li> -->
              </ul>
            </li>
            <!-- <li>
              <a href=""> 摄影师</a>
              <img src="../../static/img/svg/down_arrow.svg" alt="">
              <div class="rec"/>
              <ul class="header-pop">
                <li><a href="">热门</a></li>
                <li><a href="">排名上升</a></li>
              </ul>
            </li>
            <li>
              <a href=""> 部落</a>
            </li>
            <li>
              <a href=""> 活动</a>
            </li>
            <li>
              <a href=""> 售图</a>
              <img src="../../static/img/svg/down_arrow.svg" alt="">
            </li> -->
          </ul>
        </div>
        <div class="header_right" >
          <a href="/#/login">登录</a>
          <a href="/#/register">注册</a>
        </div>
      </div>
    </div>
    <!-- <div class="bannerImg">
      <div class="bannerwrap">
        <div class="banner_tit"/>
        <a href="">点击体验</a>
      </div>
    </div> -->
    <Slider :banner_data="banner_data">lb</Slider>
    <Footer>f</Footer>
  </div>
</template>

<script>
// import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Slider from '@/components/Slider'
export default {
  name: 'Index',
  components: {
    // Header,
    Footer,
    Slider
  },
  data() {
    return {
      banner_data: []
    }
  },
  mounted() {
    this.getBanner()
  },
  methods: {
    getBanner() {
      this.$http.get('/api/community/discover', { params: { t: 'rating', page: 0 }})
        .then(res => {
          for (let i = 0; i < 5; i++) {
            this.banner_data.push(res.data[i])
          }
        }).catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin aStyle{
  font-size: 16px;
  font-weight: 400;
  font-style: normal;
  line-height: 1.25;
}
@mixin flexStyle{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-wrap {
  width: 100%;
  min-width: 1200px;
  height: 72px;
  position: absolute;
  left: 0;
  z-index: 101;
}
.header {
  width: 100%;
  height: 100%;
  padding: 0 50px;
  margin: 0 auto;
}

.header_left {
  height: 100%;
  float: left;
  display: flex;
  flex-flow: row nowrap;
  & > img{
    width: 87px;
    height:100%;
    display: inline-block;
    color: #fff;
  }
  &>ul{
    margin-left: 24px;
    width: 310px;
    @include flexStyle;
    &>li{
      display: flex;
      height: 100%;
      position: relative;
      @include flexStyle;
      &>a{
        @include aStyle;
      }
      &>img{
        width: 16px;
        height: 24px;
      }
      &:hover ul{
          display: block;
      }
      &:hover .rec{
        display: block;
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
    box-shadow: 0 4px 12px rgba(0,0,0,.16), 0 0 4px rgba(0,0,0,.08);
    li{
      width: 88px;
      height: 100%;
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
    top:50px;
    left: 50%;
    width: 15px;
    height: 15px;
    display: none;
    background: #fff;
    transform: translate(-50%,50%) rotateZ(135deg);
    box-shadow: -2px 2px 3px rgba(0,0,0,.1);
    border: 1px solid #fff;
  }
}
.header_right{
  width: 120px;
  float: right;
  height: 100%;
  @include flexStyle;
  &>a{
    padding: 0px 15px;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    font-weight: 700;
    &:last-of-type{
      background-color: #0099e5;
      border: 1px solid #0085d1;
      border-radius: 3px;
    }
  }
}

.bannerImg{
  width: 100%;
  height: 500px;
  background: url('../../static/img/2020vcgMusic.jpg') center no-repeat;
  background-size: 100%;
  position: relative;
  .bannerwrap{
    width: 500px;
    height:212px;
    position: absolute;
    top: 70px;
    left: 50%;
    transform: translate(-50%,0%);
    .banner_tit{
      width: 100%;
      height: 170px;
      background: url('../../static/img/2020vcgMusicTitle.png') center no-repeat;
      background-size: 100%;
      margin: 0 0 15px;
    }
    &>a{
      font-size: 20px;
      color: #d12928;
      border-bottom:2px solid red;
    }
  }
}
</style>
