<template>
  <div class="main-container">
    <div class="photo-containner">
      <img :src="`http://localhost:8888${img.url}`" alt="">
      <a href="javascript:void(0)" class="fullscreen-button" @click.stop="toFullScreen($event)"/>
    </div>
    <div class="sidebar">
      <div class="attribution-region">
        <div class="attr-left">
          <a :href="'/#/personpage?uid='+img.uid+'&tabs=published_works'" target="_blank" class="sidebar-avatar">
            <img :src="`http://localhost:8888${img.head_img}`" alt="">
          </a>
        </div>
        <div class="attr-right">
          <a :href="'/#/personpage?uid='+img.uid+'&tabs=published_works'" target="_blank" class="actor">{{ img.username }}</a>
          <div v-if="img.uid!=user.uid" class="follow">
            <a :class="{'button':true, 'follow-button':true, 'following':isFollow,'followed':!isFollow}" href="javascript:void(0)" @click="follow">{{ followValue }}</a>
          </div>
          <span v-if="img.uid==user.uid" class="followers">{{ fans }}粉丝</span>
        </div>
      </div>
      <div class="action-region">
        <div class="like-button">
          <a href="#" class="like-count" @click="dianZan">
            <img :src="like" alt="">
            <span class="value">{{ likeCount }}</span>
          </a>
        </div>
      </div>
      <div class="des-region">
        <div class="des">
          <h2>{{ img.tit }}</h2>
          <p>{{ img.des }}</p>
        </div>
      </div>
      <div class="close" @click="backHistory"/>
      <div class="photo-type">
        <span class="photo-type-left">分类</span>
        <span class="photo-type-right">{{ img.type }}</span>
      </div>
      <div v-if="code" class=" edit-photos">
        <router-link :to="{path:'/upload/single_pic_edit',query:{pId:img.id}}" class="edit-photo">编辑</router-link>
        <a href="javascript:void(0)" class="edit-photo" @click="deletePhoto(img)">删除</a>
      </div>
      <div class="activity-region">
        <div class="comment-container">
          <div class="comment">
            <a :href="`/#/personpage?uid=${user.uid}&tabs=published_works`" class="avatar" target="_blank">
              <img :src="user.headImg" alt="">
            </a>
            <div :class="{'comment-icon':this.$store.state.userLogin}" @click="toComment"/>
            <div class="comment-right">
              <a v-if="!this.$store.state.userLogin" href="/#/login" class="login">登录</a>
              <textarea ref="textarea" :placeholder="isLoginVale" :disabled="focusValue" maxlength="300" class="new-comment" rows="1" data-autosize-on="true"/>
            </div>
          </div>
        </div>
        <ul class="comments-region">
          <li v-if="!isComments" class="empty-comments">
            <div class="empty-comments-container">
              <div class="comment-icon large"/>
              <h2>暂无评论</h2>
              <p>将图片分享给好友，展开话题。</p>
            </div>
          </li>
          <li v-for="(data,index) in comments" :key="index">
            <div class="comment">
              <a :href="`/#/personpage?uid=${data.uid}`" class="avatar" target="_blank">
                <img :src="`http://localhost:8888${data.head_img}`" alt="">
              </a>
              <div class="comment-right">
                <a :href="`/#/personpage?uid=${data.uid}`" class="actor" target="_blank">{{ data.username }}</a>
                <div class="des-comment">{{ data.content }}</div>
                <a v-if="(user.uid==data.uid)||isAdmin" href="javascript:void(0)" class="delete" @click="deleteComment(data.id,index)">删除</a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PhotoDetails',
  // props: [{ img }],
  data() {
    return {
      code: 0, // 判断页面归属
      isAdmin: false, // 管理员查看页面
      img: {
        id: '',
        src: '../../static/img/500px229526245.jpg',
        head_img: '',
        uid: '',
        username: '',
        tit: '',
        des: '',
        type: ''
      },
      user: {
        uid: '',
        headImg: '../../static/img/default_tx.png'
      },
      comments: [], // 评论数据
      isComments: false, // 判读评论数量是否为0
      like: '../../static/img/svg/dianzan2.svg',
      likeCount: 0,
      followValue: '关注',
      isFollow: true,
      isLoginVale: '', // 判断是否登录来显示评论框中的值
      focusValue: false,
      fans: 0
    }
  },
  mounted() {
    this.getPhotoDetails()
    if (this.$store.state.userLogin) {
      this.isLoginVale = '发表您的见解'
      this.focusValue = false
    } else {
      this.$refs.textarea.style.paddingLeft = '35px'
      this.isLoginVale = '并分享您的见解'
      this.focusValue = true
    }
    this.getComments()
  },
  methods: {
    getPhotoDetails() {
      this.$http.get('/api/community/photo-details', { params: { pId: this.$route.query.pId }})
        .then((res) => {
          this.img = res.data[0]
          this.initPage()
          this.checkUser()
        }).catch((err) => console.log(err))
      this.user.headImg = this.$store.state.userInfo.headImg
    },
    // 删除图片
    deletePhoto(img) {
      if (confirm('确认删除这张图片吗?')) {
        this.$http.post('/api/deletePhoto', this.$qs.stringify({ pid: this.$route.query.pId, url: img.src }))
          .then(res => {
            this.$router.go(-1)
          }).catch(err => console.log(err))
      } else {
        return false
      }
    },
    checkUser() {
      this.$http.get('/api/checkUser', { params: { uid: this.img.uid }})
        .then(res => {
          this.code = res.data.code
          if (res.data.isAdmin) { this.isAdmin = true }
        }).catch(error => {
          console.log(error)
        })
    },
    // 将图片全屏
    toFullScreen(e) {
    // 获得点击元素的前一个元素
      let img = e.currentTarget.previousElementSibling
      this.myFullScreen(img)
    },
    // 传入一个节点,会将其全屏展示
    myFullScreen(node) {
      // var docElm = document.documentElement
      let docElm = node
      if (docElm.requestFullscreen) { // W3C
        docElm.requestFullscreen()
      } else if (docElm.mozRequestFullScreen) { // FireFox
        docElm.mozRequestFullScreen()
      } else if (docElm.webkitRequestFullScreen) { // Chrome等
        docElm.webkitRequestFullScreen()
      } else if (docElm.msRequestFullscreen) { // IE11
        docElm.msRequestFullscreen()
      }
    },
    // 回退到上一个页面
    backHistory() {
      this.$router.back()
    },
    // 获取点赞数量，和页面是否关注
    initPage() {
      this.$http.post('/api/getzancount', this.$qs.stringify({ composeId: this.$route.query.pId }))
        .then(res => {
          this.likeCount = res.data.likeCount
          // eslint-disable-next-line eqeqeq
          if (res.data.isDelete == 1) {
            this.like = '../../static/img/svg/dianzan2ed.svg'
          } else {
            this.like = '../../static/img/svg/dianzan2.svg'
          }
        })
      if (this.$store.state.userLogin) {
        this.$http.post('/api/isfollow', this.$qs.stringify({ concern: this.img.uid }))
          .then(res => {
            // eslint-disable-next-line eqeqeq
            if (res.data.isFollow == 1) {
              this.followValue = '已关注'
              this.isFollow = false
            } else {
              this.followValue = '关注'
              this.isFollow = true
            }
          })
        this.$http.post('/api/getfollowcount', this.$qs.stringify({ uid: this.img.uid }))
          .then(res => {
            this.fans = res.data.fansCount
          })
      }
    },
    // 点赞
    dianZan() {
      if (!this.$store.state.userLogin) {
        this.$router.push({ path: '/login' })
      }
      if (this.img.uid === this.user.uid) {
        alert('自己不能给自己点赞')
        return
      }
      this.$http.post('/api/dianzan', this.$qs.stringify({ composeId: this.$route.query.pId }))
        .then(res => {
          if (res.data.code === 1) {
            if (this.like === '../../static/img/svg/dianzan2.svg') {
              this.likeCount++
              this.like = '../../static/img/svg/dianzan2ed.svg'
            } else {
              let rs = confirm('确认取消点赞？')
              if (rs) {
                this.likeCount--
                this.like = '../../static/img/svg/dianzan2.svg'
              }
            }
          }
        }).catch((err) => {
          console.log(err)
        })
    },
    // 关注事件
    follow() {
      if (!this.$store.state.userLogin) {
        this.$router.push({ path: '/login' })
      }
      this.$http.post('/api/follow', this.$qs.stringify({ concern: this.img.uid }))
        .then(res => {
          if (res.data.code === 1) {
            if (this.followValue === '关注') {
              this.followValue = '已关注'
              this.isFollow = false
            } else {
              let v = confirm('是否取消关注？')
              if (v) {
                this.followValue = '关注'
                this.isFollow = true
              }
            }
          } else {
            console.log('关注失败')
          }
        }).catch((err) => {
          console.log(err)
        })
    },
    // 将我的评论发送给服务器
    toComment() {
      let content = this.$refs.textarea.value
      if (content.length > 0) {
        this.$http.post('/api/addComment', this.$qs.stringify({ composeId: this.$route.query.pId, type: this.img.type, content: content }))
          .then(res => {
            if (res.data.code === 1) {
              this.$refs.textarea.value = ''
              this.getComments()
            } else {
              alert(res.data.msg)
            }
          }).catch((err) => {
            console.log(err)
          })
      }
    },
    // 向服务器获取评论
    getComments() {
      this.$http.post('/api/getComments', this.$qs.stringify({ pId: this.$route.query.pId }))
        .then((res) => {
          this.comments = res.data.comments
          if (this.$store.state.userLogin) {
            this.user.uid = res.data.uid
          }
          if (res.data.comments.length > 0) {
            this.isComments = true
          } else {
            this.isComments = false
          }
        }).catch((err) => console.log(err))
    },
    // 删除自己的评论
    deleteComment(id, index) {
      if (confirm('确认删除吗？')) {
        this.comments.splice(index, 1)
        this.$http.post('/api/deleteComment', this.$qs.stringify({ id: id }))
          .then((res) => {

          }).catch((err) => console.log(err))
      }
    }
  }

}
</script>

<style lang='scss' scoped>
@mixin button($url){
  position: absolute;
  top: 10px;
  right: 20px;
  width: 34px;
  height: 34px;
  z-index: 60;
  opacity: 0;
  transition: all .2s;
  background: url($url) no-repeat center center;
}
.main-container{
  height: 548px;
  margin: 20px;
  padding: 10px;
  box-shadow: 0 2px 80px rgba(0,0,0,.1);
  overflow: hidden;
  position: relative;
  background-color: #fff;
  .photo-containner{
    max-width:calc(100% - 320px) ;
    height: 100%;
    overflow: hidden;
    position: relative;
    &:hover .fullscreen-button{
      opacity: 1;
    }
    img{
      height: 100%;
      border: none;
    }
    .fullscreen-button{
      @include button('../../static/img/svg/fullscreen1.svg')
    }
  }
  .sidebar{
    width: 320px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    overflow-y: auto;
    box-shadow: 0 0 1px rgba(0,0,0,.15);
    .attribution-region{
      height: 90px;
      padding: 20px;
      text-align: left;
      border-bottom: solid 1px #eeeff2;
      .attr-left{
        width: 50px;
        height: 50px;
        float: left;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        &:hover{
          opacity: 0.5;
        }
      }
      .attr-right{
        padding-left: 10px;
        max-width: calc(100% - 60px);
        float: left;
        .actor{
          line-height: 1.4em;
          color: #525558;
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .followers{
          color: #b8c1c8;
          display: block;
          margin-top: 5px;
          font-size: 14px;
        }
        .follow{
          margin-top: 2px;
          .following{
            color: #0099e5;
            border-color: #0099e5;
            background-position: 10px center;
            background-repeat: no-repeat;
            background-image: url('../../static/img/svg/jiahao.svg');
            &:hover{
              background-color: rgba(0,153,229,.1);
            }
          }
          .followed{
            border-color: #2fab41;
            background-color: #34bf49;
            color: #fff;
            background-position: 10px center;
            background-repeat: no-repeat;
            background-image: url('../../static/img/svg/duihao.svg');

          }
          .follow-button{
            padding: 5px 10px 5px 22px;
            font-size: 12px;
            font-weight: 400;

          }
        }
      }
    }
    .action-region{
      height:  60px;
      border-bottom: solid 1px #eeeff2;
      display: flex;
      justify-content:center;
      align-items: center;
      .like-count{
        display:flex;
        align-items: center;
        img{
          height: 24px;
          width: 24px;
        }
        &:hover{
          color: #71767a;
        }
      }
      .value{
        margin-left: 5px;
        font-size: 16px;
        font-weight: 500;
        color: #71767a;
      }
    }
    .des-region{
      text-align: left;
      position: relative;
      padding: 20px;
      border-bottom: 1px solid #eeeff2;
      color: #525558;
      .des{
        h2{
          font-size: 16px;
          line-height: 22px;
        }
        p{
          max-height: 50px;
          margin-top: 10px;
          overflow: hidden;
          font-size: 12px;
          line-height: 16px;
        }
      }
    }
    .close{
      position: absolute;
      width: 30px;
      height: 30px;
      top: 20px;
      right: 30px;
      cursor: pointer;
      background: url('../../static/img/svg/close.svg') no-repeat center;
      background-size: cover;
    }
    .photo-type{
      width: 100%;
      height: 35px;
      padding: 0 20px;
      background-color: #f7f8fa;
      font-size: 14px;
      line-height: 35px;
      border-bottom: 1px solid #eeeff2;
      .photo-type-left{
        float: left;
        color: #b8c1c8;
      }
      .photo-type-right{
        float:right;
        white-space: nowrap;
        color: #525558;
      }
    }
    .edit-photos{
      width: 100%;
      height: 48px;
      padding: 10px 0;
      background-color: #f7f8fa;
      border-bottom: 1px solid #eeeff2;
      .edit-photo{
        width: 80px;
        height: 28px;
        padding: 7px;
        border-radius: 3px;
        display: inline-block;
        color: #525558;
        font-size: 14px;
        background-color: #eeeff2;
        transition: background-color .2s;
        &:hover{
          background-color: #e0e1e7;
        }
      }
    }
    .activity-region{
      text-align: left;
      height: 274px;
      position: relative;
      background-color: #f7f8fa;
      .comment-container{
        width: 100%;
        height: 60px;
      }
      .comment{
        width: 100%;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        &:hover .delete{
            display: block;
          }
      }
      .avatar{
          width:22px;
          height: 22px;
          display:block;
          float: left;
          border-radius: 50%;
          img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
          &:hover{
            opacity: 0.5;
          }
        }
        .comment-icon{
          cursor: pointer;
          position: absolute;
          top: 18px;
          right: 55px;
          z-index: 1;
          width: 25px;
          height: 25px;
          background-image: url('../../static/img/svg/reply.svg');
          background-size: 16px;
          background-repeat: no-repeat;
          background-position: center center;
          display: inline-block;
        }
        .comment-right{
          width: calc(100% - 55px);
          padding-left: 10px;
          float: left;
          position: relative;
          .login{
            position: absolute;
            left: 22px;
            top: 12px;
            z-index: 1;
            font-size: 12px;
            color: #0099e5;

          }
          .delete{
            position: absolute;
            top: 35px;
            right: 0;
            display: none;
            float: right;
            line-height: 20px;
            color: #ef4546;
            transition: opacity .2s ease-out,color .2s ease-out;
          }
          .new-comment{
            overflow: hidden;
            word-wrap: break-word;
            height: 40px;
            position: relative;
            padding: 10px 30px 10px 10px;
            line-height: 1.4em;
            font-size: 12px;
            border: 1px solid #eeeff2;
            width: calc(100% );
            resize: none;
            outline-color:#0099e5;
            background-color: white;
          }
        }

      .comments-region{
        width: 300px;
        height: 200px;
        font-size: 12px;
        line-height: 1.4em;
        font-weight: 400;
        color: #525558;
        li{
          width: 100%;
          min-height: 50px;
          background-color: #f7f8fa;
        }
        .des-comment{
          word-wrap:break-word;
          word-break:break-all;
          overflow: hidden;
        }
        .empty-comments{
          display: table;
          height: 100%;
          width: 100%;
          .empty-comments-container{
            display: table-cell;
            vertical-align: middle;
            text-align: center;
            padding: 15px 0 35px 0;
          }
          h2{
            font-size: 18px;
            color: #b9c1c7;
            padding: 0;
            margin: 0 0 10px 0;
          }
          p{
            color: #b9c1c7;
            position: relative;
            line-height: 20px;
            max-width: 210px;
            display: inline-block;
          }
        }
        .large{
          position: inherit;
          background-size: 25px;
          background-repeat: no-repeat;
          background-position: center center;
          display: inline-block;
          margin: 15px;
        }
      }
      .actor{
        font-size: 14px;
        font-weight: 700;
        line-height: 1.4em;
        color: #525558;
        transition: color .2s;
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

</style>
