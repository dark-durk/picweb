<template>
  <div class="waterfall-wrap">
    <!-- //图片显示区域 -->
    <div class="Mywaterfall">
      <div v-for="(img,index) in imgList" :key="index" :data-id="img.id" class="image-content">
        <a v-if="isAlbum" href="" class="cover-pic" @click.prevent="setAlbumCoverPic(img.url)">✓</a>
        <a v-if="code&&img.pass==1" href="" class="remove" @click.prevent="deletePhoto(img.id,img.url)"/>
        <a v-else-if="isAlbum" class="remove" @click.prevent="deletePicAlbum(img.id,index)"/>
        <a :href="'/#/community/photo-details?pId='+img.id" class="photo-link" @click.prevent="getDetails(img.id)">
          <img :src="`http://localhost:8888${img.url}`" :data-id="img.id" :data-src="img.url" class="photo">
        </a>
        <div v-if="img.pass==1?false:true" class="pic-checking">
          <div v-if="img.pass==0?true:false" class="pic-checking-tip passing">审核中</div>
          <div v-if="img.pass==2?true:false" class="pic-checking-tip unpass">审核未通过
            <p>{{ img.unpass_reason }}</p>
          </div>
          <el-button v-if="img.pass==2?true:false" type="primary" class="button-position" icon="el-icon-edit" circle plain size="mini" @click="editUnpassPic(img)"/>
        </div>
        <div v-if="img.pass==1?true:false" class="info">
          <div class="credits">
            <div class="photo-info-wrap">
              <span class="photographer">{{ img.username }}</span>
            </div>
          </div>
          <div class="right">
            <!-- 点赞 -->
            <a href="javascript:void(0)" class="like-button" @mouseenter="changeLikeState($event)" @mouseleave="changeLikeStated($event)">
              <img src="../../static/img/svg/dianzan.svg" alt="">
            </a>
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

export default { // 注入依赖
  name: 'PersonalPhoto',
  components: {
    AlbumPop
  },
  props: {
    code: { type: [Number, String], default: 0 }, // 判断用户是否一致
    imgList: { type: [Array], default: () => [] }
  },
  data() {
    return {
      uid: '',
      albumList: [],
      updatePopover: true,
      isAlbum: false,
      img: null, // 传给子组件albumpop的图片对象
      albumPopTime: '' // 子组件albumpop的ref名，根据时间生成
    }
  },
  watch: {
    imgList: {
      immediate: true,
      handler(newValue) {
        this.imgList = newValue
      },
      deep: true
    }
  },
  created() {
    this.uid = this.$store.state.userInfo.id
  },
  mounted() {
    if (this.$route.query.album) {
      this.isAlbum = true
    }
    this.albumPopTime = String(new Date())
    const _this = this
    window.onscroll = function() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop // 滚动的距离
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight // 屏幕高度
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight // 滚动条的高度
      // eslint-disable-next-line eqeqeq
      if ((scrollTop + windowHeight + 1) > scrollHeight) {
        // 滑动底部加载更多图片
        _this.noticeParent()
      }
    }
    setTimeout(() => {
      _this.getAlbums()
    }, 500)
  },
  methods: {
    // 修改子组件albumPop的位置
    changePopPosition(img, e) {
      let albumPopTime = this.albumPopTime
      this.img = img
      let p = e.currentTarget.getBoundingClientRect()
      let w = document.getElementsByClassName('waterfall-wrap')[0].getBoundingClientRect()
      let top = p.top - w.top
      let left = p.left - w.left
      this.$refs[albumPopTime].changePopPosition(left, top)
    },
    // 通知父组件
    noticeParent() {
      this.$emit('getImgListMore')
    },
    // 获取用户创建的所有影集
    getAlbums() {
      this.$http.post('/api/getAlbums', this.$qs.stringify({ uid: this.$store.state.userInfo.id }))
        .then(res => {
          if (res.data.code === 1) {
            res.data.albums.forEach(album => {
              album.exist = false // 判断影集中是否存在该图片,默认不存在
            })
            this.albumList = res.data.albums
          }
        })
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
    // 删除图片
    deletePhoto(pId, url) {
      if (confirm('确认删除这张图片吗?')) {
        this.$http.post('/api/deletePhoto', this.$qs.stringify({ pid: pId, url: url }))
          .then(res => {
            alert(res.data.msg)
            this.reload()
          }).catch(err => console.log(err))
      } else {
        return false
      }
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
    },
    // 编辑审核未通过的图片
    editUnpassPic(img) {
      this.$router.push({ path: '/upload/single_pic_edit', query: { pId: img.id }})
    },
    // 将图片从影集中移除
    deletePicAlbum(imgId, index) {
      this.$confirm('是否将此图片从影集中移除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$http.post('/api/deletePicAlbum', this.$qs.stringify({ album_id: this.$route.query.id, image_id: imgId }))
          .then(res => {
            if (res.data.code === 1) {
              this.$message.error('将该图片从影集中移除')
              this.imgList.splice(index, 1)
            }
          })
      }).catch(() => {
      })
    },
    // 设置影集封面
    setAlbumCoverPic(url) {
      this.$confirm('是否将此图片设为影集封面?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$http.post('/api/setAlbumCoverPic', this.$qs.stringify({ album_id: this.$route.query.id, url: url }))
          .then(res => {
            if (res.data.code === 1) {
              this.$message.success('设置成功')
            }
          })
      }).catch(() => {
      })
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
.button-position{
  position: absolute;
  right: 20px;
  bottom: 18px;
}
.pic-checking{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background-color: rgba(0,0,0,.5);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: inherit;
  .pic-checking-tip{
    font-size: 14px;
    color: #fff;
  }
  .passing{
    padding-top: 20px;
    background: url('../../static/img/svg/clock.svg') no-repeat center top;
    background-size: 14px;
  }
  .unpass{
    color: red;
    font-size: 20px;
    p{
      margin-top: 10px;
      font-size: 12px;
    }
  }
}
.image-content {
  margin: 5px;
  flex-grow: 1;
  position: relative;
  overflow: hidden;
  &:hover .remove{
    top:10px;
    opacity: 1;
  }
  &:hover .cover-pic{
    top:12px;
    opacity: 1;
  }
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
    }
  }
}
.yingji-button {
  width: 19px;
  height: 19px;
  background-image: url("../../static/img/svg/yingji.svg");
  background-size: 38px 19px;
  background-repeat: no-repeat;
  background-position: 0px 0px;
  cursor: pointer;
}
.yingji-button:hover {
  background-position: -19px 0px;
}
.remove{
  width: 25px;
  height: 25px;
  position: absolute;
  top: -4px;
  right: 10px;
  opacity: 0;
  background: url('../../static/img/x.png') no-repeat center;
  background-size:15px;
  background-position: 50%;
  transition: all .2s;
  border-radius: 3px;
  &:hover{
    background-color: rgba(255,255,255,.4);
  }
}
.cover-pic{
  position: absolute;
  top: -4px;
  right: 50px;
  opacity: 0;
  transition: all .2s;
  &:hover{
    color: blue;
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
