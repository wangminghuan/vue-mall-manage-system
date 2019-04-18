<!--
  我的商品
-->
<template>
    <div class="goods-list-wrap">
       <section class="com-content-head">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb-nav">
        <el-breadcrumb-item :to="{ path: '/goods_my_list' }">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>我的商品</el-breadcrumb-item>
        </el-breadcrumb> 
        <h6>我的商品</h6>
    </section>
        <div class="sub-header com-content-body"> 
             <el-form :inline="true" :model="search" class="form-top">
                <el-form-item label="">
                  <el-select v-model="search.param1"  placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="search.param1_data" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker v-model="search.start_time" value-format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择开始时间">
                    </el-date-picker>
                    <el-date-picker v-model="search.end_time" value-format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="商品状态" placeholder="请选择">
                    <el-select v-model="search.goods_status">
                      <el-option
                          v-for="item in optionsprev"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"  @click="searchBtnEvent">搜索</el-button>
                    <el-button type="primary" plain  @click="gotoEditorPage">添加商品</el-button>
                </el-form-item>
            </el-form>
          <!-- babel开始  -->
          <el-table :data="list" height="550" border style="width: 100%;text-align: center">
              <el-table-column width="130" label="编号">
                <template slot-scope="scope">{{(scope.$index+(currentPage-1)*10)+1}}</template>
              </el-table-column>
              <el-table-column width="100" label="商品编号">
                <template slot-scope="scope">{{scope.row.g_id}}</template>
              </el-table-column>
              <el-table-column label="商品信息" class="ellipsis">
                <template slot-scope="scope">
                  <span class="centerEllipsis">{{scope.row.g_name}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="f_phone" label="单价(元)">
                <template slot-scope="scope">{{Number(scope.row.g_price).toFixed(2)}}</template>
              </el-table-column>
              <el-table-column prop="f_deviceInfo" label="销量">
                <template slot-scope="scope">{{scope.row.g_real_salenum}}</template>
              </el-table-column>
              <el-table-column prop="f_deviceInfo" label="库存">
                <template slot-scope="scope">
                  <span class="devoceInfo">{{scope.row.total_stock_num}}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope"><span :class="scope.row.g_review_status==2?'del':scope.row.g_review_status==1?'blue':''">{{scope.row.goods_status}}</span></template>
              </el-table-column>
              <el-table-column label="创建时间">
                <template slot-scope="scope">{{(scope.row.create_time)}}</template>
              </el-table-column>
              <el-table-column
                  label="操作"
                  width="250">
                  <template slot-scope="scope">
                      <div v-if="scope.row.g_review_status==0" style="text-align:center">-</div>
                      <div v-else>
                      <el-button class="edit" type="text" size="small" @click="gotoEditorPage(scope.row)">编辑</el-button>
                      <el-button v-if="scope.row.g_review_status==1" class="opera" type="text" size="small" @click="gotoStandDown(scope.row)">{{scope.row.g_is_shelves=='1'?'下架':'上架'}}</el-button>
                      <el-button class="del" type="text" size="small" @click="deleteList(scope.row,scope.$index)">删除</el-button>
                      <el-tooltip v-if="scope.row.g_review_status==2" class="item" effect="dark" :content="scope.row.g_review_reject" placement="bottom-end">
                          <span class="failure-reason">查看失败原因</span>
                      </el-tooltip>
                      </div>
                  </template>
              </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="block pag">
              <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="currentPage"
                  :page-size="10"
                  layout="total, prev, pager, next, jumper"
                  :total="parseInt(total)">
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
      time1:'',
      time2:'',
      search: { param1: "1" ,goods_status:'0',pagesize: "10",page:"1"}, //搜索功能保存数据
      list: [], //存数据
      total: "", //总数量
      currentPage: 1,  //分页 默认是第一页
      index: "", // 每条数值
      states: "", // 每条状态
      options: [
        {
          value: "1",
          label: "商品名称"
        },
        {
          value:'2',
          label:'商品编号'
        }
      ],
      optionsprev: [
        //系统类别
        {
          value: "0",
          label: "全部"
        },{
          value: "1",
          label: "已上架"
        },{
          value: "2",
          label: "待审核"
        },{
          value: "3",
          label: "审核失败"
        },{
          value: "4",
          label: "已下架 "
        }
      ],
    };
  },

  methods: {
    //跳转编辑页面
    gotoEditorPage(item){
      item?
      this.$router.push({path: '/goods_add',query: { id: item.g_id }}):
      this.$router.push('/goods_add')
    },
    //删除
    deleteList(item,$index){
      this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios
          .post("/merchant/Goods/del", {'g_id':item.g_id})
          .then(res => {
            const _data=res.data;
            if(_data.code==0){
               this.list.splice($index,1);
            }else{
               this.$message.error(_data.message)
            }
              
          })
      })
     
    },
    //上下架
    gotoStandDown(item){
      this.$confirm('确定'+(item.g_is_shelves=='1'?'下架':'上架')+'该商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios
          .post("/merchant/Goods/setShelves", {'g_id':item.g_id})
          .then(res => {
            const _data=res.data;
            if(_data.code==0){
              this.$message({
                  message: '恭喜你，操作成功！',
                  type: 'success'
                });
                if(item.g_is_shelves=='1'){
                    item.g_is_shelves='0'
                    item.goods_status="已下架"
                }else{
                    item.g_is_shelves='1'
                    item.goods_status="已上架"
                }
            }else{
              this.$message.error(_data.message)
            }

              
          })
        })
      
        
    },
    //处理时间
    splitRenderTime(timestr){
      let timeArr = timestr.split(" ");
      return timeArr[0];
    },
    //获取后台数据列表
    enquiriesFunction(obj) {
      this.$axios
        .post("/merchant/Goods/getList", obj)
        .then(res => {
          const _data=res.data;
          if (_data.code == 0) {
            const _obj=_data.data||{};
            this.list = _obj.data && _obj.data instanceof Array?_obj.data:[];
            this.total = _obj.total;
          }
        })
    },
    //搜索点击事件
    searchBtnEvent() {
      this.search.page = 1;
      this.enquiriesFunction(this.search);
    },

    //分页点击事件
    handleCurrentChange(obj) {
      this.currentPage = parseInt(obj);
      this.search.page = this.currentPage;
      this.enquiriesFunction(this.search);
    },

    //分页展示条数事件
    handleSizeChange(obj) {
      this.search.pagenum = obj;
      this.search.page = "1";
      this.enquiriesFunction(this.search);
    }
  },
  created() {
    this.enquiriesFunction(this.search);
  }
};
</script>

<style lang="scss">
.goods-list-wrap{
.el-message-box {
  width: 650px;
}
.failure-reason{
  text-decoration: underline;
  color: #959595;
  font-size: 12px;
  margin-left: 10px;
  cursor: default;
}
.el-table__header thead th {
    background-color: #ecf5ff;
  }
  .el-table__body-wrapper{
    .del{
     color: #fa5555
    }
    .blue{
      color: #409EFF;
    }
  }
}
</style>

