<template>
  <div>
    <el-input
      v-model="keywords"
      placeholder="请输入搜索内容">
      <i slot="suffix" class="el-input__icon el-icon-search" style="cursor:pointer" @click="search"/>
    </el-input>
    <el-table
      :data="tableData"
      :header-cell-style="thStyleFun"
      :cell-style="cellStyleFun"
    >
      <el-table-column prop="id" sortable label="编号" width="80" >
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="头像" width="">
        <template slot-scope="scope">
          <img :src="`http://localhost:8888${scope.row.head_img}`" alt="加载出错" style="width: 40px;height: 40px;border-radius:50%;cursor: pointer;" @click="openPersonPage(scope)">
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名"/>
      <el-table-column prop="sex" label="性别"/>
      <el-table-column prop="birthday" label="出生日期"/>
      <el-table-column prop="phone_num" label="联系电话"/>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button size="mini" type="info" @click="handleReset(scope.$index, scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      resData: [], // 服务器返回数据
      tableData: [], // 展示的数据
      keywords: '' // 搜索内容
    }
  },
  mounted() {
    this.getUsers()
  },
  methods: {
    // 表头样式
    thStyleFun() {
      return 'text-align:center'
    },
    // 单元格样式
    cellStyleFun() {
      return { 'text-align': 'center' }
    },
    // 获取所有用户信息
    getUsers() {
      this.$http.post('/api/getUsers').then(res => {
        this.resData = res.data.filter(item => {
          return item.username !== 'admin'
        })
        this.tableData = this.resData
      })
    },
    // 删除一个用户
    handleDelete(index, row) {
      this.$confirm('是否删除该用户?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$http.post('/api/deleteUser', this.$qs.stringify({ id: row.id })).then(res => {
          if (res.data.code === 1) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.tableData.splice(index, 1)
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 重置个人密码为123456
    handleReset(index, row) {
      this.$confirm('是否重置用户密码?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$http.post('/api/community/personinfo', this.$qs.stringify({ id: row.id, password: '123456' })).then(res => {
          if (res.data.code === 1) {
            this.$message({
              type: 'success',
              message: '重置成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: '重置失败!'
            })
          }
        })
      })
    },
    // 打开个人主页
    openPersonPage(scope) {
      let routeUrl = this.$router.resolve({ path: '/personpage', query: { uid: scope.row.id, tabs: 'published_works' }})
      window.open(routeUrl.href, '_blank')
    },
    search() {
      let keywords = this.keywords// 搜索关键字
      if (keywords) {
        this.tableData = this.resData.filter(data => {
          return Object.keys(data).some(key => {
            return String(data[key]).indexOf(keywords) > -1
          })
        })
      } else { // 关键字为空展示所有数据
        this.tableData = this.resData
      }
    }
  }
}
</script>

<style scoped>
.el-input{
  width:300px;
  margin-bottom:20px ;
}
</style>
