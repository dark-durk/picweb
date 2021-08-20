<template>
  <div>
    <Header>header</Header>
    <div class="tab-wrap">
      <div class="tabs">
        <div class="discover-tab">
          <a href="/#/community/discover?t=rating" class="a" @click.prevent="getRating($event)">热门</a>
        </div>
        <div class="discover-tab">
          <a href="/#/community/discover?t=fresh" class="a" @click.prevent="getFresh($event)">新作</a>
        </div>
      </div>
      <div class="select">
        类别：<el-select v-model="selectedOption" placeholder="请选择" @change="changeOption">
          <el-option
            v-for="(option,index) in options"
            :key="index"
            :value="option"/>
        </el-select>
      </div>
    </div>
    <el-avatar :size="60" src="../../static/img/kefu.png" class="kefu" @click.native="goClient()"/>
    <component :selectedoption="selectedOption" :is="currentView"/>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Rating from '@/components/Rating'
import Fresh from '@/components/Fresh'
const uuid = require('uuid')

export default {
  name: 'Discover',
  components: {
    Header,
    Rating,
    Fresh
  },
  data() {
    return {
      currentView: 'Rating', // 默认选中
      options: ['所有', '未分类', '抽象', '动物', '人物', '自然', '黑白', '生活', '美食', '城市', '水下', '街拍'],
      selectedOption: '所有',
      keywords: ''
    }
  },
  watch: {
    $route: {
      handler() {
        this.getBlue()
      },
      deep: true // 深度监听，同时也可监听到param参数变化
    }
  },
  mounted() {
    this.getBlue()
  },
  methods: {
    // 热门
    getRating(event) {
      this.$router.push({
        name: 'Discover',
        query: { t: 'rating' }
      })
      this.currentView = 'Rating'
    },
    getFresh() {
      this.$router.push({
        name: 'Discover',
        query: { t: 'fresh' }
      })
      this.currentView = 'Fresh'
    },
    getBlue() {
      this.t = this.$route.query.t
      let a = document.getElementsByClassName('a')
      // eslint-disable-next-line eqeqeq
      if (this.t === 'rating' || this.t == '') {
        this.changeBlue(a.item(0))
        this.currentView = 'Rating'
      } else if (this.t === 'fresh') {
        this.changeBlue(a[1])
        this.currentView = 'Fresh'
      }
    },
    // 清除底部蓝色线条
    changeBlue(dom) {
      let a = document.getElementsByClassName('a')
      for (let i = 0; i < a.length; i++) {
        a[i].style.borderBottomColor = 'transparent'
      }
      dom.style.borderBottomColor = '#0099e5'
    },
    // 去到客服页面
    goClient() {
      let socketId = uuid.v1()
      let url = this.$router.resolve({ path: '/client', query: { socketId: socketId }})
      window.open(url.href, '_blank')
    },
    // 分类展示图片
    changeOption() {
      // alert(this.selectedOption)
    }
  }
}
</script>

<style lang='scss'>
.tab-wrap{
  width: 100%;
  min-width: 1200px;
  height: 50px;
  background: #fff;
  position: relative;
  border-bottom: 1px solid rgb(238, 239, 242);
  .tabs{
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    .discover-tab{
      margin: 0 20px;
      a{
        font-weight: 700;
        font-size: 14px;
        display: inline-block;
        padding: 15px 0;
        border-bottom: 2px solid transparent;
        color: #71767a;
        cursor: pointer;
        &:hover{
          color: #0099e5;
        }
      }
    }
  }
  .select{
    position: absolute;
    top: 10px;
    right: 50px;
    font-size: 14px;
    .el-input{
      width: 100px;
    }
    .el-input__inner{
      height: 30px;
    }
    .el-input__icon{
      line-height: 30px;
    }
  }
}

</style>
