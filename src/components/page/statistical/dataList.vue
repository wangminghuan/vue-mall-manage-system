<!--
  结算统计
-->
<template>
  <div class="dataList-wrap">
    <section class="com-content-head">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb-nav">
        <el-breadcrumb-item :to="{ path: '/statistical_data_list' }">数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>结算统计</el-breadcrumb-item>
      </el-breadcrumb>
      <h6>结算统计</h6>
    </section>
    <section class="com-content-body">
      <el-form :inline="true" :model="search" class="form-top">
        <el-form-item label="操作时间">
          <el-date-picker v-model="search.receiptTime_start" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始时间">
          </el-date-picker>
          <el-date-picker v-model="search.receiptTime_end" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="elButtonSearch" @click="gotoSearch">搜索</el-button>
          <el-button type="primary" plain class="elButtonSearch" @click="gotoExport(search)">导出</el-button>
        </el-form-item>
      </el-form>
      <!-- <schart class="canvas-wrapper" :canvasId="chartConfig.canvasId" :type="chartConfig.type" :data="chartConfig.data" :options="chartConfig.options"></schart> -->
      <!-- table开始 -->
      <table class="table-tbody" border=0>
        <tr style="border:1px solid #b3d8ff">
          <td class="set-right">总订单量</td>
          <td class="set-right">销售总额</td>
          <td class="set-right">支付总额</td>
          <td class="set-right">优惠券抵用总额</td>
          <td>购物卡抵扣总额</td>
        </tr>
        <tr v-if="statistics.count_oid==0?false:true" class="set-right" style="border-left:1px solid #b3d8ff;">
          <td class="set-right-bottom">{{statistics.count_oid}}</td>
          <td class="fire-border firebox set-right-bottom" @click.stop="isShowDialog">{{statistics.sum_saleAmout}}</td>
          <td class="set-right-bottom">{{statistics.sum_payAmount}}</td>
          <td class="set-right-bottom ">{{statistics.sum_couponAmount}}</td>
          <td style="border-bottom:1px solid #b3d8ff;">{{statistics.sum_cardAmount}}</td>
        </tr>
        <tr v-else class="tr-empty" style="">
          暂无数据
        </tr>
      </table>
    </section>

    <!-- 列表 -->
    <el-dialog
      :visible.sync="isShowTable"
      width="60%"
      >
      <section class="sub-header" style="margin-bottom:10px;">
        <!-- <div class="hd">
          <el-button type="primary" class=" elButtonSearch" >查询</el-button>
        </div> -->
      </section>

      <!-- 表格开始 -->
      <el-table
        :data="list.data"
        height="550" border style="width: 100%;text-align: center"
        >
          <el-table-column label="订单编号">
            <template slot-scope="scope">{{scope.row.o_sn}}</template>
          </el-table-column>
          <el-table-column  label="订单金额">
            <template slot-scope="scope">{{scope.row.saleAmout}}</template>
          </el-table-column>
          <el-table-column label="支付金额">
            <template slot-scope="scope">{{scope.row.o_payAmount}}</template>
          </el-table-column>
          <el-table-column label="优惠券抵用金额">
            <template slot-scope="scope">{{scope.row.o_couponAmount}}</template>
          </el-table-column>
          <el-table-column label="购物卡抵扣金额">
            <template slot-scope="scope">{{scope.row.o_cardAmount}}</template>
          </el-table-column>
          <el-table-column  label="交易完成时间">
            <template slot-scope="scope">{{scope.row.o_receiptTime	}}</template>
          </el-table-column>
      </el-table>
        <!-- 分页 -->
      <div class="pag">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="parseInt(total)">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer" >
        <el-button @click="isShowTable = false">取 消</el-button>
        <el-button type="primary" @click="isShowTable = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import Schart from "vue-schart";
export default {
  // components:{
  //   Schart
  // },
  data() {
    return {
      search: {'is_list':0,'receiptTime_start':'','receiptTime_end':''},
      statistics:{},
      isShowTable:false,
      list:{},
      total:"",
      currentPage:1,
      chartConfig: {
        canvasId: 'data-list-canvas',
        type: 'pie',
        width: 500,
        height: 400,
        data: [
          { name: '2014', value: 1342 },
          { name: '2015', value: 2123 },
          { name: '2016', value: 1654 },
          { name: '2017', value: 1795 }
        ],
        options: {
          padding: 50, // canvas 内边距
          bgColor: '#FFFFFF', // 默认背景颜色
          title: 'vue-schart互动演示案例', // 图表标题
          titleColor: '#000000', // 图表标题颜色
          titlePosition: 'top', // 图表标题位置: top / bottom
          legendColor: '#000000', // 图例文本颜色
          legendTop: 40, // 图例距离顶部的长度
          colorList: ['#1E9FFF', '#13CE66', '#F7BA2A', '#FF4949', '#72f6ff'], // 环形图颜色列表
          radius: 100, // 环形图外圆半径
          innerRadius: 70 // 环形图内圆半径
        }
      }
    }
  },
  methods: {
    //点击显示弹框
    isShowDialog(){
      this.isShowTable = true;
      this.gotoSearch();
    },
    //导出
    gotoExport(obj){
      this.search.is_list = 1;
      this.$axios.post("/merchant/Statistics/statistics",{
            export_files:"export", //下载文件必传
            is_export:1,
            ...this.search
        })
    },
    //分页展示条数事件
    handleSizeChange: function(obj) {
      this.search.pagesize = obj;
      this.search.page = "1";
      this.requireStatisData(this.search);
    },
    //分页点击事件
    handleCurrentChange: function(obj) {
      this.currentPage = parseInt(obj);
      this.search.page = this.currentPage;
      this.requireStatisData(this.search);
    },
    //点击搜索
    gotoSearch(){
      this.search.is_list = 1;
      this.requireStatisData(this.search);
    },
    //获取数据统计数据
    requireStatisData(obj){
      this.$axios
      .post('/merchant/Statistics/statistics',{...obj})
      .then(res=>{
        const _data = res.data;
        if(_data.code==0){
          this.statistics = _data.data.statistics; //获取statistics数据
          if(_data.data.list){
            this.list = _data.data.list||[]; //获取list表格
            this.total = _data.data.list.total||''; //获取列表总数
          }
        }
      })
    }
  },
  
  created() {
    this.search.pagesize = '10';
    this.search.page = '1';
    this.requireStatisData(this.search);
  },
}
</script>

<style  lang="scss">
.dataList-wrap {
  .hd-tips {
    color: #409eff;
    position: relative;
    margin-left: 40px;
    font-size: 14px;
  }
  .canvas-wrapper {
    margin-top: 40px;
  }
  #data-list-canvas {
    margin: 0 auto;
    display: block;
  }
  .table-tbody {
    width: 100%;
    border-collapse: collapse;
    color: #353535;
    // border: 1px solid #b3d8ff;
    tr {
      display: flex;
      &:nth-child(1) {
        background: #ecf5ff;
        width: 100%;
        td {
          height: 48px;
          line-height: 48px;
        }
      }
      &:nth-child(1):hover {
        background: #ecf5ff;
      }
      &:hover {
        background: #eee;
      }
      .fire-border {
        color: #409eff;
      }
      .firebox{
        cursor: pointer;
      }
      td {
        flex:1;
        text-align: center;
        // border: 1px solid #b3d8ff;
        // border-bottom: 1px solid #b3d8ff;
        height: 60px;
        line-height: 60px;
      }
    }
    .set-right{
      border-right:1px solid #b3d8ff;
    }
    .set-right-bottom{
      border-bottom:1px solid #b3d8ff;
      border-right:1px solid #b3d8ff
    }
    .tr-empty{
      width:100%;
      line-height:48px;
      text-align:center;
      display:inline-block;
      border-left:1px solid #b3d8ff;
      border-right:1px solid #b3d8ff;
      border-bottom:1px solid #b3d8ff;
    }
  }
  .sub-header{
    .title {
      width: 100%;
      padding-bottom: 20px;
      border-bottom: 1px solid #ccc;
    }
  }
  .el-table th {
  background: #eff0ff;
}
.el-table__body-wrapper {
  width: 101%;
}
.el-table .cell {
  text-align: center;
  padding: 0 10px;
}
  .pag{
    padding-top:20px;
    text-align: center;
  }
}
</style>


