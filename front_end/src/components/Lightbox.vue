<template>
  <div v-show="visible" class="bg">
    <div class="lightbox-container">
      <div class="lightbox">
        <div class="head">
          <h3>{{ headTit }}</h3>
          <div class="close-button" @click="hiddenLightbox">×</div>
        </div>
        <div class="container">
          <ul class="actors">
            <li v-for="(user,index) in users" :key="index" class="actor">
              <div class="left">
                <router-link :to="{path:'/personpage',query:{uid:user.id}}" class="avatar" @click.native="hiddenLightbox">
                  <img :src="`http://localhost:8888${user.head_img}`">
                </router-link>
                <div class="actor-info">
                  <router-link :to="{path:'/personpage',query:{uid:user.id}}" class="name" @click.native="hiddenLightbox">{{ user.username }}
                  </router-link>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Lightbox',
  props: {
    users: { type: Array, default() { return {} } },
    headTit: { type: String, default() { return {} } },
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
    }
  },
  methods: {
    // 隐藏整个弹窗
    hiddenLightbox() {
      this.$emit('hiddenLightbox') // 因为vue的单向数据流，所以需要调用父组件中的方法修改visible的值
    }
  }
}
</script>
<style scoped>
.bg{
  z-index: 2001;
  overflow: scroll;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background:rgba(255, 255, 255, 0.95) ;
}
.lightbox-container{
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.lightbox{
  position: absolute;
  width: 310px;
  height: 400px;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  border-radius: 3px;
  box-shadow: 0 2px 25px rgb(0 0 0 / 20%);
}
.head{
  border-radius: 1px 1px 0 0;
  background-color: #fff;
  height: 45px;
  padding: 0 10px;
  line-height: 44px;
  position: relative;
  border-bottom: 1px solid rgba(34,34,34,.1);
}
.head h3{
  display: block;
  float: left;
  color: #71767a;
  margin: 0;
  font-size: 12px;
}

.close-button{
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  right: 10px;
  width: 20px;
  height: 20px;
  color: #71767a;
  line-height: 16px;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  transition: all .2s;
}
.container{
  height: 350px;
  overflow-y: auto;
  background-color: #f7f8fa;
}
.actors{
  position: relative;
  padding: 0 10px;
  width: 100%;
  height: 60px;
}
.actor{
  position: relative;
  font-size: 14px;
  font-weight: 400;
  color: #71767a;
  border-top: 1px solid #eeeff2;
  height: 60px;
  transition: background-color .1s;
}
.left{
  float: left;
  width: 100%;
  max-width: calc(100% - 80px);
}
.avatar{
  margin:10px 10px 0 0
}
.actor-info{
  max-width: calc(100% - 55px);
  margin-top: 15px;
  float: left;
}
.avatar{
  float: left;
}
.avatar img{
  width: 100%;
  height: 100%;
  border-radius:50% ;
}
.name{
  font-size: 14px;
  font-weight: 700;
  color: #525558;
  transition: all .2s;
  cursor: pointer;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.right{
  position: absolute;
  right: 10px;
  top: 5px;
}
.button{
  width: 70px;
  height: 25px;
  display: block;
  border-radius: 3px;
  line-height: 25px;
  margin-top: 10px;
  font-size: 14px;
}
.following{
  border-color: #2fab41;
  background-color: #34bf49;
  color: #fff;
}

.follow{
  color: #0099e5;
  font-weight: 400;
  border-color: #0099e5;
  background-color: rgba(0,153,229,.1);
}
.avatar:hover{
  opacity: 0.5;
}
.name:hover{
color: #0099e5;
}
</style>
