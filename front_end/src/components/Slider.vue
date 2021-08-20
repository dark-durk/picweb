// 轮播图组件
<template>
  <div class="icontent">
    <div @mouseenter="on_top_enter" @mouseleave="on_top_leave">
      <!-- 加上v-if="banner_data.length > 1" 来防止swiper出现无法循环播放的效果 -->
      <swiper v-if="banner_data.length > 1" ref="mySwiper" :options="swiperOption" class="my-swiper">
        <!-- slides -->
        <swiper-slide v-for="(img,index) in banner_data" :key="index">
          <a :href="'/#/community/photo-details?pId='+img.id" class="photo-link" @click.prevent="getDetails(img.id)">
            <img :src="`http://localhost:8888${img.url}`" :data-id="img.id" :data-src="img.url" class="photo">
          </a>
        </swiper-slide>
        <!-- 分页控制器 -->
        <div slot="pagination" class="swiper-pagination"/>
        <!-- 上一页 -->
        <!-- <div slot="button-prev" class="swiper-button-prev"/> -->
        <!-- 下一页 -->
        <!-- <div slot="button-next" class="swiper-button-next"/> -->
      </swiper>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
// 导入相关的包
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
// 使用模块
Vue.use(VueAwesomeSwiper)
export default {
  name: 'Slider',
  props: { banner_data: { type: Array, default: () => [] }},
  data () {
    return {
      // 配置轮播图的相关参数 使用时绑定到标签里的 options 属性
      swiperOption: {
        // 设置分页器
        pagination: {
          el: '.swiper-pagination',
          clickable: true // 设置点击可切换
        },
        // 设置前进后退按钮
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        // 设置自动轮播
        autoplay: {
          delay: 2000,
          disableOnInteraction: false
        },
        // 设置轮播可循环
        loop: true
      }
    }
  },
  // 计算属性，获得可以操作的swiper对象
  computed: {
    // 获取当前的swiper对象
    mySwiper() {
      // mySwiper 是要绑定到标签中的ref属性
      return this.$refs.mySwiper.swiper
    }
  },

  methods: {
    // 通过获得的swiper对象来暂停自动播放
    on_top_enter() {
      this.mySwiper.autoplay.stop()
    },
    on_top_leave() {
      this.mySwiper.autoplay.start()
    },
    // 点击图片后进入详情页
    getDetails(pId) {
      this.$router.push({
        path: '/community/photo-details',
        query: {
          pId: pId
        }
      })
    }
  }
}
</script>

<style >
.icontent{
    overflow: hidden;
    width: 100%;
}
.my-swiper{
    height: 500px;
}
.my-swiper:hover{
    cursor: pointer;
}
.my-swiper img{
    height: 100%;
    width: 100%;
}
.swiper-pagination-bullet{
  width: 16px;
  height: 16px;
  background: #fff;
  opacity: 0.7;
}
.swiper-pagination-bullet-active{
  background: #000;
  opacity: 1;
}
</style>
