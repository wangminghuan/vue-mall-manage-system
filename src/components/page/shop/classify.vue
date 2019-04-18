<!--
  店铺分类
  联调完毕 20180703 by wmh
-->
<template>
  <div class="shop-classify-wrap">
<section class="com-content-head">
           <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb-nav">
            <el-breadcrumb-item>店铺管理</el-breadcrumb-item>
            <el-breadcrumb-item>店铺分类</el-breadcrumb-item>
            </el-breadcrumb> 
            <h6>店铺分类</h6>
        </section>
    <div class="classify-center com-content-body">
      <el-button type="primary" plain class="classify-addbtn" @click="gotoAddList">+添加分类</el-button>
      <el-button type="primary" plain class="classify-addbtn" @click="seveDataList">保存修改</el-button>
      <div class="tab-name clearfix">
          <div class="tab-title tab-title1">分类名称</div>
          <!-- <div class="tab-title">移动</div> -->
          <div class="tab-title tab-title2">默认展开</div>
          <div class="tab-title tab-title3">创建时间</div>
          <div class="tab-title tab-title4">操作</div>
      </div>
     
        <div v-for="(item,index) in listdata" style="border-right:1px solid #e6ebf5;border-left:1px solid #e6ebf5;" :key="index">
          <div class="tableName clearfix" >
            <div class="tb-name clearfix">
              <span class="tb-before" @click="shutDown(item,index)" :class="{'changeDownCss':item.changeDownCss}"></span>
              <input class="tb-text"  v-model="item.parent.gc_name" maxlength="15"/>
            </div>
            <el-switch
              class="tb-switch"
              v-model="item.parent.gc_is_open"
              :active-value="1"
              :inactive-value="0"
              active-color="#409eff"
              inactive-color="#c6c6c6"
              @change="openDown(item,index)"
              >
            </el-switch>
            <div class="tb-time">{{item.parent.create_time}}</div>
            <div class="tb-delete" @click="deleteList(item.parent,index,0,parent)">删除</div>
          </div>
          
          <div v-for="(list,num) in item.child" :key="num">
              <div class="tableName clearfix" v-show="item.isShow=='0'?true:false">
                <div class="subtableName clearfix">
                  <input class="tb-text sub-text" v-model="list.gc_name" maxlength="10"/>
                </div>
                <div class="tb-switch"></div>
                <div class="tb-time">{{list.create_time}}</div>
                <div class="tb-delete" @click="deleteList(list,index,num,child)">删除</div>
              </div>
          </div>

          <div class="td-btn clearfix" v-show="item.isShow=='0'?true:false">
              <el-button type="primary" plain class="td-addright clearfix" @click="addChildDom(item,index)">添加子分类</el-button>
          </div>
        </div>     
    
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hasSubmit:false,
      changeDownCss: "",
      hide: true,
      parent: "parent", //一级 标识符
      child: "child", //二级 标识符
      subChildNum: "",
      showSub: true, //二级 展开收缩
      listdata: [], //存数据
      value2: "1", //默认展开 标识符
      respData: {}
    };
  },

  methods: {
    //点击打开关闭
    openDown(item,index) {
      this.listdata[index].gc_is_open=!item.gc_is_open?1:0
    },
    checkSave(data){
       for(let i=0;i<data.length;i++){
         if(data[i].parent.gc_name.replace(/\s+/g,'')==""){
           return false;
         }else{
           for(let j=0;j<data[i].child.length;j++){
             if(data[i].child[j].gc_name.replace(/\s+/g,'')==""){
                return false;
              }
           }
         }
       }
       return true;

    },
    //移动
    gotoMove(item, index, num, option) {
      //占时不做
      // console.log(item,index,num,option)
    },
    //保存数据提交数据
    seveDataList() {
      if(this.hasSubmit) return;
      this.hasSubmit=true;
      if(!this.checkSave(this.listdata)){
           this.hasSubmit=false;
           this.$message.error("分类名称不能为空！")
           return false
      }
      this.$axios
        .post("/merchant/GoodsClass/add", { 
          param_data: JSON.stringify(this.listdata)
        })
        .then(res => {
          const _data=res.data;
          if (_data.code == 0) {
            this.$message({
              message: "恭喜你，添加成功！",
              type: "success"
            });
            setTimeout(() => {
              this.getDataFunction();
            }, 1000);
          }
          this.hasSubmit=false;
        })
        .catch((error)=>{
          this.hasSubmit=false;
        });
    },
    //删除事件
    deleteList(item, index, num, option) {
      let sgcValue = 0;
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //未提交到服务器端，id都是0，此时不需要请求接口删除
        if(item.gc_id=="0"){
              option == "parent"? this.listdata.splice(index, 1)
              :option == "child" && this.listdata[index] && ((this.listdata[index].child) instanceof Array)?this.listdata[index].child.splice(num, 1):"";
              return;
        }
          this.$axios
            .post("/merchant/GoodsClass/del", { gs_id: item.gc_id })
            .then(res => {
                const _data=res.data;
                if(_data.code==0){
                  option == "parent"? this.listdata.splice(index, 1)
                  :option == "child" && this.listdata[index] && ((this.listdata[index].child) instanceof Array)?this.listdata[index].child.splice(num, 1):"";
                }
            })
        })
        .catch(error => {
          console.log(error);
        });
    },
    //添加子节点
    addChildDom(item, index) {
      this.listdata[index].child.push({ gc_name: "", gc_id: "0",create_time:(new Date().format("yyyy-MM-dd hh:mm:ss")) });
      this.listdata[index].isShow =0;
        this.listdata[index].isShow == "0" ? "0" : "0";
    },
    //关闭二级节点
    shutDown(item, index) {
      if (this.listdata[index].isShow == "0") {
        this.listdata[index].isShow = "1";
        this.listdata[index].changeDownCss = false;
      } else {
        this.listdata[index].isShow = "0";
        this.listdata[index].changeDownCss = true;
      }
    },
    //添加分类 一级和二级
    gotoAddList() {
      this.listdata.push({
        isShow:"0",
        changeDownCss:"",
        child: [],
        parent: { gc_name: "0", gc_id: "0", gc_name: "",create_time:(new Date().format("yyyy-MM-dd hh:mm:ss")) }
      });
    },
    //获取数据
    getDataFunction() {
      this.$axios
        .post("/merchant/GoodsClass/getList")
        .then(res => {
          const _data = res.data
          if(_data.code==0){
            _data.data.map(item => {
              item.isShow = "0";
              item.changeDownCss = "";
            });
            this.listdata = _data.data;
          }
        })
    }
  },
  created() {
      this.getDataFunction();
  }
};
</script>

<style lang="scss">
.shop-classify-wrap {
  min-width: 1000px;
  .classify-center {
    min-width: 1100px;
    width: auto;
    margin: 0px 20px 0px 20px;
    .classify-addbtn {
      margin-bottom: 20px;
    }
    .tab-name {
      width: 100%;
      border: 1px solid #e6ebf5;
      .tab-title {
        float: left;
        width: 25%;
        color: #878d9c;
        height: 50px;
        line-height: 50px;
        text-align: center;
      }
      .tab-title1 {
        width: 35%;
      }
      .tab-title2 {
        width: 25%;
      }
      .tab-title3 {
        width: 20%;
      }
      .tab-title4 {
        width: 20%;
      }
    }
  }
}
.tableName {
  display: block;
  height: 50px;
  line-height: 50px;

  text-align: center;
  border-bottom: 1px solid #e6ebf5;
}
.td-addright {
  height: 30px;
  margin-left: 70px;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
  padding: 2px;
}
.td-btn {
  height: 50px;

  align-items: center;
  border-bottom: 1px solid #e6ebf5;
  position: relative;
}
.td-btn::before {
  content: "";
  width: 10px;
  height: 10px;
  border-right: 2px solid #b1b5be;
  border-bottom: 2px solid #b1b5be;
  transform: rotate(90deg);
  position: absolute;
  left: 50px;
  top: 20px;
}
.subtableName {
  height: 50px;
  line-height: 50px;
  float: left;
  width: 35%;
  // margin-left:10px;
  justify-content: center;
  align-items: center;
  position: relative;
}
.tb-name {
  width: 35%;
  // display:inline-block;
  float: left;
  position: relative;
  padding-left: 20px;
  justify-content: center;
  align-items: center;
}
.tb-text {
  padding-left: 5px;
  color: #353535;
  width: 80%;
  height: 30px;
  line-height: 30px;
  -webkit-user-modify: read-write-plaintext-only;
  text-align: left;
  border: 1px solid #e6ebf5;
  border-radius: 5px;
}
.sub-text {
  margin-left: 70px;
}
.subtableName::before {
  content: "";
  width: 10px;
  height: 10px;
  border-right: 2px solid #b1b5be;
  border-bottom: 2px solid #b1b5be;
  transform: rotate(90deg);
  position: absolute;
  left: 50px;
  top: 20px;
}
.tb-before {
  width: 0px;
  height: 0px;
  border: 7px solid transparent;
  border-top: 7px solid #409eff;
  margin-right: 5px;
  top: 20px;
  left: 28px;
  position: absolute;
  cursor: pointer;
}
.changeDownCss {
  transform: rotate(180deg);
  top: 10px;
}
.tb-mobile {
  // display:inline-block;
  float: left;
  height: 50px;
  position: relative;
}
.tb-mobile .tb-span {
  width: 10px;
  display: inline-block;
  height: 50px;
  //   background-image:url(../../../../../static/img/gray-icon.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 10px 16px;
  position: absolute;
  top: 0;
  left: 47%;
}
.tb-mobile .tb-graySpan {
  width: 10px;
  display: inline-block;
  height: 50px;
  //   background-image:url(../../../../../static/img/light-icon.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 10px 16px;
  position: absolute;
  top: 0;
  left: 47%;
}
.tb-mobile .tb-b {
  position: absolute;
  top: 0;
  left: 55%;
  width: 10px;
  display: inline-block;
  height: 50px;
  //   background-image:url(../../../../../static/img/light-icon.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 10px 16px;
}
.tb-mobile .tb-grayB {
  position: absolute;
  top: 0;
  left: 55%;
  width: 10px;
  display: inline-block;
  height: 50px;
  //   background-image:url(../../../../../static/img/gray-icon.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 10px 16px;
}
.tb-switch {
  // display:inline-block;
  text-align: center;
  width: 25%;
  float: left;
  height: 50px;
  line-height: 50px;
  .el-switch__core {
    margin: 0 auto;
  }
}
.tb-time {
  // display:inline-block;
  float: left;
  width: 20%;
}
.tb-delete {
  color: #fa5555;
  // display:inline-block;
  cursor: pointer;
  width: 20%;
  float: left;
}
</style>