<template>
  <div>
    <Header>Header</Header>
    <div class="upload-main-body">
      <div class="left-body">
        <div v-if="!visible" class="photo-wrapper">
          <div :style="{'width':w+'px','height':h+'px'}" class="photo-container">
            <div v-if="!visible" :style="{'background-image': 'url(http://localhost:8888'+img.url+')'}" class="showImg"/>
          </div>
        </div>
        <ul v-if="visible">
          <li :style="hid" class="single-pic-wrap">
            <div :style="imgSize" class="overlay">
              <a href="javascript:;" class="remove" @click="removeImg($event)"/>
              <img :src="src" :style="imgSize" alt="" class="landscape">
            </div>
          </li>
          <li class="single-pic-more">
            <div class="addMoreIcon">+</div>
            <div class="label dz-clickable">选择图片</div>
            <input type="file" class="singlepic-upload" name="imgFile" accept="image/jpeg,image/jpg" @change="getPic($event)">
          </li>
        </ul>
      </div>
      <div :style="autoHeight" class="right-body">
        <div class="top">
          <div class="uploadPrompt">每张图大小不超过50MB</div>
          <input v-model="buttonValue" class="button blue" type="button" @click="savePic">
        </div>
        <div class="form">
          <div class="title-cmp">
            <div class="label">标题</div>
            <input v-model="img.tit" maxlength="30" type="text" value="">
          </div>
          <div class="desc-cmp">
            <div class="label">描述</div>
            <textarea id="mainTextarea" v-model="img.des" placeholder="分享镜头背后的故事" class="ant-input"/>
          </div>
          <div class="select-cmp">
            <div class="label">分类</div>
            <div class="select_wrap">
              <select ref="selected">
                <option v-for="(value,index) in options" :key="index" :value="index">{{ value }}</option>
              </select>
              <div class="arrows"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
export default {
  name: 'SinglePic',
  components: {
    Header
  },
  data() {
    return {
      buttonValue: '', // 保存更改或上传图片
      // 右侧内容高度
      autoHeight: {
        height: ''
      },
      // 预览图片尺寸
      imgSize: {
        width: '',
        height: ''
      },
      // 预览图片地址
      src: '',
      // 预览框隐藏起来
      hid: { display: 'none' },
      // option内容
      options: ['未分类', '抽象', '动物', '人物', '自然', '黑白', '生活', '美食', '城市', '水下', '街拍'],
      img: {
        id: '',
        url: '',
        tit: '', // 图片标题
        des: '', // 图片详情
        type: ''
      },
      imgFile: '', // 上传图片的数据
      visible: false, // 图片上传窗口是否显示，true显示
      w: '800px', // 编辑图片时图片的宽高
      h: '500px'
    }
  },
  created() {
    if (this.$route.name === 'SinglePicEdit') { // 编辑图片
      this.buttonValue = '保存更改'
      this.getPhotoDetails()
    } else if (this.$route.name === 'SinglePic') { // 上传图片
      this.buttonValue = '上传图片'
      this.visible = true
    }
  },
  mounted() {
    // 获取屏幕除头部外的高度
    this.autoHeight.height = window.innerHeight - 72 + 'px'
  },
  methods: {
    savePic() {
      if (this.buttonValue === '上传图片') {
        this.uploadPic()
      } else {
        this.editPhoto()
      }
    },
    // 实现图片预览功能
    getPic(event) {
      this.imgFile = event.target.files[0]
      let windowurl = window.URL || window.webkitURL
      let code = 1
      let img = new Image()
      img.src = windowurl.createObjectURL(this.imgFile)
      let that = this
      img.onload = function() {
        img.width / img.height > 1 ? code = 1 : code = 0
        // eslint-disable-next-line eqeqeq
        if (code == 1) {
          that.imgSize.width = 220 + 'px'
          that.imgSize.height = ''
        } else {
          that.imgSize.width = ''
          that.imgSize.height = 220 + 'px'
        }
        that.src = windowurl.createObjectURL(that.imgFile)
      }
      this.hid.display = 'block'
    },
    // 上传图片按钮
    uploadPic() {
      if (this.imgFile.length <= 0) {
        alert('请选择图片!')
        return
      }
      if (this.img.tit.length <= 0) {
        alert('请填写标题!')
        return
      }
      let data = new FormData()
      let type = this.options[this.$refs.selected.value]
      data.append('tit', this.img.tit)
      data.append('type', type)
      data.append('image', this.imgFile)
      data.append('des', this.img.des)
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data' // 以表单传数据的格式来传递fromdata
        }
      }
      this.$http.post('/api/upload/single_pic', data, config)
        .then(res => {
          if (res.data.code === 1) {
            this.$router.push({ path: '/personpage', query: { uid: this.$store.state.userInfo.id, tabs: 'unpublished_works' }})
          } else {
            alert(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    // 获取图片信息
    getPhotoDetails() {
      this.$http.get('/api/community/photo-details', { params: { pId: this.$route.query.pId }})
        .then((res) => {
          this.img = res.data[0]
          // 将数据库中type值赋值给前端的option
          let optionsIndex = this.options.findIndex((value) => value === this.img.type)
          this.$refs.selected.value = optionsIndex
          // 设置图片的宽高
          let photo = new Image()
          photo.src = 'http://localhost:8888' + this.img.url
          let _this = this
          photo.onload = function() {
            if (photo.width > photo.height) {
              _this.w = 800
              _this.h = 800 / photo.width * photo.height
            } else {
              _this.h = 800
              _this.w = 800 / photo.height * photo.width
            }
          }
        }).catch(err => console.log(err))
    },
    // 保存图片修改后的数据
    editPhoto() {
      let type = this.options[this.$refs.selected.value]
      this.img.type = type
      this.$http.post('/api/single_pic_edit', this.$qs.stringify({ img: this.img }))
        .then(res => {
          console.log()
          if (res.data.code === 1) {
            this.$router.push({ path: '/personpage', query: { uid: this.$store.state.userInfo.id, tabs: 'unpublished_works' }})
          } else {
            alert(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.upload-main-body{
  width: 100%;
  min-width: 1200px;
  position: absolute;
  .left-body{
    float: left;
    padding: 0 50px;
    width: calc(100% - 360px);
    height: 100%;
    overflow-y: auto;
    .photo-wrapper{
      width: 800px;
      height: 500px;
      margin: 40px auto 0;
      position: relative;
      .photo-container{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        .showImg{
          height: 100%;
          background-size: cover;
        }
      }
    }
    ul{
      li{
        width: 220px;
        height: 220px;
        position: relative;
        margin: 20px 0 0 20px;
        float: left;
        pointer-events: auto;
        border: 2px solid #b9c1c7;
        color: #b9c1c7;
        font-weight: 400;
        text-align: center;
        cursor: pointer;
        padding: 3px;
       .addMoreIcon {
          display: block;
          height: 24px;
          line-height: 24px;
          width: 24px;
          font-size: 30px;
          margin: 80px auto 0;
       }
       .singlepic-upload{
         width: 100%;
         height: 100%;
         position: absolute;
         top: 0;
         left: 0;
         opacity: 0;
         z-index: 1;
       }
      }
      .single-pic-wrap{
        float: left;
        position: relative;
        margin: 20px 0 50px 20px;
        cursor: default;
        border: 0;
      }
      .overlay{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        &:hover .remove{
          top:10px;
          opacity: 1;
        }
        img{
          height: 100%;
        }
      }
      .remove{
        width: 16px;
        height: 16px;
        position: absolute;
        top: -4px;
        right: 6px;
        opacity: 0;
        background: url('../../static/img/x.png') no-repeat;
        background-size: 10px;
        background-position: 50%;
        transition: all .2s;
      }
    }
    .label {
      text-align: center;
      font-size: 18px;
      font-weight: 500;
      color: #b9c1c7;
    }
  }
  .right-body{
    float: right;
    width: 360px;
    min-height: 100%;
    height: 100%;
    padding: 0 0 32px;
    position: absolute;
    top: 0;
    right: 0;
    overflow: hidden;
    border-left: 1px solid #eeeff2;
    background: #fff;
    text-align: left;
    .top{
      padding: 32px 24px 0;
      height: 160px;
      border-bottom: 1px solid #eeeff2;
      input[type=button]{
        width: 290px;
        height: 46px;
        font-weight: 700;
        border-radius: 24px;
      }
      .uploadPrompt{
        font-size: 14px;
        line-height: 1.43;
        letter-spacing: normal;
        text-align: center;
        color: #6d7378;
        margin-bottom: 12px;
      }
    }
    .form{
      height: calc(100% - 127px);
      padding: 24px 20px;
      position: absolute;
      top: 160px;
      overflow: auto;
      bottom: 0;
      left: 0;
      right: 0;
      &>div{
        margin-bottom: 32px;
      }
      input{
        width: 100%;
        padding: 8px 10px;
        font-size: 14px;
        color: #525558;
        border: 1px solid rgba(185,193,199,.5);
        border-radius: 3px;
        transition: border-color .2s;
        resize: none;
        line-height: 1.4em;
        &:focus{
            border-color: #0099e5;
          }
      }
      .desc-cmp{
        .ant-input{
          width: 100%;
          height: 106px;
          padding: 4px 11px;
          flex: 1;
          resize: none;
          display: inline-block;
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          line-height: 1.5;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          &:focus{
            border-color: #0099e5;
            border-right-width: 1px !important;
            outline: 0;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
          }
        }
      }
      .select-cmp{
        .select_wrap{
          height: 40px;
          position: relative;
          select{
            width: 100%;
            height: 100%;
            font-size: 14px;
            color: #525558;
            border: 1px solid rgba(185,193,199,.5);
            background-color: #fff;
            padding: 6px 30px 6px 10px;
            resize: none;
            &:focus{
              border-color: #0099e5;
            }
            &:focus+.arrows{
              border-color: #0099e5;
            }
          }
          .arrows{
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 30px;
            border: 1px solid rgba(185,193,199,.5);
            border-left: none;
            background-image: url('../../static/img/select.png');
            background-repeat: no-repeat;
            background-size: 7px 12px;
            background-position: 50%;
            background-color: #fff;
          }
        }
      }
    }
    .label{
      font-size: 16px;
      font-weight: 600;
      color: #222;
      line-height: 1.25;
      margin-bottom: 8px;
    }
  }
}

</style>
