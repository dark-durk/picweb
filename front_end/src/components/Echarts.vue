// echarts图表
<template>
  <div :id="id" :options="options" style="width:1000px;height: 400px;margin:0 auto"/>
</template>

<script>
import echarts from 'echarts'
import 'echarts/theme/macarons.js'
export default {
  props: {
    options: { type: Object, default: () => ({}) },
    id: { type: String, default: '' }
  },
  data() {
    return {
      chart: null // 图表对象
    }
  },
  watch: {
    options: { // 监听子组件接受到的数据
      handler(newValue, oldValue) {
        this.drawLine(this.id, newValue)
      },
      deep: true
    }
  },
  mounted() {
    this.drawLine(this.id, this.options)
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.clear() // 清空画布
    }
  },
  methods: {
    drawLine(id, option) {
      let _this = this
      let myChart = document.getElementById(id)
      _this.chart = echarts.init(myChart, 'macarons')
      _this.chart.setOption(option)
    }
  }
}
</script>

<style>

</style>
