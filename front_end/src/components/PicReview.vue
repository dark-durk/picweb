<template>
  <el-row :gutter="20">
    <el-col v-for="(img,index) in imgList" :key="index" :span="8" class="el-col">
      <el-card :body-style="{ padding: '0px' }" shadow="hover" class="box-card">
        <div slot="header" class="">
          <span class="title">{{ img.tit }}</span>
          <span class="type">{{ img.type }}</span>
        </div>
        <el-image :src="`http://localhost:8888${img.url}`" fit="fill" class="image" lazy/>
        <el-popover
          :content="img.des"
          placement="bottom"
          width="350"
          trigger="hover">
          <el-button slot="reference" class="des">{{ img.des }}</el-button>
        </el-popover>
        <div class="options">
          <el-button type="text" class="option fail" @click="editForm(img,index)">不通过</el-button>
          <el-button type="text" class="option" @click="picPass(img,index)">发布</el-button>
        </div>
        <el-dialog :visible.sync="dialogFormVisible">
          <el-form ref="form" :model="form" :rules="rules" label-width="125px" label-position="top">
            <el-form-item label="审核未通过理由:" prop="desc">
              <el-checkbox-group v-model="form.desc" >
                <el-checkbox label="图片内容违规（图片模糊；图片出现推广信息）" />
                <el-checkbox label="标题违规"/>
                <el-checkbox label="图片描述违规"/>
              </el-checkbox-group>
            </el-form-item>
            <input :data-img="form.img" :data-index="form.index" type="hidden">
            <el-form-item>
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="picOut()">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default{
  data() {
    return {
      imgList: [],
      dialogFormVisible: false,
      form: { desc: [], img: '', index: '' },
      rules: {
        desc: [{ type: 'array', required: true, message: '请至少选择一个理由', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getUnpassPic()
  },
  methods: {
    // 获取待审核的所有图片
    getUnpassPic() {
      this.$http.post('/api/getUnpassPic').then(res => {
        this.imgList = res.data
      })
    },
    // 图片审核通过
    picPass(img, index) {
      this.$http.post('/api/editPicPass', this.$qs.stringify({ id: img.id, pass: 1 })).then(res => {
        if (res.data.code === 1) {
          this.imgList.splice(index, 1)
          this.$message({
            message: '图片发布成功',
            type: 'success',
            duration: 1000
          })
        } else {
          this.$message({
            message: '图片发布失败',
            type: 'error',
            duration: 1000
          })
        }
      })
    },
    // 点击不通过时弹出dialog同时修改form中的img值
    editForm(img, index) {
      this.dialogFormVisible = true
      this.form.img = img
      this.form.index = index
    },
    // 图片审核不通过
    picOut() {
      this.$refs['form'][0].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          let reason = this.form.desc
          this.$http.post('/api/editPicPass', this.$qs.stringify({ id: this.form.img.id, pass: 2, reason: reason })).then(res => {
            if (res.data.code === 0) {
              this.imgList.splice(this.form.index, 1)
              this.$message({
                message: '操作失败',
                type: 'error',
                duration: 1000
              })
            } else {
              this.imgList.splice(this.form.index, 1)
            }
          })
        } else {
          return false
        }
      })
    }
  }

}
</script>
<style scoped>
  .el-col{
    margin-bottom: 20px;
  }
 .box-card {
    position: relative;
    height: 375px;
  }
  .title{
    font-size: 16px;
  }
  .type{
    position: absolute;
    top: 35px;
    right: 15px;
    font-size: 14px;
    color: #b8c1c8;
  }
  .image{
    width: 100%;
    height: 250px;
    display: block;
  }
  .des{
    width: 100%;
    height: 30px;
    border: 0;
    line-height: 14px;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .option{
    padding:0 5px;
    margin: 0;
  }
  .fail{
    color: red;
  }
</style>
