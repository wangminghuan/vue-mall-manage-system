<template>
  <div class="info-freight-add">
      <section class="com-content-head">
           <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb-nav">
            <el-breadcrumb-item :to="{ path: '/infoSet_freight_list' }">信息设置</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/infoSet_freight_list' }">运费模板</el-breadcrumb-item>
            <el-breadcrumb-item>{{isEdit?'编辑运费模板':'新建运费模板'}}</el-breadcrumb-item>
            </el-breadcrumb> 
            <h6>{{isEdit?'编辑运费模板':'新建运费模板'}}</h6>
      </section>
      <section class="com-content-body">
      <el-form :model="ruleForm" :rules="myRules" ref="ruleForm" label-width="100px">
      <el-form-item label="模板名称" prop="name">
        <el-input style="width:476px" v-model="ruleForm.name" placeholder="请输入模板名称"></el-input>
      </el-form-item>
      <el-form-item label="商品地址" prop="delivery_province">
         <citySelect v-model="cityCode" width="156"></citySelect>
      </el-form-item>
      <el-form-item label="" prop="delivery_address">
          <el-input style="width:476px" v-model="ruleForm.delivery_address" placeholder="请输入详细地址"></el-input>
      </el-form-item>
      <el-form-item label="发货时间" prop="delivery_limit">
        <el-select v-model="ruleForm.delivery_limit" placeholder="请选择"  style="width:476px;">
          <el-option
            v-for="(item,index) in limitOptions"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <p class="tips">（如实设定商品的发货时间，不仅可避免发货咨询和纠纷，还能促进成交！）</p>
      </el-form-item>
      <el-form-item label="计费规则" prop="rule_type">
        <el-radio v-model="ruleForm.rule_type" label="1">按件数计费</el-radio>
        <el-radio v-model="ruleForm.rule_type" label="2">按重量计费</el-radio>
        <div class="express-info">
            <span>默认运费</span><el-input v-model="ruleForm.first_quantity"></el-input><span>{{ruleForm.rule_type==1?'件':'千克'}}内</span><el-input v-model="ruleForm.first_price"></el-input><span>元，每增加</span><el-input v-model="ruleForm.additional_quantity"></el-input><span>{{ruleForm.rule_type==1?'件':'千克'}}，运费增加</span><el-input v-model="ruleForm.additional_price"></el-input><span>元</span>
            <p class="tips">除指定地区外，其他地区使用默认运费方式</p>
            </div>
     </el-form-item>
     <el-form-item label="">
            <el-button type="primary" style="margin-bottom:20px;" @click="handleAddRules('exceptional_rules',1)" plain>+为指定地区设置运费</el-button>
            <el-table
                :data="ruleForm.exceptional_rules"
                border
                class="my-table"
                height="250"
                style="width: 1038px">
                <el-table-column
                prop="sfr_provincesName"
                label="运送到"
                width="175">
                <template slot-scope="scope">
                    <span class="provice-cell" v-for="(item,index) in scope.row.province_names" :key="index">{{item}}</span>
                    <el-button @click="handleAddCity(scope.$index,'exceptional_rules')" type="text" size="small">编辑</el-button>
                </template>
                </el-table-column>
                <el-table-column
                prop="sfr_init_quantity"
                :label="ruleForm.rule_type==1?'首件（件）':'首重（千克）'"
                width="175">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.first_quantity"></el-input>
                </template>
                </el-table-column>
                <el-table-column
                prop="sfr_init_fee"
                label="首费（元）"
                width="175">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.first_price"></el-input>
                </template>
                </el-table-column>
                <el-table-column
                prop="sfr_add_quantity"
                :label="ruleForm.rule_type==1?'续件（件）':'续重（千克）'"
                width="175">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.additional_quantity"></el-input>
                </template>
                </el-table-column>
                <el-table-column
                prop="sfr_add_price"
                label="续费（元）"
                width="175">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.additional_price"></el-input>
                </template>
                </el-table-column>
                <el-table-column
                prop="address"
                label="操作">
                <template slot-scope="scope">
                    <el-button @click="handleDelect(scope.row,scope.$index,'exceptional_rules')" type="text" size="small" style="color:#fa5555">删除</el-button>
                </template>
                </el-table-column>
            </el-table>
        
      </el-form-item>
      <el-form-item label="">
            <el-button type="primary" style="margin-bottom:20px;" @click="handleAddRules('free_delivery_condition',2)" plain>+为指定条件包邮</el-button>
            <el-table
                :data="ruleForm.free_delivery_condition"
                border
                class="my-table"
                height="250"
                style="width: 1038px">
                <el-table-column
                prop="sfr_provincesName"
                label="运送到"
                width="200">
                <template slot-scope="scope">
                    <span class="provice-cell" v-for="(item,index) in scope.row.province_names" :key="index">{{item}}</span>
                    <el-button @click="handleAddCity(scope.$index,'free_delivery_condition')" type="text" size="small">编辑</el-button>
                </template>
                </el-table-column>
                <el-table-column
                prop="sfr_init_quantity"
                label="设置包邮条件"
                width="694">
                <template slot-scope="scope">
                    <el-select style="width:165px;margin:0 80px;" v-model="scope.row.type" placeholder="请选择条件">
                        <el-option
                        v-for="item in conditionOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <span v-if="scope.row.type==1">
                      <i>满&nbsp;</i><el-input style="width:165px" v-model="scope.row.quantity_volume"></el-input><i>&nbsp;件包邮</i>
                    </span>
                    <span v-else-if="scope.row.type==2">
                        <i>满&nbsp;</i><el-input style="width:165px" v-model="scope.row.amount_volume"></el-input><i>&nbsp;元包邮</i>
                    </span>
                    <span v-else-if="scope.row.type==3">
                        <i>满&nbsp;</i><el-input style="width:83px" v-model="scope.row.quantity_volume"></el-input><i>&nbsp;件，</i><el-input style="width:83px" v-model="scope.row.amount_volume"></el-input><i>&nbsp;元包邮</i>
                    </span>
                </template>
                </el-table-column>
                <el-table-column
                prop="address"
                label="操作">
                <template slot-scope="scope">
                  <el-button @click="handleDelect(scope.row,scope.$index,'free_delivery_condition')" type="text" size="small" style="color:#fa5555">删除</el-button>
                    <!-- <span class="el-icon-plus"></span>
                    <span class="el-icon-minus"></span> -->
                </template>
                </el-table-column>
            </el-table>
        
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="handleSave('ruleForm')">保存</el-button>
        <el-button type="primary" @click="handleCancel" plain>取消</el-button>
      </el-form-item>
      </el-form>
      <el-dialog
        title="选择城市"
        :visible.sync="centerDialogVisible"
        width="540px"
        center>
        <el-checkbox-group v-model="checkList">
            <el-checkbox 
            v-for="(item,index) in provinceArr" 
            :key="index"
            :label="item.re_name" 
            :value="item.re_id"
            :disabled="cityDisabledList.indexOf(item.re_name)>-1?true:false"
            ></el-checkbox>
       </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="hadnleSelectCity">确 定</el-button>
        </span>
        </el-dialog>
  
      </section>
  </div>
</template>
<script>
import citySelect from "../../common/citySelect";
export default {
  components:{
    citySelect
  },
  data() {
    //品牌名称
    var validateCheckExpress = (rule, value, callback) => {
      if (
        !this.ruleForm.first_quantity ||
        !this.ruleForm.first_price ||
        !this.ruleForm.additional_quantity ||
        !this.ruleForm.additional_price
      ) {
        callback(new Error("请将运费设置补充完善"));
      } else {
        callback();
      }
    };
    const validateCheckCity=(rule, value, callback) => {
      if (
        !this.ruleForm.delivery_province ||
        !this.ruleForm.delivery_city ||
        !this.ruleForm.delivery_area
      ) {
        callback(new Error("请选择商品所在地"));
      } else {
        callback();
      }
    };
    return {
      cityCode:{
           prov:'',
            city:'',
            region:''
      },
      isEdit: this.$route.query.id ? true : false,
      list: {},
      checkList: [],
      centerDialogVisible: false,
      nowAcive: [-1,""],
      cityDisabledList:[],
      ruleForm: {
        rule_type:"1",
        exceptional_rules:[],
        free_delivery_condition:[]
      },
      limitOptions:['24小时','3天','5天','不定'],
      myRules: {
        name: [
          { required: true, message: "请输入模板名称", trigger: "blur" }
        ],
        delivery_address:[
             { required: true, message: "请输入商品详细地址", trigger: "blur" }
        ],
        delivery_province:[
             { required: true, validator: validateCheckCity }
        ],
        delivery_limit:[
             { required: false, message: "请选择时间", trigger: "blur" }
        ],
        rule_type: [{ required: true,validator: validateCheckExpress}],
      },
      conditionOptions: [
        {
          value: 1,
          label: "件数"
        },
        {
          value: 2,
          label: "金额"
        },
        {
          value: 3,
          label: "件数+金额"
        }
      ]
    };
  },
  computed:{
    provinceArr(){
     let cityData,arr=[];
     if(localStorage.getItem("__city_code__")){
        cityData=JSON.parse(localStorage.getItem("__city_code__"));
        cityData.map((item)=>{
            if(item.re_level==1){
                arr.push(item)
            }
        })
        return arr
    }else{
      return []
    }
    }
  },
  watch:{
      cityCode(val){
          this.ruleForm.delivery_province=val.prov;
          this.ruleForm.delivery_city=val.city;
          this.ruleForm.delivery_area=val.region;
      }
  },
  methods: {
    handleCancel() {
      this.$router.push("/infoSet_freight_list");
    },
    //通过城市名称获取id
    useProviceNameGetId(nameArr) {
      let result = [];
      this.provinceArr.map((item, index) => {
        if (nameArr.indexOf(item.re_name) > -1) {
          result.push(item.re_id);
        }
      });
      return result;
    },
    //城市选择确定按钮
    hadnleSelectCity() {
      this.ruleForm[this.nowAcive[1]][this.nowAcive[0]].provinces=this.useProviceNameGetId(this.checkList);
      this.ruleForm[this.nowAcive[1]][this.nowAcive[0]].province_names=this.checkList;
      this.centerDialogVisible = false;
    },
    getAllHasSelectedCity(index,_key){
      //找到所有的已选城市，不包含自己选择的
      let result=[];
       this.ruleForm[_key].map((sitem,sindex)=>{
         if(index!=sindex)
          result=result.concat(sitem.province_names)
       })
       return result;

    },
    //点击表格运送到 编辑按钮
    handleAddCity(index,_key) {
      this.checkList=[];
      this.cityDisabledList=this.getAllHasSelectedCity(index,_key);
      this.ruleForm[_key][index].province_names.map((item)=>{
            this.checkList.push(item)
      })
      this.nowAcive=[index,_key];
      this.centerDialogVisible = true;
    },
    //添加指定地区运费
    handleAddRules(_key,type) {
      let obj=type==1?{
        additional_price:"",
        additional_quantity:"",
        first_price:"",
        first_quantity:"",
        provinces:[],
        province_names:[]
      }:{
        amount_volume:"",
        quantity_volume:"",
        type:1,
        provinces:[],
        province_names:[]
      }
      this.ruleForm[_key].push(obj)
    },
    //删除
    handleDelect(item, index, _key) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.ruleForm[_key].splice(index, 1);
      });
    },
    //提交
    handleSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //校验额外运费规则
          const exceptional=this.ruleForm.exceptional_rules||[];
          const free=this.ruleForm.free_delivery_condition||[];
          if(exceptional.length>0){
            for(let i=0;i<exceptional.length;i++){
              if(typeof exceptional[i].additional_price =="string"){
                exceptional[i].additional_price=exceptional[i].additional_price.replace(/\s+/,'');
              }
              if(typeof exceptional[i].additional_quantity =="string"){
                exceptional[i].additional_quantity=exceptional[i].additional_quantity.replace(/\s+/,'');
              }
              if(typeof exceptional[i].first_price =="string"){
                exceptional[i].first_price=exceptional[i].first_price.replace(/\s+/,'');
              }
              if(typeof exceptional[i].first_quantity =="string"){
                exceptional[i].first_quantity=exceptional[i].first_quantity.replace(/\s+/,'');
              }

              if(
               exceptional[i].provinces.length==0
              ||exceptional[i].additional_price==""
              ||exceptional[i].additional_quantity=="" 
              ||exceptional[i].first_price==""
              ||exceptional[i].first_quantity==""
              ){
                this.$message({
                  message: "请完善指定地区运费设置",
                  type: "warning"
                });
                return;
              }
            }
          }
          //校验免邮
          if(free.length>0){
            for(let i=0;i<free.length;i++){
              if(typeof free[i].quantity_volume =="string"){
              free[i].quantity_volume=free[i].quantity_volume.replace(/\s+/,'');
              }
              if(typeof free[i].amount_volume =="string"){
              free[i].amount_volume=free[i].amount_volume.replace(/\s+/,'');
              }
              if(
                free[i].provinces.length==0
                ||(free[i].type==1 && free[i].quantity_volume=="")
                ||(free[i].type==2&& free[i].amount_volume=="")
                ||(free[i].type==3&& (free[i].amount_volume=="" || free[i].quantity_volume=="") )){
                this.$message({
                  message: "请完善包邮设置",
                  type: "warning"
                });
                return;
              }
            }
          }
          
          const obj = {
            ...this.ruleForm
          };
          obj.free_delivery_condition=JSON.stringify(this.ruleForm.free_delivery_condition)
          obj.exceptional_rules=JSON.stringify(this.ruleForm.exceptional_rules)
          this.$axios
            .post(
              this.isEdit
                ? "/merchant/Freight/update"
                : "/merchant/Freight/add",
              obj
            )
            .then(res => {
              const _data = res.data;
              if (_data.code == 0) {
                this.$message({
                  message: "操作成功！",
                  type: "success"
                });
                setTimeout(() => {
                  this.$router.push({
                    path: "/infoSet_freight_list"
                  });
                }, 1000);
              }
            });
          return false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //获取数据
    enquiriesFunction() {
      this.$axios
        .post("/merchant/Freight/get", { f_id: this.$route.query.id })
        .then(res => {
          const _data = res.data;
          if (_data.code == 0) {
             let _obj={}
             _obj.f_id=_data.data.f_id;
             _obj.name=_data.data.name;
             _obj.rule_type=_data.data.rule_type+'';
             _obj.first_price=_data.data.first_price;
             _obj.first_quantity=_data.data.first_quantity;
             _obj.additional_price=_data.data.additional_price;
             _obj.additional_quantity=_data.data.additional_quantity;
             _obj.delivery_address=_data.data.delivery_address;
             _obj.delivery_limit=_data.data.delivery_limit;
             _obj.exceptional_rules=_data.data.exceptional_rules||[];
             _obj.free_delivery_condition=_data.data.free_delivery_condition||[];
             _obj.delivery_province=_data.data.delivery_province||"";
             _obj.delivery_city=_data.data.delivery_city||"";
             _obj.delivery_area=_data.data.delivery_area||"";
              this.ruleForm = _obj;
              this.cityCode={
                prov:parseInt(_data.data.delivery_province),
                city:parseInt(_data.data.delivery_city),
                region:parseInt(_data.data.delivery_area)
              }
          }
        })
    }
  },
  created() {
      if(this.isEdit){
          this.enquiriesFunction();
      }
  }
};
</script>
<style lang="scss">
.info-freight-add {
  .provice-cell {
    margin-right: 10px;
  }
  .el-checkbox {
    margin-left: 30px;
    width: 80px;
    margin-bottom: 10px;
  }
  .el-input input {
    border-radius: 6px;
  }
  .my-table {
    thead th {
      background: #ecf5ff;
      color: #353535;
      font-weight: normal;
    }
  }
  .el-table__body-wrapper {
    overflow-x: auto;
  }
  .express-info {
    .el-input {
      width: 90px;
      margin: 0 10px;
    }
  }
  .tips {
    color: #ccc;
    font-size: 12px;
    line-height: 32px;
  }
  .opera-btn {
    .cell {
      text-align: center;
    }
    span {
      font-size: 20px;
      font-weight: bold;
      color: #4a9fff;
    }
    span:nth-of-type(2) {
      margin-left: 10px;
    }
  }
}
</style>