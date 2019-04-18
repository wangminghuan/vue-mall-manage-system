<template>
    <section>
    <div class="outer-head-wrap">
         <div class="collapse-btn" @click="handleSetCollapse"></div>
         <div class="logo">极夫特商城管理后台</div>
         <ul class="user-info clearfix">
            <li class="msg" @click="handleClickShowIm">IM</li>
            <li>{{userName}}</li>
            <li class="exit" @click="handleClickExit">退出</li>
        </ul>
    </div>
    <im-component v-model="showIm"></im-component>
    </section>
</template>
<script>
import imComponent from "../../components/page/Im";
    export default {
        components:{
        imComponent
    },
        props:{
            handleSetCollapse:Function
        },
        data() {
            return {
                 showIm:false,
                collapse:false,
                fullscreen: false,
                userName:localStorage.getItem('__userName__')||"admin"
            }
        },
        methods:{
            handleClickShowIm(){
                this.showIm=true;
            },
            handleClickExit() {
                 this.$confirm('您即将退出后台, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    sessionStorage.clear();
                    this.$router.push('/login');
                })
    }
    }
    }
</script>
<style lang="scss">
.outer-head-wrap{
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 60px;
        font-size: 22px;
        line-height: 60px;
        color: #fff;
         background-color: #545c64;
  .logo{
        float: left;
        text-align: center;
        padding-left: 33px;
    }
    .collapse-btn{
      width: 66px;
      height: 100%;
      float: left;
       background: url("../../../static/img/collapse-icon.png") no-repeat center;
       background-color: #474d54;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
        li{
            display: inline-block;
            vertical-align: middle;
            margin-right: 60px;
        }
        .msg{
             background: url("../../../static/img/msg.png") no-repeat;
            background-position: 0px 21px;
            background-size: 26px auto;
            padding-left: 35px;
            margin-right: 58px;
            cursor: pointer;
        }
        .exit{
            background: url("../../../static/img/exit-icon.png") no-repeat;
            background-position: 0px 21px;
            padding-left: 30px;
            margin-right: 0;
            cursor: pointer;
        }
    }
    .btn-fullscreen{
            position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
        transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
    i{
            position: absolute;
    top: 7px;
    left: 0;
    }
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        // padding-left: 10px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
}
</style>
