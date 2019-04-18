<!--
	极夫特商城企业管理后台
-->
<template>
    <div class="login-wrap" >
        <div class="ms-title">后&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;台&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;管&nbsp;&nbsp;&nbsp;&nbsp;理&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;系&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;统</div>
        <div class="login-inner-wrap">
        <div class="ms-login">
            <div class="sc-logo"><img src="../../../static/img/logo.png"></div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="u_cellphone">
                    <el-input v-model="ruleForm.u_cellphone" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="u_password">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.u_password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
        </div>
    </div>
</template>

<script>
export default {
        data: function(){
            return {
                ruleForm: {
                    u_cellphone: localStorage.getItem('__userName__')||"",
                    u_password: ''
                },
                rules: {
                    u_cellphone: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    u_password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/merchant/Login/login',{
                            ...this.ruleForm,
                            })
                        .then((res)=> {
                            const _data=res.data;
                            if(_data.code==0){
                                localStorage.setItem('__userName__',this.ruleForm.u_cellphone);
                                sessionStorage.setItem('__token__',_data.data.token);
                                sessionStorage.setItem('__userType__',_data.data.m_type);
                                //判断是供应商还是服务商
                                window.$isApply=_data.data.m_type == 2 ? true : false;
                                this.$router.push('/home');
                                
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },
        created(){
            sessionStorage.clear();
        },
        mounted() {
        },
    }
</script>

<style lang="scss">
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image:url("../../../static/img/bg.jpg");
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        .login-tips-btn{
        font-size:14px;
        color:#999;
        text-align:right;
        cursor: pointer;
        }
        .sc-logo{
            height:82px ;
            position: relative;
            img{
               position: absolute;
               top:50%;
               margin-top:-12px;
            }
        }
    }
   .login-inner-wrap{
        position: absolute;
        left:0;
        right:0;
        top:50%;
        width:432px;
        margin:0 auto;
        margin-top:-150px;
        .login-btn button{
        width:100%;
        height:58px;
        margin-bottom: 38px;
        
    }
    input{
            border-radius: 5px;
        }
     }
    .ms-title{
        font-size:34px;
        color: #fff;
        position: absolute;
        top:50%;
        left: 0;
        text-align: center;
        width: 100%;
        margin-top:-350px;
       
        line-height:44px;


    }
    .md-title{
        font-size:20px;
    }
    .ms-login, .modify-wrap{
        margin:0 auto;
        padding:0 42px;
        border-radius: 6px;
        background: #fff;
    }
    
    .modify-inner-wrap{
         position: absolute;
        left:0;
        right:0;
        top:50%;
        width:600px;
        margin:0 auto;
        margin-top:-151px;
    }
    .code-tips{
        // position: absolute;
       font-size: 12px;
       color: #999;
       text-align:left;
       padding-left: 100px;
       display: block;
    }
</style>
