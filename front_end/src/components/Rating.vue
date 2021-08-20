<template>
  <div class="waterfall-wrap">
    <!-- //图片显示区域 -->
    <div class="Mywaterfall">
      <input :data-page="page" type="hidden">
      <div v-for="(img,index) in imgs" :key="index" :data-id="img.id" class="image-content">
        <a :href="'/#/community/photo-details?pId='+img.id" class="photo-link" @click.prevent="getDetails(img.id)">
          <img :src="`http://localhost:8888${img.url}`" :data-id="img.id" :data-src="img.url" class="photo">
        </a>
        <div class="info">
          <div class="credits">
            <a :href="'/#/personpage?uid='+img.uid+'&tabs=published_works'" :style="{'background-image':'url(http://localhost:8888'+img.head_img+')'}" class="avatar" target="_blank"/>
            <div class="photo-info-wrap">
              <a :href="'/#/personpage?uid='+img.uid+'&tabs=published_works'" target="_blank" class="photographer">{{ img.username }}</a>
            </div>
          </div>
          <div class="right">
            <!-- 点赞 -->
            <a href="javascript:void(0)" class="like-button" @mouseenter="changeLikeState($event)" @mouseleave="changeLikeStated($event)">
              <img src="../../static/img/svg/dianzan.svg" alt="">
            </a>
            <!-- 转发 -->
            <!-- <a href="javascript:void(0)" class="zhuanfa-button" @mouseleave="changeZfStated($event)" @mouseenter="changeZfState($event)">
              <img src="../../static/img/svg/zhuanfa.svg" alt="">
            </a> -->
            <!-- 加入影集 -->
            <div class="yingji-button" @click="changePopPosition(img,$event)"/>
          </div>
        </div>
      </div>
    </div>
    <AlbumPop :ref="albumPopTime" :img="img" :album-list="albumList"/>
  </div>
</template>

<script>
import AlbumPop from '@/components/AlbumPop'

export default {
  name: 'Upcoming',
  components: {
    AlbumPop
  },
  props: { selectedoption: { type: String, default: '所有' }},
  data() {
    return {
      page: '0', // 像后台请求数据的次数
      imgList: [], // 向后台请求的所有数据
      imgs: [], // 前端展示的数据
      num: 0, // 前端展示的数据量
      albumList: [],
      img: null, // 传给子组件albumpop的图片对象
      albumPopTime: '' // 子组件albumpop的ref名，根据时间生成
    }
  },
  watch: {
    selectedoption: {
      handler(newValue, oldValue) {
        this.selectedoption = newValue
        this.num = 0
        this.page = 0
        let _this = this
        this.getPic().then(function() {
          _this.imgs = []
          _this.getImgList(_this.num)
        })
      },
      deep: true
    }
  },
  mounted() {
    const _this = this
    this.getPic().then(function() {
      _this.getImgList(_this.num)
    })
    window.onscroll = function() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop // 滚动的距离
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight // 屏幕高度
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight // 滚动条的高度
      // eslint-disable-next-line eqeqeq
      if ((scrollTop + windowHeight + 1) > scrollHeight) {
        // 滑动底部加载更多图片
        _this.getImgList(_this.num)
      }
    }
  },
  methods: {
    // 修改子组件albumPop的位置
    changePopPosition(img, e) {
      if (!this.$store.state.userLogin) {
        this.$router.push({ path: '/login', query: { redirect: this.$router.currentRoute.fullPath }})
        return false
      }
      let albumPopTime = this.albumPopTime
      this.img = img
      let p = e.currentTarget.getBoundingClientRect()
      let w = document.getElementsByClassName('waterfall-wrap')[0].getBoundingClientRect()
      let top = p.top - w.top
      let left = p.left - w.left
      this.$refs[albumPopTime].changePopPosition(left, top)
      this.getAlbums()
    },
    // 获取用户创建的所有影集
    getAlbums() {
      let uid = this.$store.state.userInfo.id
      this.$http.post('/api/getAlbums', this.$qs.stringify({ uid: uid }))
        .then(res => {
          if (res.data.code === 1) {
            res.data.albums.forEach(album => {
              album.exist = false // 判断影集中是否存在该图片,默认不存在
            })
            this.albumList = res.data.albums
          }
        })
    },
    // 将后台获得到的数据赋值给前端展示的那个数组
    getImgList(num) {
      for (let i = num; i < num + 5 && i < this.imgList.length; i++) {
        this.imgs.push(this.imgList[i])
      }
      this.num = num + parseInt(5)
      if (num >= this.imgList.length) {
        this.getPic()
      }
    },
    // 像后台请求数据，加载图片
    async getPic() {
      await this.$http.get('/api/community/discover', { params: { t: 'rating', page: this.page, type: this.selectedoption }})
        .then(res => {
          // eslint-disable-next-line eqeqeq
          if (this.page == 0) { // 第一次请求数据
            this.imgList = res.data
          } else {
            res.data.forEach((item) => {
              this.imgList.push(item)
            })
          }
        }).catch(error => {
          console.log(error)
        })
      this.page = parseInt(this.page) + parseInt(1)
    },
    // 点击图片后进入详情页
    getDetails(pId) {
      this.$router.push({
        path: '/community/photo-details',
        query: {
          pId: pId
        }
      })
    },
    // 鼠标移入移出的事件
    changeLikeState(event) {
      event.target.getElementsByTagName('img')[0].src = '../../static/img/svg/dianzaned.svg'
    },
    changeLikeStated(event) {
      event.target.getElementsByTagName('img')[0].src = '../../static/img/svg/dianzan.svg'
    },
    changeZfState(event) {
      event.target.getElementsByTagName('img')[0].src = '../../static/img/svg/zhuanfaed.svg'
    },
    changeZfStated(event) {
      event.target.getElementsByTagName('img')[0].src = '../../static/img/svg/zhuanfa.svg'
    }
  }
}
</script>

<style lang='scss' scoped>
.waterfall-wrap{
  width: 100%;
  height: auto;
  padding: 20px 40px;
  position: relative;
}
.Mywaterfall {
    display: flex;
    flex-wrap: wrap;
}
.image-content {
  margin: 5px;
  flex-grow: 1; //瓜分父元素剩余空间
  position: relative;
  overflow: hidden;
  .photo-link{
    width: 100%;
    height: 100%;
    display: block;
    .photo{
      display: block;
      min-width: 100%;
      height: 350px;
      object-fit: cover;
      background-color: #eeeff2;
    }
  }
  &:hover .info{
    bottom:0;
    opacity: 1;
  }
  .info{
    width: 100%;
    height: 50px;
    min-height: 50px;
    position: absolute;
    bottom:-10px;
    left: 0;
    opacity: 1;
    display: flex;
    align-items: center;
    opacity: 0;
    transition: all 0.2s;
    .credits{
      width: calc(100% - 80px);
      display: flex;
      align-items: center;
      margin-left: 10px;
      .avatar{
        width: 30px;
        height: 30px;
        display: inline-block;
        border-radius: 50%;
        background-size: cover;
        background-position: center;
        transition: opacity .2s;
        transition: opacity .2s;
        &:hover{
          opacity: 0.8;
        }
      }
      .photo-info-wrap{
        position: relative;
        max-width: calc(100% - 40px);
        margin-left: 5px;
        display: inline-block;
        vertical-align: middle;
        .photographer{
          max-width: 100%;
          display: inline-block;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &:hover::before{
            background-color: rgba(255,255,255,.15);
          }
          &::before{
            box-sizing: content-box;
            content: " ";
            width: 100%;
            padding: 1px 3px;
            border-radius: 3px;
            height: 100%;
            position: absolute;
            top: -1px;
            left: -3px;
            display: block;
            background-color: rgba(255,255,255,0);
            z-index: 1;
            transition: all .1s;
          }
        }
      }
    }
    .right{
      display: flex;
      align-items: center;
      transition: bottom .2s;
      .like-button,.zhuanfa-button{
        img{
          width: 24px;
          height: 24px;
          margin: 5px;
          border: none;
          margin:3px 12px 3px 0;
        }
      }
      .yingji-button{
        width: 19px;
        height: 19px;
        background-image: url('../../static/img/svg/yingji.svg');
        background-size: 38px 19px;
        background-repeat: no-repeat;
        background-position: 0px 0px;
        cursor: pointer;
        &:hover{
          background-position: -19px 0px;
        }
      }
    }
  }
}
/*  回到顶部-CSS*/
.el-backtop{
  background: #5485fc !important;
  color: white !important;
  border-radius: 0 !important;
  width: 50px !important;
  height: 50px !important;
}
.backtop-div{
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 50px;
}
.el-backtop, .el-calendar-table td.is-today{
  color: #5485fc;
}
</style>
