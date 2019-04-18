<template>
    <div class="outer-sidebar-wrap">
      <div class="inner-sidebar-wrap">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#333744"
            text-color="#fff" active-text-color="#fff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="[item.icon,'com-menu-icon']"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
      </div>
    </div>
</template>
<script>
// 全局菜单
const sidebarMenu = [
  {
    icon: "el-icon-1",
    index: "infoSet",
    title: "信息设置",
    subs: [
      {
        index: "infoSet_myInfo",
        title: "我的信息"
      },
      {
        index: "infoSet_freight_list",
        title: "运费模板"
      }
    ]
  },
  {
    icon: "el-icon-2",
    index: "goods",
    title: "商品管理",
    subs: [
      {
        index: "goods_add",
        title: "添加商品"
      },
      {
        index: "goods_my_list",
        title: "我的商品"
      }
    ]
  },
  {
    icon: "el-icon-3",
    index: "order",
    title: "订单管理",
    subs: [
      {
        index: "order_my_list",
        title: "我的订单"
      }
    ]
  },
  {
    icon: "el-icon-4",
    index: "shop",
    title: "店铺管理",
    subs: [
      {
        index: "shop_classify",
        title: "店铺分类"
      }
    ]
  },
  {
    icon: "el-icon-5",
    index: "statistical",
    title: "数据统计",
    subs: [
      {
        index: "statistical_data_list",
        title: "结算统计"
      }
    ]
  }
];
export default {
  props:{
    collapse:Boolean,
  },
  data() {
    return {
      items:sidebarMenu
    };
  },
  computed: {
    onRoutes() {
       // 详情的菜单状态激活(订单列表的发货页特殊处理)
          const _path=this.$route.path.replace('/','');
          const _pathArr=_path.split("_");
          if(_pathArr[_pathArr.length-1]=="detail" || _pathArr[_pathArr.length-1]=="delivery"){
              _pathArr[_pathArr.length-1]="list";
              return _pathArr.join("_")
          }
          if(_path=='goods_add'&&window.sessionStorage.getItem("__info")!=1){
             this.$message('请先完善店铺信息');
             this.$router.push('infoSet_myInfo')
            return 'infoSet_myInfo'
          }
          return _path
    }
  },
   created() {
     let arr=[...sidebarMenu];
     if(window.$isApply){  //如果是供应商，则不显示店铺
        arr.splice(3,1);
        this.items=arr;
      }
          // console.log(window.isInfo)

  },
};
</script>

<style lang="scss">

.outer-sidebar-wrap {
  .inner-sidebar-wrap{
     position: absolute;
     left:0;
     top:0;
     width: 300px;
     height: 100%;
     overflow-y: scroll;
  }
  .sidebar-el-menu:not(.el-menu--collapse){
        width: 240px;
    }
    // .el-menu-item.is-active{
    //   background-color: #333744
    // }
    .com-menu-icon{
      width: 18px;
      height: 18px;
    }
    .el-icon-1{
      background: url("../../../static/img/menu-icon-1.png") no-repeat;
    }
    .el-icon-2{
      background: url("../../../static/img/menu-icon-2.png") no-repeat;
    }
    .el-icon-3{
      background: url("../../../static/img/menu-icon-3.png") no-repeat;
    }
    .el-icon-4{
      background: url("../../../static/img/menu-icon-4.png") no-repeat;
    }
    .el-icon-5{
      background: url("../../../static/img/menu-icon-1.png") no-repeat;
    }
    .el-menu--collapse{
      width: 67px;
    }
    &::-webkit-scrollbar{
        width: 0;
    }
    ul {
      height: 100%;
    }
  // .el-menu {
  //   background-color: #324157;
  // }
     
  .el-menu-item{
    opacity: 0.5;
  }
  
  // .el-menu-item:focus {
  //   outline: 0;
  //   // background-color: #ecf5ff;
  //   background-color: #48576a;
  // }
  // .el-submenu .el-menu {
  //   background-color: #1f2d3d;
  // }
}
.el-menu-item.is-active,
  .el-submenu__title.el-menu-item.is-active {
    // color: red!important;
    // background-color:#fff!important 
    background-color: #409eff!important;
    opacity: 1.0!important;
  }
  .el-menu-item:not(.is-active):hover,
  .el-submenu__title:hover {
    background-color: #2c303b!important;
  }
</style>
