<template>
  <el-container style="border: 1px solid #eee">
    <el-header style="text-align: right; font-size: 12px">
      <el-dropdown>
        <img :src="`http://localhost:8888${user.head_img}`" alt="" style="width: 40px;height: 40px;border-radius:50%;vertical-align: middle">
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="exit">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span>{{ user.username }}</span>
    </el-header>

    <el-container>
      <el-aside width="150px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-active="this.$route.path" router>
          <el-menu-item index="/manager/user_management" style="border: 1px solid #eee">
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="/manager/pic_review" style="border: 1px solid #eee">
            <span slot="title">图片审核</span>
          </el-menu-item>
          <el-submenu index="/manager/customer_service" @click.native="getClients">
            <template slot="title" >客服</template>
            <el-menu-item v-for="(client,i) in clients" :key="i" :index="`/manager/customer_service?socketId=${client.socketId}`" class="client">用户{{ i +1 }}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view v-if="isRouterAlive"/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isRouterAlive: true,
      user: {
        head_img: '',
        username: '',
        uid: ''
      },
      clients: ''
    }
  },
  // 在最开始data上面通过provide把reload挂载上去
  provide() {
    return {
      reload: this.reload
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    // 通过改变isRouterAlive来改变路由的key
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    // 获取用户名和头像
    getInfo() {
      this.$http.post('/api/community/getUserInfo')
        .then(res => {
          if (res.data.code === 0) { // token失效
            localStorage.removeItem('token')
            return
          }
          this.token = localStorage.getItem('token')
          if (res.data.headImg !== null) {
            this.user.head_img = res.data.headImg
          }
          this.user.username = res.data.username
          this.user.uid = res.data.id
        }).catch(err => {
          console.log(err)
        })
    },
    // 退出登录,删除token
    exit() {
      if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('token')
        this.$router.push({ path: '/' })
        return false
      } else {
        return false
      }
    },
    // 获取当前咨询用户列表
    getClients() {
      this.$http.post('/api/getClients').then(res => {
        if (res.data.code === 0) {
          alert(res.data.msg)
        } else {
          this.clients = res.data.clients
        }
      })
    }
  }
}
</script>
<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
    font-size: 15px;
  }
  .el-aside {
    color: #333;
  }
  .el-main{
    position: relative;
    overflow-y: scroll;
    height: 586px;
  }
  .client{
    min-width: 0;
    font-size: 12px;
    color: #8b8e91;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .client:hover{
    overflow: visible;
    text-overflow: inherit;
  }
</style>
