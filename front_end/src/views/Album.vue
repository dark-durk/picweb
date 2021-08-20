<template>
  <div>
    <Header>header</Header>
    <div class="profile-content">
      <div class="profile-header">
        <div class="cover-photo">
          <div :style="bg" class="image"/>
          <div class="bgsetting"/>
        </div>
      </div>
    </div>
    <div class="album-header">
      <el-button type="danger" class="del-btn" @click="deleteAlbum">删除</el-button>
      <h2 class="album-tit">{{ album.tit }}</h2>
      <div class="album-des">{{ album.des }}</div>
    </div>
    <div class="album-pics">
      <div v-if="imgList.length==0" class="empty-album">
        <img src="../../static/img/svg/empty.svg" alt="">
        <p class="alert">开始添加照片到影集</p>
        <el-button type="primary" @click="toIndexPage">收集图片</el-button>
      </div>
      <PersonalPhoto v-else :img-list="imgList"/>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import PersonalPhoto from '@/components/PersonalPhoto'

export default {
  name: 'Album',
  components: {
    Header,
    PersonalPhoto
  },
  data() {
    return {
      bg: {
        backgroundImage: ' url(../../static/img/500px_bg.jpg)',
        transform: 'translate3d(0px,0px,0px)'
      },
      album: '',
      imgList: []
    }
  },
  mounted() {
    this.getAlbumById()
    this.getPicByAlbumId()
  },
  methods: {
    // 获取影集对象
    getAlbumById() {
      this.$http.post('/api/getAlbumById', this.$qs.stringify({ id: this.$route.query.id }))
        .then(res => {
          if (res.data.code === 1) {
            this.album = res.data.album
            this.bg.backgroundImage = `url(http://localhost:8888${res.data.album.cover_pic})`
          }
        })
    },
    // 删除影集
    deleteAlbum() {
      this.$confirm('是否删除影集?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/api/deleteAlbum', this.$qs.stringify({ id: this.$route.query.id }))
          .then(res => {
            if (res.data.code === 1) {
              this.$router.back()
            } else {
              this.$message.error('删除失败!')
            }
          })
      })
    },
    toIndexPage() {
      this.$router.push({ path: '/community/discover', query: { t: 'rating' }})
    },
    // 获取该影集的图片
    getPicByAlbumId() {
      this.$http.post('/api/getPicByAlbumId', this.$qs.stringify({ album_id: this.$route.query.id }))
        .then(res => {
          if (res.data.code === 1) {
            this.imgList = res.data.imgList
          }
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.profile-content{
  .profile-header{
    padding-bottom: 20px;
    background-color: #fff;
    .cover-photo{
      position: relative;
      overflow: hidden;
      height: 498px;
      min-height: 200px;
      background: #b9c0c6;
      margin-bottom: -104px;
      &:hover .bgsetting{
        opacity: 1;
      }
      .bgsetting{
        opacity: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0,0,0,.2);
        position: absolute;
        top: 0;
        left: 0;
        transition: opacity .2s;
        .tertiary{
          border-color: rgba(185,193,199,.5);
          text-shadow: none;
        }
      }
    }
  }
}
  .album-header{
    width: 100%;
    height: 100px;
    position: relative;
    margin-top: 85px;
    background-color: #fff;
    .del-btn{
      width: 70px;
      height: 30px;
      padding: 0;
      position: absolute;
      right: 50px;
      bottom: 20px;
    }
    .album-tit{
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
    }
    .album-des{
      max-width: 70%;
      position: absolute;
      top: 55px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 14px;
    }
  }
  .album-pics{
    height: 350px;
    .empty-album{
      width: 410px;
      height: 240px;
      margin: 0 auto;
      transform: translateY(100px);
      img{
        width: 54px;
        height: 54px;
        margin: 0 auto 20px;
      }
      p{
        margin: 20px 0;
      }
    }
  }
.image{
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  transform: translate3d(0,0,0);
}
.el-row{
  margin: 0 40px;
}
.el-col{
    margin-bottom: 20px;
  }
 .box-card{
    position: relative;
    width:360px;
    height: 330px;
  }
  .card-bottom{
    width: 100%;
    height: 90px;
    position: relative;
    .card-tit{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    font-size: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 65%;
    }
    &:hover{
      color: #0099e5
    }
  }
  .cover-pic{
    width: 100%;
    height: 240px;
    display: block;
  }
  .add-icon{
    background-image: url('../../static/img/svg/add.svg');
    background-position: 50% bottom;
    background-repeat: no-repeat;
    background-size: 40px;
    padding-top: 45%;
    padding-top: calc(50% - 40px);
  }
  .add-text{
    margin-top: 10px;
    color: #0099e5;
    font-size: 20px;
  }
  .add-album{
    .el-input{
      margin-bottom: 10px;
    }
    .form-header{
      margin-bottom: 10px;
      text-align: left;
      font-size: 14px;
      color: #0099e5;
      font-weight: 400;
    }
  }
</style>
