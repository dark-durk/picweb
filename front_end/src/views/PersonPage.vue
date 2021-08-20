<template>
  <div>
    <Header>header</Header>
    <div class="profile-content">
      <div class="profile-header">
        <div class="cover-photo">
          <div :style="bg" class="image"/>
          <!-- <div v-if="code" class="bgsetting">
            <a href="javascript:void(0)" class="button tertiary">设置个人封面</a>
          </div> -->
        </div>
        <div class="profile-images">
          <div class="avater-wrapper">
            <img :src="headImg" alt="" class="avatar">
          </div>
        </div>
        <div class="profile-button">
          <div class="wrapper">
            <a v-if="code" href="#/community/personinfo" class="button edit-profile">完善个人资料</a>
          </div>
        </div>
        <div class="user-details">
          <h1><span class="sex">{{ username }}</span></h1>
          <ul class="details">
            <li class="followers">
              <div @click="fansList">
                粉丝<span>{{ fans }}</span>
              </div>
            </li>
            <li class="following">
              <div @click="concernList">
                关注<span>{{ concern }}</span>
              </div>
            </li>
            <li class="statistics">
              <div @click="toActionPage">
                统计
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="tab-wrap">
        <el-tabs v-model="activeName" table-position="right" @tab-click="handleClick">
          <el-tab-pane label="作品" name="published_works">
            <PersonalPhoto :code="code" :img-list="publishedImgList" @getImgListMore="getImgListMore(1, 'publishedPage',publishedPage, 'publishedImgList')"/>
          </el-tab-pane>
          <el-tab-pane v-if="code" label="待审核" name="unpublished_works">
            <PersonalPhoto :code="code" :img-list="unpublishedImgList" @getImgListMore="getImgListMore([0,2], 'unpublishedPage',unpublishedPage, 'unpublishedImgList')"/>
          </el-tab-pane>
          <el-tab-pane v-if="code" label="影集" name="album">
            <el-row :gutter="20" style="margin:20px 40px">
              <el-col :span="8">
                <el-card :body-style="{ padding: '0px' }" shadow="hover" class="box-card" @click.native="dialogVisible = true">
                  <div class="add-icon"/>
                  <p class="add-text">创建影集</p>
                </el-card>
              </el-col>
              <el-col v-for="(album,index) in albumList" :span="8" :key="index" class="el-col">
                <el-card :body-style="{ padding: '0px' }" shadow="hover" class="box-card" @click.native="toAlbumPage(album.id,album)">
                  <el-image :src="`http://localhost:8888${album.cover_pic}`" fit="cover" class="cover-pic">
                    <div slot="error" class="image-slot"/>
                  </el-image>
                  <div class="card-bottom">
                    <div class="card-tit">
                      {{ album.tit }}
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog
        :visible.sync="dialogVisible"
        title="创建影集"
        width="250px"
        height="300px"
        class="add-album"
        @open="open">
        <h4 class="form-header">标题</h4>
        <el-input v-model="albumTit" placeholder="请输入标题"/>
        <h4 class="form-header">描述</h4>
        <el-input :rows="3" v-model="albumDes" style="resize:none" type="textarea" placeholder="请输入内容"/>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="createAlbum">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <Lightbox :visible="visible" :users="users" :head-tit="headTit" @showLightbox="showLightbox" @hiddenLightbox="hiddenLightbox"/>
  </div>
</template>

<script>
import Header from '@/components/Header'
import PersonalPhoto from '@/components/PersonalPhoto'
import Lightbox from '@/components/Lightbox'

export default {
  name: 'PersonPage',
  components: {
    Header,
    PersonalPhoto,
    Lightbox
  },
  data() {
    return {
      bg: {
        'background-image': ' url(../../static/img/500px_bg.jpg)',
        'transform': 'translate3d(0px,0px,0px)'
      },
      uid: '', // 访问主页所属用户的id
      headImg: '../../static/img/headImg.jpg',
      username: '',
      code: 0, // 不是用户自己的主页
      concern: 0, // 关注
      fans: 0, // 粉丝
      users: [], // 传递给组件的关注或粉丝数据
      headTit: '', // 组件弹窗的标题
      visible: false, // 是否显示该组件
      // update: true,
      activeName: '', // 默认打开的tab
      albumList: [], // 影集--封面+标题
      dialogVisible: false, // 创建影集弹框
      albumTit: '',
      albumDes: '',
      publishedImgList: [],
      unpublishedImgList: [],
      publishedPage: 0,
      unpublishedPage: 0
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.query.uid !== from.query.uid) { // 监听路由参数变化。刷新整个组件
        this.uid = to.query.uid
        this.checkUser()
        this.getFollowCount()
        this.publishedPage = 0
        this.unpublishedPage = 0
        this.getImgListInit(1, 'publishedPage', this.publishedPage, 'publishedImgList')
        this.getImgListInit([0, 2], 'unpublishedPage', this.unpublishedPage, 'unpublishedImgList')
      }
    }
  },
  mounted() {
    this.uid = this.$route.query.uid
    this.activeName = this.$route.query.tabs
    this.checkUser()
    this.getFollowCount()
    this.getAlbums(this.uid)

    let _this = this
    this.getImgListInit(1, 'publishedPage', _this.publishedPage, 'publishedImgList')
    this.getImgListInit([0, 2], 'unpublishedPage', _this.unpublishedPage, 'unpublishedImgList')

    window.addEventListener('scroll', function() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      _this.bg.transform = 'translate3d(0px,' + (scrollTop * 0.6) + 'px,0px)'
    })
  },
  methods: {
    // 页面初次载入时获取某一个用户上传的图片，一次20张,pass 1--审核通过的图片，2--审核未通过的图片，0--未审核
    getImgListInit(pass, page, pageVale, imgList) {
      this.$http.get('/api/personpage', { params: { uid: this.uid, page: pageVale, pass: pass }})
        .then(res => {
          this[imgList] = res.data
          this[page]++
        }).catch(error => {
          console.log(error)
        })
    },
    // 用户滑到底部时获取更多图片
    getImgListMore(pass, page, pageVale, imgList) {
      this.$http.get('/api/personpage', { params: { uid: this.uid, page: pageVale, pass: pass }})
        .then((res) => {
          res.data.forEach((item) => {
            this[imgList].push(item)
          })
          this[page]++
        })
    },
    checkUser() {
      this.$http.get('/api/checkUser', { params: { uid: this.uid }})
        .then(res => {
          if (res.data.headImg !== null) {
            this.headImg = 'http://localhost:8888' + res.data.headImg
          }
          this.username = res.data.username
          this.code = res.data.code
        }).catch(error => {
          console.log(error)
        })
    },
    // 获取粉丝和关注者的数量
    getFollowCount() {
      this.$http.post('/api/getfollowcount', this.$qs.stringify({ uid: this.uid }))
        .then(res => {
          this.fans = res.data.fansCount
          this.concern = res.data.concernCount
        }).catch(error => {
          console.log(error)
        })
    },
    // 显示和隐藏Lightbox组件
    showLightbox() {
      this.visible = true
    },
    hiddenLightbox() {
      this.visible = false
    },
    // 显示关注列表
    concernList() {
      this.getFollowList(this.$route.query.uid, 'concern')
      this.headTit = '关注'
      this.showLightbox()
    },
    // 显示粉丝列表
    fansList() {
      this.getFollowList(this.$route.query.uid, 'fans')
      this.headTit = '粉丝'
      this.showLightbox()
    },
    getFollowList(uid, flag) {
      this.$http.post('/api/getfollowlist', this.$qs.stringify({ uid: uid, flag: flag })).then(res => {
        this.users = res.data
      })
    },
    // 点击tab选项卡触发事件
    handleClick(table) {
      if (table.name === 'published_works') {
        this.$router.push({ path: '/personpage', query: { uid: this.uid, tabs: 'published_works' }})
      } else if (table.name === 'unpublished_works') {
        this.$router.push({ path: '/personpage', query: { uid: this.uid, tabs: 'unpublished_works' }})
      } else {
        this.$router.push({ path: '/personpage', query: { uid: this.uid, tabs: 'album' }})
      }
    },
    // 进入用户近7天行为页面
    toActionPage(id) {
      this.$router.push({ path: '/person_action', query: { uid: this.uid }})
    },
    toAlbumPage(id, album) {
      this.$router.push({ path: '/community/album', query: { id: album.id, album: album }})
    },
    // 打开创建影集弹框时数据清零
    open() {
      this.albumTit = ''
      this.albumDes = ''
    },
    // 创建一个影集
    createAlbum() {
      if (!this.albumTit) {
        alert('请填写标题')
      } else {
        this.dialogVisible = false
        this.$http.post('/api/createAlbum', this.$qs.stringify({ uid: this.$route.query.uid, tit: this.albumTit, des: this.albumDes }))
          .then(res => {
            if (res.data.code === 1) {
              this.albumList.unshift({ id: res.data.id, tit: this.albumTit, cover_pic: '' })
            }
          })
      }
    },
    // 获取用户创建的所有影集
    getAlbums(uid) {
      this.$http.post('/api/getAlbums', this.$qs.stringify({ uid: uid }))
        .then(res => {
          if (res.data.code === 1) {
            this.albumList = res.data.albums
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
    .profile-images{
      margin: 0 auto;
      width: 104px;
      height: 104px;
      position: relative;
      top: 52px;
      .avater-wrapper{
        background-color: transparent;
        border-radius: 50%;
        border: 2px solid #fff;
        width: 104px;
        height: 104px;
        overflow: hidden;
        margin: 0 auto;
      }
      .avatar{
        width: 100%;
        height: 100%;
      }
    }
  }
  .profile-button{
    position: relative;
    padding: 10px 10px 0 0;
    margin-bottom: 30px;
    text-align: right;
    .wrapper{
      display: inline-block;
    }
    .edit-profile{
      min-width: 100px;
      height: 30px;
      line-height: 28px;
      border-radius: 3px;
      background-color: #0099e5;
      border: 1px solid #0085d1;
      transition: background-color .1s ease-in-out;
      font-size: .66666667rem;
      &:hover{
        background-color: #19b3ff;
      }
    }
  }
  .user-details{
    h1{
      margin: 0 0 17px;
      font-size: .95238095rem;
      font-weight: 400;
      color: #525558;
    }
    .details{
      font-size: 14px;
      li{
        display: inline-block;
        color: #b9c1c7;
        margin: 0 10px;
        line-height: 1.4em;
        cursor: pointer;
        transition: all .2s;
      }
      span{
        margin-left: 5px;
      }
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
.button{
  width: 140px;
  height: 42px;
  padding: 0 10px;
  position: absolute;
  top: 16px;
  right: 13px;
  line-height: 42px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  background-color: rgba(0,0,0,.4);
  color: #fff;
}
.tab-wrap /deep/{
  width: 100%;
  height: 40px;
  background: #fff;
  .el-tabs__nav{
    left: 50%;
    transform: translateX(-50%) !important;
  }
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
    cursor:pointer
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
  .cover-pic /deep/{
    width: 100%;
    height: 240px;
    display: block;
    .image-slot{
      width: 100%;
      height: 100%;
      background-color: #b9c0c6;
    }
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
