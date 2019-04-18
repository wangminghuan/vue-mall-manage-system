<template>
   
    <div class="my-basic-info-wrap">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="店铺名称" prop="shop_name" v-if="form.type==1">
                <el-input  v-model="form.shop_name" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <!-- 上传店铺logo -->
            <el-form-item label="店铺logo" prop="shop_logo">
                <ul v-if="form.shop_logo" class="info-logo el-upload-list--picture-card">
                 <li>
                  <span class="el-upload-list__item-actions"><span class="el-upload-list__item-preview"><i class="el-icon-zoom-in" @click="handlePictureCardPreview()"></i></span><span class="el-upload-list__item-delete"><i class="el-icon-delete"  @click="handleRemove()"></i></span></span>
                  <img :src="form.shop_logo">
                 </li>
              </ul>
                <div v-else class="el-upload el-upload--picture-card" @click="showCrop1=!showCrop1">
                  <i class="el-icon-plus"></i>
                </div>
                    <vue-crop-upload 
                        field="file"
                        @crop-upload-success="(res)=>imgUpLoadSuccess(res,'shop_logo')"
                        v-model="showCrop1"
                        :noCircle="hideCircle"
                        :width="200"
                        :height="200"
                        :url="uploadUrl"
                        :params="uploadParams"
                        :langExt="langZh"
                        img-format="png"></vue-crop-upload>
            </el-form-item>
            <!-- 上传公司环境图片 --> 
            <el-form-item label="公司环境" prop="company_environment">
                <ul v-if="form.company_environment" class="info-logo el-upload-list--picture-card clearfix">
                 <li
                  v-for="(item,index) in form.company_environment.split(',')" 
                  :key="index">
                  <span class="el-upload-list__item-actions"><span class="el-upload-list__item-preview"><i class="el-icon-zoom-in" @click="handlePictureCardPreview(item)"></i></span><span class="el-upload-list__item-delete"><i class="el-icon-delete"  @click="handleRemove(index)"></i></span></span>
                  <img 
                  :src="item">
                 </li>
                </ul>
                <div v-if="form.company_environment==''" class="el-upload el-upload--picture-card" @click="showCrop2=!showCrop2">
                    <i class="el-icon-plus"></i>
                </div>
                    <vue-crop-upload 
                        field="file"
                        @crop-upload-success="(res)=>imgUpLoadSuccess(res,'company_environment')"
                        v-model="showCrop2"
                        :noCircle="hideCircle"
                        :width="690"
                        :height="460"
                        :url="uploadUrl"
                        :params="uploadParams"
                        :langExt="langZh"
                        img-format="png"></vue-crop-upload>
            </el-form-item>
            <el-form-item label="联系人姓名" prop="contact_name">
                <el-input v-model="form.contact_name"></el-input>
            </el-form-item>
            <el-form-item label="联系人邮箱" prop="contact_email">
                <el-input v-model="form.contact_email"></el-input>
            </el-form-item>
            <el-form-item label="联系人手机号" prop="contact_phone">
                <el-input v-model="form.contact_phone"></el-input>
            </el-form-item>
            <el-form-item label="公司名称">
                <span class="color-999">{{form.company_name}}</span>
            </el-form-item>
            <el-form-item label="经营范围">
                <span class="color-999">{{form.business_scope}}</span>
            </el-form-item>
            <el-form-item label="对公账号">
                <span class="color-999">{{form.corporate_account}}</span>
            </el-form-item>
            <el-form-item label="入驻时间" >
                <div class="show-box">{{form.enter_date}}</div>
                <span class="font-red" v-if="form.enter_date_notice">合约即将到期，请联系客服续约</span>
            </el-form-item>
            <el-form-item label="结算时间" >
                <div v-if="form.settlement_interval>0">
                  <span class="show-box show-son-box">{{'每'+form.settlement_interval+'个月'}}</span>
                  <span class="show-box show-son-box">{{form.settlement_day+'号'}}</span>
                </div>
                 <div v-else  class="show-box">平台暂未设置结算时间</div>
            </el-form-item>
            <el-form-item label="状态" >
                <div class="show-box">{{form.status==1?'正常':'禁止'}} </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleClickSubmit('form')">保存</el-button>
            </el-form-item>
        </el-form>
         <!-- 预览图对话框 -->
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    const that = this;
    return {
      hasSubmit:false,
      dialogVisible: false,
      dialogImageUrl: "",
      uploadUrl: that.$uploadUrl,
      uploadParams: {
        imagePath: "user",
        token:sessionStorage.getItem("__token__"),
      },
      hideCircle: true,
      langZh: that.$uploadLangZh,
      showCrop1: false,
      showCrop2: false,
      form: {},
      rules: {
        shop_name: [
          { required: true, message: "请输入店铺名称", trigger: "blur" },
          { max:8, min:1, message: "请输入1~8个字符", trigger: "blur" }
        ],
        shop_logo: [
          { required: true, message: "请上传店铺logo", trigger: "blur" }
        ],
        company_environment: [
          { required: true, message: "请上传公司环境图片", trigger: "change" }
        ],
        contact_name: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
          { max:8, min:1, message: "请输入1~8个字符", trigger: "blur" }
        ],
        contact_email: [
          { required: true, type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        contact_phone: [
          { required: true, message: "请输入联系人手机号", trigger: "blur" },
          { max:11, min:11, message: "请输入正确的手机号", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //上传成功后的回调
    imgUpLoadSuccess(res, _key) {
      if (_key == "shop_logo") {
        this.form[_key] = res.data.url;
      } else {
        // 上传公司环境
        // let arr = this.form.company_environment.split(",");
        // console.log(arr)
        // if (arr.length == 1 && arr[0] == "") arr = [];
        // arr.push(res.data.url);
        this.form.company_environment = res.data.url;
      }
    },
    //预览图片
    handlePictureCardPreview(item) {
      if (typeof item == "undefined") {
        this.dialogImageUrl = this.form.shop_logo;
      } else {
        this.dialogImageUrl = item;
      }
      this.dialogVisible = true;
    },
    //删除图片
    handleRemove(index) {
      if (typeof index == "undefined") {
        this.form.shop_logo = "";
      } else {
        let arr = this.form.company_environment.split(",");
        arr.splice(index, 1);
        this.form.company_environment = arr.join(",");
      }
    },
    getUserInfo() {
      this.$axios.post("/merchant/Merchant/myInfo").then(res => {
        const _data = res.data;
        if (_data.code == 0) {
          this.form = _data.data;
          window.sessionStorage.setItem("__info",this.form.shop_name!=''&&this.form.shop_name!=null?1:0);
        }
      });
    },
    handleClickSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        if(this.hasSubmit) return;
        this.hasSubmit=true;
          this.$axios.post("/merchant/Merchant/updateMyInfo",{
            shop_name:this.form.shop_name,
            shop_logo:this.form.shop_logo,
            company_environment:this.form.company_environment,
            contact_name:this.form.contact_name,
            contact_phone:this.form.contact_phone,
            contact_email:this.form.contact_email
          }).then(res => {
            const _data = res.data;
            if (_data.code == 0) {
              this.$message({
                message: "恭喜你，更新成功！",
                type: "success"
              });
            }
            this.hasSubmit=false;
          }).catch(()=>{
              this.hasSubmit=false;
          });
        }
      });
    }
  },
  created() {
    this.getUserInfo();
   
  }
};
</script>
<style lang="scss">
.my-basic-info-wrap {
  width: 600px;
  margin-top: 20px;
  .font-red{
    color: #f00;
  }
  .el-input__inner {
    border-radius: 5px;
  }
  .info-logo li {
    width: 148px;
    height: 148px;
    overflow: hidden;
    position: relative;
    float: left;
    width: 148px;
    margin: 20px 10px 20px 0;
  }
  .el-form-item__label {
    margin-left: 40px;
    width: 120px !important;
  }
  .el-form-item__content {
    margin-left: 160px !important;
  }
  .color-999 {
    color: #999;
  }
  .show-box {
    border: 1px solid #d8dce5;
    background: #f2f2f2;
    border-radius: 5px;
    padding-left: 10px;
    color: #878d99;
    font-size: 14px;
  }
  .show-son-box:nth-child(1) {
    margin-right: 10px;
  }
  .show-son-box {
    display: inline-block;
    width: 212px;
  }
}
</style>
