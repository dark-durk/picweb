// 用户点赞/收到赞，关注/粉丝的可视化图表
<template>
  <div>
    <Header>header</Header>
    <div class="action">
      <el-tabs v-model="activeName" table-position="right">
        <el-tab-pane label="用户近7天行为统计" name="first">
          <Echarts :options="option1" :id="linechart1"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Echarts from '@/components/echarts'

export default {
  name: 'PersonAction',
  components: {
    Header,
    Echarts
  },
  data() {
    return {
      activeName: 'first', // 默认打开的tab
      linechart1: 'linechart1',
      linechart2: 'linechart2',
      option1: {
        backgroundColor: '', // 背景颜色透明
        tooltip: { // 设置tip提示
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        legend: { // 图例
          data: ['关注', '粉丝', '评论', '发布图片'],
          x: 'right'
        },
        color: ['#0099e5', '#34bf49', '#ce2382', '#e1e424'], // 设置区分（每条线是什么颜色，和 legend 一一对应）
        xAxis: { // 设置x轴
          show: false,
          type: 'time',
          boundaryGap: false, // 坐标轴两边不留白
          axisLine: { // 坐标轴轴线相关设置。
            lineStyle: {
              color: 'rgba(151,151,151)'
            }
          }
        },
        yAxis: {
          splitLine: { show: false }, // 去除网格线
          axisLine: {
            lineStyle: {
              color: 'rgba(151,151,151)'
            }
          }
        },
        series: [
          {
            name: '关注',
            data: '',
            type: 'line', // 类型为折线图
            lineStyle: { // 线条样式 => 必须使用normal属性
              normal: {
                color: '#0099e5'
              }
            }
          }, {
            name: '粉丝',
            data: '',
            type: 'line', // 类型为折线图
            lineStyle: { // 线条样式 => 必须使用normal属性
              normal: {
                color: '#34bf49'
              }
            }
          },
          {
            name: '评论',
            data: '',
            type: 'line', // 类型为折线图
            lineStyle: { // 线条样式 => 必须使用normal属性
              normal: {
                color: '#ce2382'
              }
            }
          }, {
            name: '发布图片',
            data: '',
            type: 'line', // 类型为折线图
            lineStyle: { // 线条样式 => 必须使用normal属性
              normal: {
                color: '#e1e424'
              }
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.refreshData()
  },
  methods: {
    // 更新数据
    refreshData() {
      this.$http.post('/api/getCount', this.$qs.stringify({ id: this.$route.query.uid })).then(res => {
        let data = this.$qs.parse(res.data.data)
        this.option1.series[0].data = data.concern
        this.option1.series[1].data = data.fans
        this.option1.series[2].data = data.comment
        this.option1.series[3].data = data.pics
      })
    }
  }

}
</script>

<style lang=scss scoped>
.action /deep/{
  margin-top:35px;
  border-radius: 4px;
  background-color: #fff;
  .el-tabs__nav{
    left: 50%;
    transform: translateX(-50%) !important;
  }
}
</style>
