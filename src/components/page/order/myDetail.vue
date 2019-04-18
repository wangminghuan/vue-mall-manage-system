<!--
  我的订单-详情
-->
<template>
   <div class="order-my-detail-wrap">
       <section class="com-content-head">
          <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb-nav">
            <el-breadcrumb-item :to="{ path: '/order_my_list' }">订单管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/order_my_list' }">我的订单</el-breadcrumb-item>
            <el-breadcrumb-item>订单详情</el-breadcrumb-item>
          </el-breadcrumb> 
          <h6>订单详情</h6>
        </section>
      <div class="orde-box com-content-body">
        <div class="orde-nav">
          <li :class="{'orde-red':list.o_status==0?true:false}">1.买家下单</li>
          <li :class="{'orde-red':list.o_status==1?true:false}" >2.卖家发货</li>
          <li :class="{'orde-red':list.o_status==2?true:false}">3.确认收货</li>
          <li :class="{'orde-red':(list.o_status==3||list.o_status==4)?true:false}">4.订单完成</li>
        </div>
        <div class="orde-guide">
          <div class="orde-left">
              <div v-if="list.o_status==0?true:false">
                <p class="orde-moneyState">当前订单状态：买家已下单，待付款</p>
                <p class="orde-remind">极夫特提醒您：买家还剩余{{showTime[2]+"分"+showTime[3]+"秒"}}付款，超时将自动取消订单</p>
              </div>
              <div v-else-if="list.o_status==1?true:false">
                <p class="orde-moneyState">当前订单状态：买家已付款，请发货</p>
                <p class="orde-remind">极夫特提醒您：您还剩余{{ (showTimeMail[0]!=="00"?(showTimeMail[0]+"天"):"")+showTimeMail[1]+"小时"+showTimeMail[2]+"分"+showTimeMail[3]+"秒"}}，请及时发货，超时将自动取消订单</p>
              </div>
              <div v-else-if="list.o_status==2?true:false">
                <p class="orde-moneyState">当前订单状态：等待买家确认收货</p>
                <p class="orde-remind">极夫特提醒您：如已完成订单，请及时联系买家协商确认收货</p>
              </div>
              <!-- <div v-else-if="list.o_status==3?true:false">
                <p class="orde-moneyState">当前订单状态：交易成功</p>
                <p class="orde-remind">极夫特提醒您：交易已成功，如果买家提出售后要求，请积极与买家协商，做好售后服务。</p>
              </div> -->
               <div v-else-if="(list.o_status==3||list.o_status==4)?true:false">
                <p class="orde-moneyState">当前订单状态：交易{{list.o_status_name}}</p>
                <!-- <p class="orde-remind"></p> -->
              </div>
              <!-- <div v-else-if="list.o_status==8?true:false">
                <p class="orde-moneyState">当前订单状态：售后处理中</p>
                <p class="orde-remind"></p>
              </div> -->
          </div>
          <div class="orde-right" v-show="list.o_status==1?true:false">
              <div class="orde-getBtn" @click="gotoDelivery" >发货</div>
          </div>
        </div>
        <div class="orde-tabMsg">
          <div class="orde-tab">
              <div class="orde-tablist" @click="changeHide" :class="{'orde-chooseWhite':tabHide}">订单信息</div>
              <div class="orde-tablist" @click="changeWuHide" :class="{'orde-chooseWhite':wuHide}">物流信息</div>
          </div>
          <div v-show="wuHide">
            <div class="orde-tabTop">
              <span class="orde-title">物流信息</span>
              <!-- <span>姓名：{{list.name}} {{list.phone}}</span> -->
              <span>收货地址：{{list.name+"，"+list.phone+"，"+list.address}}</span>
              <div v-if="list.o_islogistics == '1'">
                <span >运送方式：快递</span>
                <span>物流公司名称：{{list.o_logisticsCompany}}</span>
                <span style="margin-bottom:20px;">物流单号：{{list.o_logistics}}</span>
              </div>
              <span v-else>无需物流</span>
          </div>
          </div>
          <div v-show="tabHide">
            <div class="orde-tabTop">
              <div class="orde-title">买家信息</div>
              <li class="orde-oneTitle">买家昵称/用户名：{{list.u_username}}</li>
              <li class="orde-towTitle">联系电话：{{list.u_cellphone}}</li>
              <li class="orde-threeTitle">买家备注：{{list.o_message&&list.o_message!=' '?list.o_message:'无'}}</li>
              <li class="orde-fourTitle">订单编号：{{list.o_sn}}</li>
              <li class="orde-fiveTitle">下单时间： {{list.o_createTime}}</li>
            </div>
            <div class="orde-content">
              <table>
                <tr style="height:55px;line-height:55px;background-color:#f5f7fa;" v-show="this.list.order_goods?true:false">
                  <td class="orde-shopping">商品</td>
                  <td class="orde-prop orde-white">商品属性</td>
                  <td class="orde-price">单价(元)</td>
                  <td class="orde-num">数量</td>
                  <td class="orde">优惠</td>
                  <td>交易状态</td>
                  <td>实收款(元)</td>
                  <td>运费(元)</td>
                </tr>
                <tr v-for="(item,index) in this.list.order_goods" :key="index">
                  <td style="width:30%;">
                    <div class="order-shop">
                      <div style="width:100px;height:100px;">
                        <img style="width:100%;height:100%;" :src="item.g_images" />
                      </div>
                      <span style="margin-left:10px;max-width:200px;">{{item.g_name}}</span>
                    </div>
                  </td>
                  <td>
                    <div v-if="item.sku_spec">
                        <div v-for="(good,index) in item.sku_spec" :key="index">
                            <span class="a">{{good.spec}}：</span>
                            <span>{{good.spec_value}}</span>
                        </div>
                    </div>
                  </td>
                  <td>{{Number(item.ct_price).toFixed(2)}}</td>
                  <td>{{item.ct_num}}</td>
                  <td v-if="index<1" :rowspan="rowspanlength" v-show="(list.o_couponAmount&&list.o_cardAmount)?true:false">优惠券-{{Number(list.o_couponAmount).toFixed(2)}}<br />购物卡-{{Number(list.o_cardAmount).toFixed(2)}}</td>
                  <td v-if="index<1" :rowspan="rowspanlength">{{list.o_status_name}}</td>
                  <td v-if="index<1" :rowspan="rowspanlength">{{Number(list.o_payAmount).toFixed(2)}}</td>
                  <td v-if="index<1" :rowspan="rowspanlength">{{list.o_freightAmount}}</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="orde-text">
            <span class="orde-note">订单备注</span>
            <textarea class="orde-txtarea"  ref="protext">{{list.o_note}}</textarea>
          </div>
          <el-button type="primary" class="orde-btn" @click="setOrderNote">确定</el-button>
        </div>

      </div>
   </div>
</template>

<script>
export default {
  //数据
  data() {
    return {
      timer:null,
      leftTime:0,
      leftTimeCountdown:0,
      isEdit:this.$route.query.id,
      list:{},
      wuHide:false,
      tabHide:true,
      txtarea:'',
      timeHours:'',
      timeMinu:"",
      timeSec:'',
      downHours:'',
      downMinu:'',
      downSec:'',
      specCor:'',
      specTitle:'',
      specTowCor:'',
      specTowTitle:'',
      showTime:["00","00","00","00"],
      showTimeMail:["00","00","00","00"],
      timeNum:true,
      hasCancelSellerOrder:false,
      rowspanlength:''
    };
  },
  //执行事件
  methods: {
    changeHide(){
      this.tabHide = true;
      this.wuHide = false;
    },
    changeWuHide(){
       this.tabHide = false;
      this.wuHide = true;
    },
    //点击确定
    setOrderNote(){
      let textarea = this.$refs.protext.value;
      this.$axios
        .post("/merchant/Order/setNote",{'o_id':this.isEdit,'note':textarea})
        .then(res => {
          const _data=res.data;
          if (_data.code == 0) {
             this.$message({
                message: '恭喜你，操作成功！',
                type: 'success'
              });
           setTimeout(()=>{
              this.$router.push({path: '/order_my_list'});
            },1000)
          }
        })
    },
    //点击发货
    gotoDelivery(){
      this.$router.push({path: '/order_my_delivery',query:{'id':this.isEdit}});
    },
    checkTime(i){
          if(i<10) { 
            i = "0" + i; 
          } 
          return i;
      },
     setOrderSellerCancel(timeNum){
       if(timeNum = false){
          this.$axios
            .post("/api/shop/order/setOrderSellerCancel",{'so_id':this.isEdit})
            .then(res => {
              const _data=res.data;
              if (_data.code == 0) {
                  this.list.o_status = 6;
                  setTimeout(()=>{
                    window.location.reload()
                  },100)
              }
            })
       }
     },
     //取消买家订单
     cancelBuyerOrder(){
        this.$axios
        .post("/merchant/order/setCancel",{'o_id':this.isEdit})
        .then(res => {
          const _data=res.data;
          if (_data.code == 0) {
                window.location.reload()
          }
        })
     },
     //取消卖家超过72小时未发货订单
    //  cancelSellerOrder(){
    //    if(this.hasCancelSellerOrder) return;
    //     this.$axios
    //     .post("/api/shop/order/setOrderSellerCancel",{'so_id':this.isEdit})
    //     .then(resp => {
    //       if (typeof resp.data != "undefined" && resp.data.code == "0") {
    //             window.location.reload()
    //       }
    //     })
    //  },
    //获取数据
    enquiriesFunction(){
      const that=this;
      this.$axios
        .post("/merchant/Order/getdetail",{'o_id':this.isEdit})
        .then(res => {
          const _data=res.data;
          if (_data.code == 0) {
            this.list = _data.data;
           if(this.list.order_goods instanceof Array){
             this.rowspanlength = this.list.order_goods.length;
           }
            this.leftTime = this.list.countdown_nopay_order_cancel; //待付款
            this.leftTimeCountdown = this.list.countdown_noship_order_cancel; //待发货

            that.timer=setInterval(()=>{
              if(_data.data.o_status==0){ //待付款
              that.showTime=that.showCountDown(that.leftTime);
              that.leftTime = that.leftTime - 1;
                if(that.leftTime<=0){
                  that.cancelBuyerOrder();
                  clearInterval(that.timer);
                  }
              }else if(_data.data.o_status==1){ //待发货
              that.showTimeMail=that.showCountDown(that.leftTimeCountdown);
                that.leftTimeCountdown = that.leftTimeCountdown - 1;
                if(that.leftTimeCountdown<=0){
                  that.cancelBuyerOrder();
                  clearInterval(that.timer);
                }
              }

            },1000)
          }
        })
    },
    //更新时间
    showCountDown(leftTimeNow) {
      if(leftTimeNow<=0){
        return ["0","0","0","0"]
      };
      var days = parseInt(leftTimeNow / 60 / 60 / 24 , 10); //计算剩余的天数 
      var hours = parseInt(leftTimeNow / 60 / 60 % 24 , 10); //计算剩余的小时 
      var minutes = parseInt(leftTimeNow / 60 % 60, 10);//计算剩余的分钟 
      var seconds = parseInt(leftTimeNow % 60, 10);//计算剩余的秒数 
      days = this.checkTime(days); 
      hours = this.checkTime(hours); 
      minutes = this.checkTime(minutes); 
      seconds = this.checkTime(seconds);
      // leftTimeNow=leftTimeNow-1000;
      return [days,hours,minutes,seconds]
    },
  },
  //声明周期
  created() {
    this.enquiriesFunction();
  }
};
</script>

<style lang="scss">
  .order-my-detail-wrap{
    .orde-top{
      background-image:url(../../../../static/img/horn-icon.png);
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
    }
    .orde-h2{
      width:100%;
      height:70px;
      line-height:70px;
      color:#409eff;
      margin-top:-36px;
    }
    .orde-nav{
      width:auto;
      height:76px;
      background-color:#f5f7fa;
      display:flex;
      .ordeNav-check{
        background-color:#f76c52;
        color:#ffffff;
        border-radius:10px;
      }
      .orde-red{
        background-color:#f76c52;
        color:#ffffff;
        border-radius:10px;
        flex:0.8;
        height:88px;
        line-height:88px;
        margin-top:-6px;
        position:relative;
      }
      .orde-red:after{
        content:'';
        width:0;
        height:0;
        border-left: 10px solid transparent; 
        border-right: 10px solid transparent; 
        border-bottom: 10px solid red;
        position:absolute;
        bottom:-20px;
        left:45%;
      }
      li{
        height:76px;
        line-height:76px;
        margin:0 25px;
        flex:1;
        text-align:center;
        display:flex;
        align-items:center;
        justify-content:center;
        position:relative;
      }
      li:nth-child(1):before{
        content:'';
        width:13px;
        height:11px;
        background-image:url(../../../../static/img/arrow-icon.png);
        background-repeat:no-repeat;
        background-size:13px 11px;
        position:absolute;
        right:-30px;
      }
       li:nth-child(2):before{
        content:'';
        width:13px;
        height:11px;
        background-image:url(../../../../static/img/arrow-icon.png);
        background-repeat:no-repeat;
        background-size:13px 11px;
        position:absolute;
        right:-30px;
      }
       li:nth-child(3):before{
        content:'';
        width:13px;
        height:11px;
        background-image:url(../../../../static/img/arrow-icon.png);
        background-repeat:no-repeat;
        background-size:13px 11px;
        position:absolute;
        right:-30px;
      }
    }
    // .orde-guide:after{
    //   content:'';
    //   width:0;
    //   height:0;
    //   border-left: 10px solid transparent; 
    //   border-right: 10px solid transparent; 
    //   border-bottom: 10px solid red;
  
    // }
    .orde-guide{
    
      width:auto;
      height:150px;
      border:1px solid #f76549;
      margin:25px 0px 0 0px;
      background-color:#ffeeeb;

      .orde-left{
        width:60%;
        height:150px;
         display:flex;
        float:left;
        align-items:center;
      }
      .orde-right{
        height:150px;
        width:30%;
        display:flex;
        float:right;
        align-items:center;
      }
    }
  }
  .orde-left{
    .orde-moneyState{
      // margin-top:50px;
      // margin-bottom:20px;
      margin-left:40px;
      font-size:17px;
      font-weight:600;
        width:100%;
        color:#353535;
      }
      .orde-remind{
        width:100%;
        color:#f76549;
        margin-top:20px;
        margin-left:40px;
        font-size:14px;
      }
  }
  .orde-right{
    .orde-getBtn{
        width:160px;
        height:60px;
        line-height:60px;
        text-align:center;
        background-color:#f76c52;
        color:#ffffff;
        border-radius:10px;
        cursor: pointer;
      }
  }
  .orde-tabMsg{
    width:auto;
    
    margin:23px 0px 0 0px;
    border:1px solid #dfdfdf;
    .orde-tab{
      background-color:#f5f7fa;
      height:55px;
      border-bottom:1px solid #dfdfdf;
    }
    .orde-tablist{
      cursor: pointer;
      width:270px;
      height:55px;
      line-height:55px;
      text-align:center;
      display:inline-block;
    }
    .orde-chooseWhite{
      background:#ffffff;
      border-right:1px solid #dfdfdf;
    }
    .orde-tabTop{
      width:auto;
      margin:0 25px;
      .orde-title{
        margin-top:30px;
        margin-bottom:30px;
        color:#353535;
        font-weight:600;
      }
      .orde-oneTitle{
          margin-right:100px;
      }
      .orde-towTitle{
        margin-right:100px;
      }
      .orde-threeTitle{
        margin-right:100px;
        color:#f76c52;
      }
      .orde-fourTitle{
        margin-right:100px;
      }
      .orde-fiveTitle{
        margin-right:100px;
      }
      li{
         margin-bottom:30px;
        display:inline-block;
        font-size:14px;
      }
      span{
        display:block;
        margin-top:20px;
        font-size:14px;
      }
    }
  }
  .orde-content{
    width:auto;
    margin:0 25px;
    font-size:14px;
    table{
      width:100%;
      // border:1px solid #dfdfdf;
      td{
        text-align: center;
        border:1px solid #dfdfdf;
      }
      .order-shop{
        display:flex;
        align-items:center;
        margin:10px;
      }
    }
  }
  //   tr{
  //     width:100%;
  //     border:1px solid #dfdfdf;
  //     border-top:0;
  //     display:flex;
  //     position:relative;
  //     .orde-imgflex{
  //       width:100%;
  //       height:100%;
  //       display:flex;
  //       align-items:center;
  //     }
  //     .orde-img{
  //       margin-left:20px;
  //     }
  //     .orde-sgName{
  //       margin-left:30px;
  //       width:50%;
  //       text-align:left;
  //       overflow:hidden;
  //       text-overflow:ellipsis;
  //     }
  //     td{
  //       flex:1;
  //       text-align:center;
  //       .orde-sgsv{
  //        margin-bottom:10px;
  //       }
  //     }
  //     .orde-shopping{
  //       flex:5;
  //       img{
  //         float:left;
  //         width:100px;
  //         height:100px;
  //         // margin-right:30%;
  //       }
  //     }
  //     .orde-white{
  //       flex:2;
  //     }
  //     .orde-ss{
  //       display:flex;
  //       justify-content:center;
  //       flex-direction:column;
  //       align-items:center;
  //     }
  //     .orde-td{
  //       border-right:1px solid #dfdfdf;
  //     }
  //   }
  // }
  .orde-text{
      width:100%;
      margin:37px 0 0 25px;
      float:left;
      .orde-note{
        height:108px;
        color:#353535;
        width:10%;
        float:left;
        font-weight:600;
        padding-top:10px;
      }
      .orde-txtarea{
        padding:10px;
        width:80%;
        height:108px;
        border:1px solid #dfe4ed;
        border-radius:10px;
        float:left;
        resize : none;
        -webkit-user-modify:read-write-plaintext-only;
        -moz-user-modify:read-write-plaintext-only;
        -o-user-modify:read-write-plaintext-only;
        -ms-user-modify:read-write-plaintext-only;
        word-wrap:break-word;
      }
    }
    .orde-btn{
      margin-left:10%;
      margin-top:24px;
      margin-bottom:30px;
    }
</style>