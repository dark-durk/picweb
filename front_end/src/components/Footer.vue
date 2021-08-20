<template>
  <div class="footer">
    <div class="footer-wrap">
      <div class="footer-left">
        <h2>视觉中国500px摄影社区</h2>
        <p class="des">视觉中国500px摄影社区是专业的创意摄影师社区，在这里我们一起来分享照片、发现好作品、交流拍摄技巧、创建属于自己的摄影个人主页。来自世界各地的摄影师是我们忠实的用户。让你与他人因图片相识，世界很大，我想看一看。</p>
        <div>
          <span class="link"><a href="">帮助中心</a>|</span>
          <span class="link"><a href="">服务协议</a>|</span>
          <span class="link"><a href="">隐私政策</a>|</span>
          <span class="link"><a href="">联系我们</a>|</span>
          <span class="link"><a href="">关于我们</a></span>
        </div>
        <div class="beian">
          © 常州五百像素网络科技有限公司. &nbsp;
          <a href="http://www.beian.miit.gov.cn" target="_blank">苏ICP备20016755号</a>
          <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32041202001732" target="_blank">
            <img src="../../static/img/beian.png" alt="">
            <span>苏公网安备 32041202001732号</span>
          </a>
        </div>
      </div>
      <div class="footer-right">
        <div>
          <img src="../../static/img/qrweixin.png" alt="">
          <span>微信公众号</span>
        </div>
        <div>
          <img src="../../static/img/qrweibo.png" alt="">
          <span>官方微博</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang='scss'>
@mixin font{
  font-size: 12px;
  color: #525558;
  text-align: left;
}
.footer{
  width: 100%;
  height: 250px;
  background-color: #f7f8fa;
}
.footer-wrap{
  width: 1160px;
  height: 252px;
  margin: 0 auto;
  padding: 40px 0;
  .footer-left{
    width: 740px;
    height: 100%;
    float: left;
    h2{
      text-align: left;
      margin: 24px 0;
    }
    .des{
      font-size: 14px;
      line-height: 1.4em;
      color: #525558;
      margin: 14px 0;
    }
    div{
      text-align: left;
    }
    .link {
      @include font;
      a{
        @extend .link;
        padding: 0 10px;
        &:hover{
         color: #84888c;
       }
      }
    }
    .beian{
      @include font;
      a{
        @extend .beian;
      }
    }
  }
  .footer-right{
    width: 400px;
    height: 100%;
    padding:20px 60px 0;
    float: right;
    display: flex;
    justify-content: space-between;
    div{
      height: 100%;
      width: 120px;
    }
    img{
      width:100%;
      height: 120px;
    }
    span{
      @include font;
    }
  }
}
</style>
