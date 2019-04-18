<template>
   
    <div class="my-admission-info-wrap">
        <el-form ref="form" :model="form" label-width="170px">
            <h1>营业执照信息</h1>
            <el-form-item label="营业执照副本电子版">
                <section class="img-box" v-for="(item,index) in (typeof form.lic_img=='string'? form.lic_img.split(','):'')" :key="index" @click="handleShowBigPic(item)"><img  class="cursor" :src="item"></section>
            </el-form-item>
            <!-- <el-form-item label="公司所在地" class="address-item">
                <el-input  v-model="form.shopName" :disabled="true"></el-input>
                <el-input  v-model="form.shopName" :disabled="true"></el-input>
                <el-input  v-model="form.shopName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="公司详细地址">
                <el-input v-model="form.shopName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="公司电话">
                <el-input v-model="form.shopName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="公司名称">
                <el-input v-model="form.shopName" :disabled="true"></el-input>
            </el-form-item> -->
            <el-form-item label="营业执照注册号">
                <el-input v-model="form.lic_no" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="营业执照所在地" class="address-item">
                <el-input v-model="form.lic_province" :disabled="true"></el-input>
                <el-input v-model="form.lic_city" :disabled="true"></el-input>
                <el-input v-model="form.lic_area" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="营业执照详细地址">
                <el-input v-model="form.lic_address" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="成立日期">
                <el-input v-model="form.est_date" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="营业期限">
                <el-input v-model="form.biz_term" :disabled="true"></el-input><br/>
                <span class="font-red" v-if="form.org_cert_validity_notice">资质即将到期，请联系客服更新</span>
            </el-form-item>
            <el-form-item label="法人身份证电子版" style="max-width:800px">
                 <section class="img-box" v-for="(item,index) in (typeof form.rep_id_card=='string'? form.rep_id_card.split(','):'')" :key="index" @click="handleShowBigPic(item)"><img  class="cursor" :src="item"></section>
            </el-form-item>
            <el-form-item label="法定代表人姓名">
                <el-input v-model="form.rep_name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="法定代表人身份证号">
                <el-input v-model="form.rep_id" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="注册资本">
                <el-input v-model="form.reg_capital" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="经营范围">
                <el-input type="textarea" :rows="4" v-model="form.biz_scope" :disabled="true"></el-input>
            </el-form-item>
            <h1>组织机构代码信息</h1>
            <el-form-item label="组织机构代码证电子版" style="max-width:800px">
                <section class="img-box" v-for="(item,index) in (typeof form.org_cert_img=='string'? form.org_cert_img.split(','):'')" :key="index" @click="handleShowBigPic(item)"><img  class="cursor" :src="item"></section>
            </el-form-item>
            <el-form-item label="组织机构代码">
                <el-input v-model="form.org_code" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="组织机构代码证有效期">
                <el-input v-model="form.org_cert_validity" :disabled="true"></el-input><br/>
                <span class="font-red" v-if="form.org_cert_validity_notice">资质即将到期，请联系客服更新</span>
            </el-form-item>
            <h1>经营类目信息</h1>
            <table class="table-class">
                <tr>
                    <th>主营类目</th>
                    <th>详细类目</th>
                    <th>行业资质</th>
                    <th>到期日</th>
                </tr>
                <tr v-for="(item,index) in form.categories" :key="index">
                    <td>{{item.parent_name}}</td>
                    <td>{{item.name}}</td>
                    <td class="td-img"><img  class="cursor" :src="item.qualification_cert" @click="handleShowBigPic(item.qualification_cert)"></td>
                    <td>{{item.expiring_date}}</td>
                </tr>
            </table>
            <h1>品牌信息</h1>
            <table class="table-class">
                <tr>
                    <th>品牌名称</th>
                    <th>品牌授权证书</th>
                    <th>授权有效期</th>
                </tr>
                <tr v-for="(item,index) in form.brands" :key="index">
                    <td>{{item.cnName}}</td>
                    <td class="td-img"><img  class="cursor" :src="item.authorization_cert" @click="handleShowBigPic(item.authorization_cert)"></td>
                    <td>{{item.validity}}</td>
                </tr>
            </table>
            <h1>公司税务信息</h1>
            <el-form-item label="纳税人识别号">
                <el-input v-model="form.tax_no" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="纳税人类型">
                <el-input v-model="form.tax_type" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="纳税类型税码">
                <el-input v-model="form.tax_code" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="税务登记证电子版" style="max-width:800px">
                 <section class="img-box" v-for="(item,index) in (typeof form.tax_reg_cert=='string'? form.tax_reg_cert.split(','):'')" :key="index" @click="handleShowBigPic(item)"><img  class="cursor" :src="item"></section>
            </el-form-item>
            <el-form-item label="一般纳税人资格证电子版" style="max-width:800px">
                <section class="img-box" v-for="(item,index) in (typeof form.tax_qua_cert=='string'? form.tax_qua_cert.split(','):'')" :key="index" @click="handleShowBigPic(item)"><img  class="cursor" :src="item"></section>
            </el-form-item>
            <h1>开户银行许可证</h1>
            <el-form-item label="银行开户名">
                <el-input v-model="form.acc_name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="公司银行账号">
                <el-input v-model="form.acc_no" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="开户银行支行名称">
                <el-input v-model="form.acc_bank" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="开户银行支行所在地" style="max-width:800px" class="address-item">
                <el-input v-model="form.bank_province" :disabled="true"></el-input>
                <el-input v-model="form.bank_city" :disabled="true"></el-input>
                <el-input v-model="form.bank_area" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="银行开户许可证" style="max-width:800px">
                <section class="img-box" v-for="(item,index) in (typeof form.bank_permit=='string'? form.bank_permit.split(','):'')" :key="index" @click="handleShowBigPic(item)"><img  class="cursor" :src="item"></section>
            </el-form-item>
            <h1>双方合同</h1>
            <el-form-item label="" style="max-width:800px">
                <section class="img-box" v-for="(item,index) in (typeof form.contract_img=='string'? form.contract_img.split(','):'')" :key="index" @click="handleShowBigPic(item)"><img  class="cursor" :src="item"></section>
            </el-form-item>
        </el-form>
        <el-dialog center  title="图片预览" :visible.sync="dialogVisible" width="50%" >
            <img  class="cursor" :src="seeImg" alt="" style="width:100%">
            </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
      return {
        dialogVisible: false,
        seeImg:'',
          form: {
              tax_qua_cert:"",
              tax_reg_cert:"",
              rep_id_card:"",
              org_cert_img:"",
              lic_img:"",
              bank_permit:"",
              contract_img:"",
        },
      }
    },
    methods: {
      handleShowBigPic(imgUrl){
          this.seeImg=imgUrl;
         this.dialogVisible=true
      },
      getInfo(){
          this.$axios.post("/merchant/Merchant/myApplication")
          .then((res)=>{
            const _data=res.data;
            if(_data.code==0){
                this.form=(_data.data)
            }
          })
      }
    },
    created() {
        this.getInfo()
    },
  }
</script>
<style lang="scss">
    .my-admission-info-wrap{
        .font-red{
            color: #f00;
            margin-left: 48px;
        }
        .address-item{
            .el-input{
                float: left;
                width: 160px;
                margin-right: 10px;
            }
        }
        .table-class tr td.td-img{
            height:80px;
            width: auto;
            overflow: hidden;
        }
        h1{
                line-height: 50px;
                border-bottom: 1px solid #dfdfdf;
                margin-bottom: 30px;
                margin-left: 30px;
                padding-left: 30px;
                font-size: 18px;
                color: #409eff;
            }
        .el-form-item__label{
            // width: 160px  !important;
            margin-left: 50px;
        }
        .el-form-item__content{
            // margin-left: 160px !important;
        }
        .img-box{
            display: inline-block;
            width: 120px;
            height: 120px;
            margin-right: 15px;
        }
        .el-input,.el-textarea{
            max-width: 500px;
            input{border-radius: 4px;}
            textarea{
            resize: none;
            }
        }
        .table-class{
             width: 100%;
             max-width: 800px;
             font-size: 14px;
             margin-left: 50px;
            tr{
                border-left: 1px solid #b3d8ff;
                border-top: 1px solid #b3d8ff;
                width: 100%;
                th,td{
                    width: 25%;
                    border-right: 1px solid #b3d8ff;
                    border-bottom: 1px solid #b3d8ff;
                    line-height: 50px;
                    text-align: center;
                }
                th{
                    color: #409eff;
                    background: #ecf5ff;
                }
            }
        }
        .cursor{
            cursor: pointer;
        }
    }
</style>
