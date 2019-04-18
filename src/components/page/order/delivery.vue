<!--
  我的订单-发货
-->
<template>
   <div class="order-delivery-wrap">
     <section class="com-content-head">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb-nav">
        <el-breadcrumb-item :to="{ path: '/order_my_list' }">订单管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/order_my_list' }">我的订单</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/order_my_detail' }">订单详情</el-breadcrumb-item>
        <el-breadcrumb-item>发货</el-breadcrumb-item>
        </el-breadcrumb> 
        <h6>发货</h6>
      </section>
      <section class="orde-box com-content-body">
          <div class="orde-first-way">选择运送方式：</div>
          <section class="orde-content-way">
            <el-radio v-model="theObj.o_islogistics" label="2" class="orde-radio" @change="changeHide">无需物流</el-radio>
            <el-radio v-model="theObj.o_islogistics" label="1" class="orde-radio" @change="changeWuHide">快递</el-radio>
          </section>
          <section v-show="tabHide">
            <div class="orde-first-way">选择物流公司：</div>
            <div class="orde-content-way" >
              <div>物流公司名称：<el-input  class="orde-input" v-model="theObj.o_logisticsCompany"></el-input></div> 
              <div class="orde-wu" style="padding-left:40px;">
                运单号：<el-input  class="orde-input" v-model="theObj.o_logistics"></el-input>
              </div>
            </div>
          </section>

          <div class="orde-first-way">确认订单商品信息</div>
          <div class="orde-msg">
            <div class="orde-hao">
              <div class="orde-titile"> 订单编号：{{list.o_sn}}</div>
              <div class="orde-titile"> 买家：{{list.u_id}}</div>
            </div>
            <div class="orde-hao">
                <div class="orde-boox" style="border-right:1px solid #dfe4ed;font-size:14px;">
                  <!-- <div class="orde-infomation">物流选择：{{list.so_message}}</div> -->
                  <div class="orde-infomation">购买附言：{{list.so_message}}</div>
                  <div class="orde-infomation" style="height:50%">
                    <span>发货附言</span>
                    <textarea style="padding:10px;" v-model="theObj.o_ship_note"></textarea>
                  </div>
                </div>
                <div class="orde-boox" >
                  <div class="orde-show" v-for="(item,index) in list.order_goods" :key="index">
                      <img :src="item.g_images" />
                      <div v-if="item.sku_spec">
                          <div class="orde-tit">{{item.g_name}}</div><br />
                          <div class="orde-did" v-for="good in item.sku_spec" :key="good.index">
                            <span class="a">{{good.spec}}：</span>
                            <span>{{good.spec_value}}</span>&nbsp;&nbsp;
                          </div>
                         <div class="orde-num">X{{item.ct_num}}</div>
                      </div>
                  </div>
                </div>
            </div>
            
          </div>
          <el-button type="primary" style="margin-top:30px;margin-bottom:30px;" @click="gotoShip">确认发货</el-button>
      </section>
   </div>
</template>

<script>
export default {
  //数据
  data() {
    return {
      theObj:{o_islogistics:'1'},
      tabHide:true,
      isEdit:this.$route.query.id,
      list:{},
      
      options: [
        {
          value: "1",
          label: "订单编号"
        },
        {
          value: "2",
          label: "物流编号"
        }
      ],
    };
  },
  //执行事件
  methods: {
    gotoOrdeList(){
      this.$router.push({path: '/merchantManage_order_detail',query:{'id':this.isEdit}});
    },
    //改变显示
    changeHide(){
      this.tabHide = false;
    },
    //改变显示
    changeWuHide(){
      this.tabHide = true;
    },
    //获取数据
    enquiriesFunction(){
      this.$axios
        .post("/merchant/Order/getShipDetail",{'o_id':this.isEdit})
        .then(res => {
          const _data=res.data;
          if (_data.code == 0) {
            this.list = _data.data;
          }
        })
    },
    //点击发货
    gotoShip(){
      this.theObj.o_id = this.isEdit;
      this.theObj.note = this.theObj.o_ship_note;
      console.log(this.theObj)
      if(this.theObj.o_islogistics == '1'){ //快递
        if(this.theObj.o_logisticsCompany&&this.theObj.o_logistics){
          this.$axios
          .post("/merchant/Order/setShip",{...this.theObj})
          .then(res => {
            const _data = res.data;
            if(_data.code == 0){
              this.$message({
                message: "恭喜你，发货成功！",
                type: "success"
              });
              setTimeout(() => {
                  this.$router.push({path: '/order_my_list'});
              },1000);
            }
          })
        }else{
          this.$message.error('运单号 物流公司名称必填');
        }
      }else{
        this.$axios
        .post("/merchant/Order/setShip",{...this.theObj})
        .then(res => {
          const _data = res.data;
          if(_data.code == 0){
             this.$message({
              message: "恭喜你，发货成功！",
              type: "success"
            });
            setTimeout(() => {
                this.$router.push({path: '/order_my_list'});
            },1000);
          }
        })
      }
      
    }
  },
  //声明周期
  created() {
    this.enquiriesFunction();
  }
};
</script>

<style lang="scss">
.order-delivery-wrap{
  .orde-top{
    // background-image:url(../../../../../static/img/horn-icon.png);
    background-repeat:no-repeat;
    background-position:14px center;
    background-size:16px 12px;
    background-color:#ffeeee;
    width:100%;
    height:50px;
    line-height:50px;
    color:#fa6262;
    padding-left:46px;
  }
  .orde-box{
    width:auto;
    min-width:1200px;
    // margin:0 20px;
  }
  .orde-h2{
    width:100%;
    height:70px;
    line-height:70px;
    color:#409eff;
    margin-top:-36px;
  }
  .orde-first-way{
    width:100%;
    height: 46px;
    background: #ececec;
    border:1px solid #d6d6d6;
    padding-left: 35px;
    line-height: 46px;
    color:#666666;
    font-size: 14px;
  }
  .orde-content-way{
    margin-left: 20px;
    width:100%;
    // height: 80px;
    line-height: 80px;
  }
  .orde-way{
    width:100%;
    // height:70px;
    line-height:70px;
    color:#353535;
    display:inline-block;
    font-size:14px;
  }
  .orde-radio{
    // margin-left:20px;
    height:50px;
    line-height:50px;
  }
  .orde-li{
    margin-bottom:10px;
  }
  .deliver-title{
    line-height:18px;
    padding:26px 0 26px 14px;
    position:relative;
  }
  .deliver-title::before{
    content:'';
    height:18px;
    width:2px;
    background-color:#409eff;
    display:block;
    position:absolute;
    left:0;
    top:25px;
  }
  .orde-input{
    width:300px;
  }
  .orde-msg{
    border-width: 0 1px 1px 1px;
    border-style: solid;
    border-color: #dfe4ed;
    .orde-hao{
      display:flex;
      .orde-show{
        height:100px;
        margin:10px 10px 20px 10px;
        position:relative;
        width:80%;
        font-size:14px;
        display: flex;
        align-items: center;
      }
      .orde-boox{
        color:#7b7b7b;
        flex:1;
        padding-left:15px;
        
        img{
          display:inline-block;
          width:100px;
          height:100px;
          // vertical-align:top;
          float:left;
        }
        .orde-tit{
          display:inline;
          margin-left:30px;
          padding-top:5px;
        }
        .orde-did{
          // margin:50px 0 0 30px;
          margin-left:30px;
          margin-top:16px;
          display:inline-block;
        }
        .orde-num{
          position:absolute;
          top:50%;
          right:0;
          float:right;
        }
        .orde-infomation{
          margin-top:20px;
          span{
            float:left;
            margin-right:15px;
          }
          textarea{
            border:1px solid #dfe4ed;
            width:80%;
            height:80%;
            resize:none;
            margin-bottom:20px;
          }
        }
      }
      .orde-titile{
        border-bottom:1px solid #dfe4ed;
        padding-left:15px;
        flex:1;
        height:50px;
        line-height:50px;
        background:#f5f7fa;
      }
    }
  }
}
  
</style>

