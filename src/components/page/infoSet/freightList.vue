<!--
  运费模板
-->
<template>
  <div class="info-freight-list-wrap">
       <section class="com-content-head">
           <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb-nav">
            <el-breadcrumb-item :to="{ path: '/infoSet_freight_list' }">信息设置</el-breadcrumb-item>
            <el-breadcrumb-item>运费模板</el-breadcrumb-item>
            </el-breadcrumb> 
            <h6>运费模板</h6>
        </section>
      <div class="com-content-body freightBox">
        <el-button type="primary" plain class="freig-btn" @click="jumpFreightDetail">添加运费模板</el-button>
        <!-- babel开始  -->
        <div class="freight-ul" v-for="(item,index) in list" :key="index">
          <div class="freight-li" >
            <div class="freight-h2">
              <div class="freight-right">模板名称：{{item.name}}</div>
              <div class="freight-change fire-delete" @click="gotodelete(item,index)">删除</div>
               <div class="freight-change" @click="jumpFreightDetail(item)">修改</div>
              <div class="freight-time">最后编辑时间：{{item.update_time}}</div>
            </div>
            <table>
              <tr>
                <td>运送方式</td>
                <td>运送到</td>
                <td v-if="item.rule_type==1">首件（个）</td><td v-else>首重（千克）</td>
                <td>运费（元）</td>
                <td v-if="item.rule_type==1">续件（个）</td><td v-else>续重（千克）</td>
                <td style="border-right:0;">运费（元）</td>
              </tr>
              <tr>
                <td class="fire-border">快递</td>
                <td class="fire-border">中国</td>
                <td class="fire-border">{{item.first_quantity}}</td>
                <td class="fire-border">{{item.first_price}}</td>
                <td class="fire-border">{{item.additional_quantity}}</td>
                <td style="border-right:0;" class="fire-border">{{item.additional_price}}</td>
              </tr>
              <tr v-for="(good,index) in item.exceptional_rules" :key="index">
                <td class="fire-border">快递</td>
                <td class="fire-border"><span v-for="(city,inx) in good.province_names" :key="inx">{{city+" "}}</span></td>
                <td class="fire-border">{{good.first_quantity}}</td>
                <td class="fire-border">{{good.first_price!=''?good.first_price+'.00':'0.00'}}</td>
                <td class="fire-border">{{good.additional_quantity}}</td>
                <td style="border-right:0;" class="fire-border">{{good.additional_price}}</td>
              </tr>
              <tr v-for="good in item.free_delivery_condition" :key="good.index">
                <td class="fire-border">快递</td>
                <td class="fire-border"><span v-for="(city,inx) in good.province_names" :key="inx">{{city+" "}}</span></td>
                <td style="border-right:0;" class="fire-border" colspan="4">{{good.type==1?'满'+(good.quantity_volume)+'件包邮':good.type==2?'满'+(good.amount_volume)+'元包邮':'满'+(good.quantity_volume)+'件,'+(good.amount_volume)+'元包邮'}}</td>
              </tr>
                <!-- <td style="border-right:0;" class="fire-border"></td>
                <td style="border-right:0;" class="fire-border"></td>
                <td style="border-right:0;" class="fire-border"></td> -->
            </table>

          </div>
        </div>
        <!-- 分页 -->
              <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="search.page"
                  :page-size="search.pagesize"
                  layout="total, prev, pager, next, jumper"
                  :total="parseInt(total)">
              </el-pagination>
      </div>
      
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: {
        pagesize: 4,
        page: 1
      }, //搜索功能保存数据
      list: [], //存数据
      total: 0
    };
  },
  //执行事件
  methods: {
    //修改（添加）运费模板
    jumpFreightDetail(item) {
      item
        ? this.$router.push({
            path: "/infoSet_freight_detail",
            query: { id: item.f_id }
          })
        : this.$router.push("/infoSet_freight_detail");
    },
    //删除运费模板
    gotodelete(item, index) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios
          .post("/merchant/Freight/delete", { f_id: item.f_id })
          .then(res => {
            const _data = res.data;
            if (_data.code == 0) {
              this.$message({
                message: "删除成功！",
                type: "success"
              });
               this.enquiriesFunction();
            }
          });
      });
    },
    //获取后台数据列表
    enquiriesFunction(obj) {
      this.$axios.post("/merchant/Freight/lists", this.search).then(res => {
        const _data = res.data;
        if (_data.code == 0) {
          this.list = _data.data.data instanceof Array ? _data.data.data : [];
          this.total = _data.data.total;
        }
      });
    },

    //分页点击事件
    handleCurrentChange(val) {
      this.search.page = val;
      this.enquiriesFunction();
    },

    //分页展示条数事件
    handleSizeChange(val) {
      this.search.pagesize = val;
      this.enquiriesFunction();
    }
  },
  created() {
    this.enquiriesFunction();
  
  }
};
</script>


<style lang="scss">
.info-freight-list-wrap {
  .freightBox {
    font-size: 14px;
  }
  .freig-btn {
    margin-bottom: 20px;
  }
  .freight-ul {
    border: 1px solid #dfdfdf;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .freight-h2 {
    width: 100%;
    height: 58px;
    line-height: 58px;
    background: rgba(232, 242, 255, 1);
    .freight-right {
      margin-left: 10px;
      float: left;
      color: #409eff;
    }
    .freight-time,
    .freight-change,
    .freight-change {
      float: right;
      cursor: pointer;
      color: #409eff;
    }
    .fire-shu {
      float: right;
      margin-right: 20px;
    }
    .freight-change {
      margin-right: 20px;
      // color:#0000FF;
    }
    .fire-delete {
      margin-right: 40px;
      color: #fa5555;
    }
    .freight-time {
      margin-right: 60px;
      color: #959595;
      cursor: text;
    }
  }
  .freight-li {
    table {
      width: 100%;
      td {
        text-align: center;
        line-height: 60px;
        border-right: 1px solid #dfdfdf;
        border-bottom: 1px solid #dfdfdf;
      }
    }
  }
}
</style>