<!--
  我的订单
-->
<template>
    <div class="order-my-list-wrap">
        <section class="com-content-head">
            <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb-nav">
                <el-breadcrumb-item :to="{ path: '/order_my_list' }">订单管理</el-breadcrumb-item>
                <el-breadcrumb-item>我的订单</el-breadcrumb-item>
            </el-breadcrumb>
            <h6>我的订单</h6>
        </section>
        <div class="sub-header com-content-body">
            <el-form :inline="true" :model="search" class="form-top">
                <el-form-item label="">
                    <el-select v-model="search.order_info_state" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="search.order_info" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="下单时间">
                    <el-date-picker v-model="search.o_createTime_start" value-format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择开始时间">
                    </el-date-picker>
                    <el-date-picker v-model="search.o_createTime_end" value-format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="search.order_user_state" placeholder="请选择">
                        <el-option v-for="item in typeState" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="search.order_user" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="订单状态">
                    <el-select v-model="search.order_status" placeholder="请选择">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchBtnEvent(search)">搜索</el-button>
                </el-form-item>
            </el-form>

            <!-- babel开始  -->
            <el-table :span-method="objectSpanMethod" :data="list.data" height="550" border style="width: 100%;text-align: center;">
                <el-table-column width="150" label="订单编号">
                    <template slot-scope="scope">{{scope.row.o_sn}}</template>
                </el-table-column>
                <el-table-column label="收货人" class="ellipsis" width="90">
                    <template slot-scope="scope">
                        <span class="centerEllipsis">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="f_phone" label="商品信息" width="300">
                    <template slot-scope="scope">
                        <div >
                          {{scope.row.g_name}}
                          <div v-for="(num,indexs) in scope.row.sku_spec" :key="indexs">{{num.spec}}+{{num.spec_value}}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="f_deviceInfo" label="单价(元)">
                    <template slot-scope="scope">
                      {{Number(scope.row.ct_price).toFixed(2)}}
                    </template>
                </el-table-column>
                <el-table-column prop="f_deviceInfo" label="数量">
                    <template slot-scope="scope">
                      {{scope.row.ct_num}}
                    </template>
                </el-table-column>
                <el-table-column label="实付款(元)" width="100">
                    <template slot-scope="scope">{{Number(scope.row.o_payAmount).toFixed(2)}}</template>
                </el-table-column>
                <el-table-column label="优惠" width="120">
                    <template slot-scope="scope">
                      
                      <span v-if="scope.row.o_couponAmount!=0">优惠券 -{{Number(scope.row.o_couponAmount).toFixed(2)}}</span>
                      <hr v-if="scope.row.o_couponAmount!=0&&scope.row.o_cardAmount!=0" style="margin: 10px 0;background:#ddd ;height:1px;border:none;" />
                      <span v-if="scope.row.o_cardAmount!=0">购物卡 -{{Number(scope.row.o_cardAmount).toFixed(2)}}</span>
                      <span v-if="scope.row.o_couponAmount==0&&scope.row.o_cardAmount==0">无</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100">
                    <template slot-scope="scope">{{scope.row.o_status_name}}</template>
                </el-table-column>
                <el-table-column label="操作" width="230">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        <el-button v-if="scope.row.o_status=='1'" @click="gotoDeliveryPage(scope.row)" type="text" size="small">发货</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="block pag">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10"
                    layout="total, prev, pager, next, jumper" :total="parseInt(total)">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  //数据
  data() {
    return {
      time1: "",
      time2: "",
      search: { order_info_state: "0", order_user_state: "0", order_status: "-1" }, //搜索功能保存数据
      list: [], //存数据
      total: "",
      msg: "订单列表", //标题
      currentPage: 1,
      sg: [],
      options: [
        {
          value: "0",
          label: "订单编号"
        },
        {
          value: "1",
          label: "物流编号"
        }
      ],
      typeState: [
        //系统类别
        {
          value: "0",
          label: "收货人"
        },
        {
          value:'1',
          label:'用户账号'
        }
      ],
      typeOptions: [
        {
          value:"-1",
          label:"全部"
        },
        {
          value: "0",
          label: "待付款"
        },
        {
          value: "1",
          label: "待发货"
        },
        {
          value: "2",
          label: "待收货"
        },
        {
          value: "3",
          label: "已完成"
        },
        {
          value: "4",
          label: "已取消"
        }
      ]
    };
  },
  //执行事件
  methods: {
     objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        //合并条件
         if (columnIndex === 0||columnIndex === 1||columnIndex === 5||columnIndex === 6||columnIndex === 7||columnIndex === 8) {   //哪一列
            if (row.ddd==undefined&& row.lengthNum>1&&row.lengthNum!=undefined) {
              return [row.lengthNum,1]
            }else if(row.ddd!=undefined){
              return [0,0]
            }
             else {
              return [1,1]
            }
        }
      },
    //点击发货
    gotoDeliveryPage(item){
      this.$router.push({path:"/order_my_delivery",query:{id:item.o_id}})
    },
    //点击查看
    handleClick(item) {
      this.$router.push({
        path: "/order_my_detail",
        query: { id: item.o_id }
      });
    },
    //获取后台数据列表
    enquiriesFunction: function(obj) {
      this.$axios
        .post("/merchant/Order/getList", obj)
        .then(res => {
          const _data=res.data;
          if ( _data.code == 0) {
            this.list = _data.data;
            this.total = _data.data.total;
            let arrList=[];
            let indexNum=0;
            this.list.data.map((item,index)=>{
              let lengthNum=item.order_goods.length;
              item.order_goods.map((ite,indx)=>{
                let obj=this.copyObj(item);
                obj.ct_num=ite.ct_num;
                obj.ct_price=ite.ct_price;
                obj.g_name=ite.g_name;
                obj.sku_spec=ite.sku_spec;
                if(indx==0&&lengthNum>1){
                  obj.lengthNum=lengthNum;
                  obj.indexNum=indexNum;
                }
                if(indx!=0&&lengthNum>1){
                  obj.ddd=lengthNum;
                }
                arrList.push(obj)
                indexNum++
              })
            })
            this.list.data=arrList;
            console.log(this.list.data)
          } else {
            this.list = "";
          }
        })
    },
    // 对象重定义
    copyObj(obj){
      if(typeof obj != 'object'){
          return obj;
      }
      let newobj = {};
      for ( let attr in obj) {
          newobj[attr] = this.copyObj(obj[attr]);
      }
      return newobj;
    },
    //搜索点击事件
    searchBtnEvent: function(obj) {
      obj.page = 1;
      this.enquiriesFunction(obj);
    },

    //分页点击事件
    handleCurrentChange: function(obj) {
      this.currentPage = parseInt(obj);
      this.search.page = this.currentPage;
      this.enquiriesFunction(this.search);
    },

    //分页展示条数事件
    handleSizeChange: function(obj) {
      this.search.pagenum = obj;
      this.search.page = "1";
      this.enquiriesFunction(this.search);
    },
    //导出数据
    handleOutputFiles(obj) {
      this.$axios.post("/api/shop/order/getAdminOrderList", {
        export_files: "export", //下载文件必传
        is_export: 1,
        ...obj
      });
    }
  },
  //声明周期
  created: function() {
    this.search.pagenum = "10";
    this.search.page = "1";
    this.enquiriesFunction(this.search);
  }
};
</script>

<style lang="scss">
.order-my-list-wrap {
  .el-message-box {
    width: 650px;
  }
  .el-table__header thead th {
    background-color: #ecf5ff;
  }
  .el-table .cell {
    text-align: center;
  }
}
</style>
