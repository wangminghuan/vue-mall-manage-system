<template>
   
    <div class="my-info-wrap">
        <section class="com-content-head">
           <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb-nav">
                <el-breadcrumb-item :to="{ path: '/infoSet_myInfo' }">信息设置</el-breadcrumb-item>
                <el-breadcrumb-item>{{tabArr[isBaseInfo]}}</el-breadcrumb-item>
            </el-breadcrumb> 
            <h6>{{tabArr[isBaseInfo]}}</h6>
        </section>
        <section class="com-content-body">
        <div class="tab-list clearfix">
            <div v-for="(item,index) in tabArr" :class="['tab-left',isBaseInfo==index?'tab-active':'']" @click="isBaseInfo=index" :key="index">{{item}}</div>
        </div>
        <myBasicInfo v-if="isBaseInfo==0"></myBasicInfo>
        <myAdmissionInfo v-else></myAdmissionInfo>
        </section>
    </div>
</template>
<script>
import myAdmissionInfo from "./myAdmissionInfo";
import myBasicInfo from "./myBasicInfo";
export default {
  components: {
    myAdmissionInfo,
    myBasicInfo
  },
  data() {
    return {
      isBaseInfo:0,
      tabArr:['基本信息','我的入驻资料']
    };
  }
};
</script>
<style lang="scss" >
    .my-info-wrap{
        .tab-list{
            display: inline-block;
            border: 1px solid #dfdfdf;
            border-radius: 5px;
            overflow: hidden;
            margin-left: 50px;
            // margin-top: 50px;
            cursor:pointer;
            .tab-left,.tab-right{
                display: inline-block;
                padding: 10px 15px;
                color: #353535;
            }
            .tab-active{
                background: #409eff;
                color: #fff;
            }
        }
    }
</style>
