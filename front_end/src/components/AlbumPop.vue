<template>
  <el-popover
    v-model="visible"
    placement="right"
    width="300"
    trigger="manual"
    popper-class="popverClass">
    <div class="pop_album">
      <h3>添加到影集</h3>
      <span class="pop_close" @click="visible =false">x</span>
      <div class="pop_albumlist">
        <div v-if="albumList.length==0" class="empty-album">暂无影集</div>
        <ul>
          <li v-for="(album,index) in albumList" :key="index" @click="editPicAlbum(album)">
            <img v-if="!album.exist" :src="`http://localhost:8888${album.cover_pic}`" alt="" class="pop_cover_pic">
            <img v-else src="../../static/img/svg/check_setPop.svg" alt="" class="pop_cover_pic">
            <div class="pop_des">{{ album.tit }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div slot="reference" ref="popBtn" class="yingji-btn" @click="show"/>
  </el-popover>
</template>

<script>
export default {
  props: {
    img: { type: Object, default: () => ({}) },
    albumList: { type: Array, default: () => [] }
  },
  data() {
    return {
      visible: false, // 控制pop弹出
      uid: '',
      albumsId: [],
      popBtn: ''
    }
  },
  watch: {
    img: {
      // immediate: true,
      handler(newValue) {
        this.getAlbumsIdByPic()
      }
    }
  },
  mounted() {
    this.uid = this.$store.state.userInfo.id
    this.popBtn = this.$refs.popBtn
  },
  methods: {
    show() {
      this.visible = !this.visible
    },
    changePopPosition(left, top) {
      this.popBtn.style.left = left + 'px'
      this.popBtn.style.top = top + 'px'
    },
    // 获取一张图片所属的所有影集id
    getAlbumsIdByPic() {
      this.$http.post('/api/getAlbumsIdByPic', this.$qs.stringify({ image_id: this.img.id }))
        .then(res => {
          this.albumsId = res.data.albumsId
          this.albumList.forEach(album => {
            if (res.data.albumsId.includes(album.id)) {
              album.exist = true
            } else {
              album.exist = false
            }
          })
        })
    },
    // 根据exist值判断是加入还是移除
    editPicAlbum(album) {
      if (album.exist) {
        this.deletePicAlbum(album)
      } else {
        this.addPicAlbum(album)
      }
    },
    // 把图片加入到影集中
    addPicAlbum(album) {
      album.exist = true
      this.$http.post('/api/addPicAlbum', this.$qs.stringify({ album_id: album.id, image_id: this.img.id, url: this.img.url }))
        .then(res => {
          if (res.data.code === 1) {
            this.$message.success('成功添加到该影集')
          }
        })
    },
    // 将图片从影集中移除
    deletePicAlbum(album) {
      album.exist = false
      this.$http.post('/api/deletePicAlbum', this.$qs.stringify({ album_id: album.id, image_id: this.img.id }))
        .then(res => {
          if (res.data.code === 1) {
            this.$message.error('将该图片从影集中移除')
          }
        })
    }
  }
}
</script>

<style lang='scss'>
.popverClass {
  width:275px;
  height: 280px;
  padding: 0px 0px 15px;
  .pop_album{
    width:100%;
    height:100%;
    position: relative;
    h3{
      width: 100%;
      padding:10px 20px;
      font-size: 14px;
      color: #71767a;
      border-bottom: 1px solid rgba(34,34,34,.1);
    }
    .pop_close{
      position: absolute;
      top: 12px;
      right: 15px;
      width: 15px;
      height: 15px;
      display: block;
      border-radius: 3px;
      background-color: rgb(158, 152, 152);
      cursor: pointer;
      text-align: center;
      line-height: 15px;
    }
    .pop_albumlist{
      height: 100%;
      overflow-y: auto;
      .empty-album{
        position: absolute;
        left: 35%;
        top: 50%;
        font-size: 20px;
      }
      ul{
        li{
          display: flex;
          align-items: center;
          height: 40px;
          font-size: 14px;
          font-weight: 400;
          color: #71767a;
          line-height: 48px;
          background-color: #f7f8fa;
          border-top: 1px solid #eeeff2;
          height: 50px;
          transition: background-color .1s;
          cursor: pointer;
          &:hover{
            background-color: #eeeff2;
          }
        }
      }
      .pop_cover_pic{
        width: 30px;
        height: 30px;
        margin: 0 30px;
        position: relative;
        display: inline-block;
        background-color: #eeeff2;
        object-fit: cover;
        border-radius: 5px;
      }
    }
  }
}
</style>
