<template>
    <div class="outer-wrapper">
        <v-head :handleSetCollapse="handleSetCollapse"></v-head>
        <v-sidebar :collapse="collapse"></v-sidebar>
        <div :class="['outer-content-wrap',collapse?'content-collapse':'']">
            <transition name="move" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    export default {
        components:{
            vHead,
            vSidebar
        },
        data(){
            return {
                collapse:false
            }
        },
        methods:{
            handleSetCollapse(){
                this.collapse=!this.collapse
            },
        saveCityDataInLocal(){
          this.$axios.post("/merchant/Region/all")
          .then((res)=>{
              const _data=res.data;
              if(_data.code==0){
                 localStorage.setItem('__city_code__',JSON.stringify(_data.data))
              }
          })
           }
        },
    created(){
        //全局城市数据，缓存在local中
        if(!(localStorage.getItem('__city_code__'))){
            this.saveCityDataInLocal()
        }
    },
    }
</script>
<style lang="scss">
$SideMaxWidth:240px;
$SideminWidth:66px;
.outer-content-wrap{
    // background: none repeat scroll 0 0 #fff;
    position: absolute;
    left: $SideMaxWidth;
    right: 0;
    top: 60px;
    bottom:0;
    width: auto;
    box-sizing: border-box;
    transition: left .3s ease-in-out;
    .ql-container-wrap {
    height: 300px;
    strong,
    b {
      font-weight: bold;
    }
    i,
    em,
    address,
    b {
      font-style: italic;
    }
  }
}
.outer-sidebar-wrap {
  display: block;
  position: absolute;
  width: $SideMaxWidth;
  left: 0;
  top: 60px;
  bottom: 0;
  overflow: hidden;
  height: 100%;
//   overflow-y: scroll;
}
.sidebar-collapse{
  width: $SideminWidth
}
.content-collapse{
   left: $SideminWidth;
}
.com-content-head{
    padding:18px 16px;
    border-bottom: 1px solid #e9e9e9;
    .el-breadcrumb__inner{
font-size:12px;
    } 
    .crumb-nav{
        margin-bottom:12px;
    }
    h6{
     color:#353535;  
     font-size: 16px; 
    }
}
.com-content-body{
    background: none repeat scroll 0 0 #fff;
    border:16px solid #f2f2f2;
    border-right: 0;
    position: absolute;
    left: 0px;
    right: 0;
    top: 82px;
    bottom: 0;
    width: auto;
    box-sizing: border-box;
    overflow-y: scroll;
    padding: 30px;
}
</style>

