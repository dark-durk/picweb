<template>
  <div :style="window" class="window">
    <div class="bg"/>
    <div class="container">
      <div class="header">f</div>
      <div class="modal-body">f</div>
      <div class="buttons">f</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BgPic',
  data() {
    return {
      window: {
        'height': '631px'
      }
    }
  },
  mounted() {
    this.changeSize()
  },
  methods: {
    changeSize() {
      const _this = this
      window.addEventListener('resize', function() {
        let height = document.documentElement.clientHeight
        _this.window.height = height + 'px'
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.window{
  width: 100%;
  height:100%;
  position: relative;
}
.bg{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 999999px;
  background-color: #fff;
  opacity: .95;
}
.container{
  width: 792px;
  height: 528px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: 99;
}
</style>
