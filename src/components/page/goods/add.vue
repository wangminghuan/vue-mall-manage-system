<!--
  添加商品
-->
<template>
  <div class="goods-add-wrap">
    <section class="com-content-head">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb-nav">
        <el-breadcrumb-item :to="{ path: '/goods_add' }">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{isEdit?'编辑商品':'添加商品'}}</el-breadcrumb-item>
        </el-breadcrumb> 
        <h6>{{isEdit?'编辑商品':'添加商品'}}</h6>
    </section>
    <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="com-content-body">
      <el-form-item label="商品名称"  prop="g_name">
        <el-input v-model="ruleForm.g_name" maxlength="60" placeholder="请输入商品名称（如：ins流行包包 夏季热卖）"></el-input>
      </el-form-item>
      <el-form-item label="副标题" prop="g_subtitle">
        <el-input v-model="ruleForm.g_subtitle" placeholder="请输入副标题（如：中秋节送礼佳品）"></el-input>
      </el-form-item>
      <el-form-item label="经营类目" prop="c_id">
       <el-select v-model="ruleForm.c_id" placeholder="请选择分类">
          <el-option
            v-for="item in goodsList"
            :key="item.c_id"
            :label="item.name"
            :value="item.c_id">
          </el-option>
        </el-select> 
      </el-form-item>
      <el-form-item label="商品图片" prop="g_images">
        <ul v-if="ruleForm.g_images" class="img-arr clearfix el-upload-list--picture-card">
                 <li 
                  v-for="(item,index) in ruleForm.g_images.split(',')" 
                  :key="index">
                  <span class="el-upload-list__item-actions"><span class="el-upload-list__item-preview"><i class="el-icon-zoom-in" @click="handlePictureCardPreview(item)"></i></span><span class="el-upload-list__item-delete"><i class="el-icon-delete"  @click="handleRemove(index)"></i></span></span>
                  <img 
                  :src="item">
                 </li>
        </ul>
        <div class="el-upload el-upload--picture-card" @click="handleSelctePic">
              <i class="el-icon-plus"></i>
         </div>
          <vue-crop-upload 
            field="file"
            @crop-upload-success="imgUpLoadSuccess"
            v-model="showCrop"
            :noCircle="hideCircle"
            :width="600"
            :height="600"
            :url="uploadUrl"
            :params="uploadParams"
            :langExt="langZh"
            img-format="png"></vue-crop-upload>
     </el-form-item>
      <el-form-item label="产品描述" prop="g_description">
         <quill-editor 
                style="width:600px;height:300px;margin-bottom:80px" 
                v-model="ruleForm.g_description"  
                ref="myTextEditor"  
                :options="editorOption"  
                @change="onChange">  
        </quill-editor> 
      </el-form-item>
      <el-form-item label="产品规格" prop="specs_arr">
        <el-button @click="addRules" type="primary">添加规格</el-button>
        <!-- <el-button @click="handleClickRenderTable" type="success">生成表格</el-button> -->
        <!-- 规格标签展示 -->
        <ul class="my-specs-wrap">
          <li v-for="(item,index) in mySpecList" :key="index">
            <el-tag class="tag-title" 
            closable 
            @close="handleCloseTag(item,index,1)">{{item.spec}}<b class="el-icon-arrow-right"></b></el-tag>
            <el-tag
              :key="tag"
              v-for="tag in item.spec_title"
              closable
              :disable-transitions="false"
              @close="handleCloseTag(tag,index,2)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="item.inputVisible"
              style="width:80px;vertical-align:middle"
              v-model="item.inputValue"
              :ref="'saveTagInput'+index"
              size="small"
              @keyup.enter.native="handleInputConfirm(index)"
              @blur="handleInputConfirm(index)">
            </el-input>
           <el-button v-else class="button-new-tag" size="small" @click="()=>showInput(index)">+添加规格值</el-button>
          </li>
        </ul>
        <!-- 规格表单展示 -->
          <specTable 
          :renderTable="renderSpecTable"
          ></specTable>
        <!-- 规格表单结束 -->
      </el-form-item>
      <el-form-item label="店铺分类" v-if="!isApply" prop="gc_id">
         <el-cascader
            v-model="ruleForm.gc_id"
            :change-on-select='true'
            :show-all-levels="false"
            :props="mainProps"
            :options="shopCateList"
          ></el-cascader>
      </el-form-item>
      <el-form-item label="市场价" prop="g_price">
        <el-input v-model="ruleForm.g_price" placeholder="请输入产品市场价">
          <i slot="suffix">元</i>
        </el-input>
      </el-form-item>
      <el-form-item label="商品标签" prop="g_tags">
        <el-tag
            :key="tag"
            v-for="tag in ruleForm.g_tags"
            closable
            :disable-transitions="false"
            @close="handleCloseGoodTag(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            style="width:80px;vertical-align:middle"
            v-if="inputGoodVisible"
            v-model="inputGoodValue"
            ref="saveGoodTagInput"
            size="small"
            @keyup.enter.native="handleInputGoodConfirm"
            @blur="handleInputGoodConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showGoodInput">+请输入标签</el-button>
      </el-form-item>
      <el-form-item label="运费设置" prop="has_postage">
        <el-radio v-model="ruleForm.has_postage" label="0">快递</el-radio>
        <el-radio v-model="ruleForm.has_postage" label="1">包邮</el-radio>
      </el-form-item>
      <!-- <section v-show="ruleForm.has_postage=='0'"> -->
      <el-form-item label="" prop="f_id">
        <el-select v-model="ruleForm.f_id" :disabled="ruleForm.has_postage=='1'?true:false" placeholder="请选择运费模板">
          <el-option
            v-for="item in freightList"
            :key="item.f_id"
            :label="item.name"
            :value="item.f_id">
          </el-option>
        </el-select>
        <el-button type="primary" @click="jumpShopFreight" style="margin-left:10px">+添加运费模板</el-button>
      </el-form-item>
      <el-button type="primary" @click="handleClickSave('ruleForm')" class="form-btn" style="margin-left:58px ">提交审核</el-button>
      <el-button type="primary" plain @click="handleClickPreview('ruleForm')" class="form-btn">预览</el-button>
      <el-button type="primary" plain @click="handleClickCancel" class="form-btn">取消</el-button>
    </el-form>
    <el-dialog 
       title="添加规格"
       width="500px"
       :visible.sync="centerDialogVisible"
       class="add-spec-dialog"
       @close="addSpecDialogClose"
       center>
      <div>
          <section>
            <h5>我的规格</h5>
            <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleCloseTag(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              style="width:80px;vertical-align:middle"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm">
            </el-input>
           <el-button v-else class="button-new-tag" size="small" @click="()=>showInput()">+添加标签</el-button>
          </section>

          <section>
            <h5>常用规格</h5>
            <el-tag 
             :key="tag"
             type="success"
             v-for="tag in normalTags"
             ><span @click="handleAddTag(tag)" style="cursor:pointer">{{tag}}</span></el-tag>
          </section>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleChooseSpec">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 预览图对话框 -->
     <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
     </el-dialog>
     <!-- 预览添加商品弹框 -->
    <el-dialog :visible.sync="dialogVisibleSeeGoods" width="400px" class="preview-dialog">
      <div class="iframe-box" v-loading="loading">
        <div class="iframe-phone">
          <iframe name="myiframe" style="width:100%;height:580px" id="iframeId" ref="iframedata" :src="iframeUrl"></iframe>
        </div>
      </div>
    </el-dialog>
  </div>  
</template>
<script>
import specTable from "./specTable";
export default {
  components: {
    specTable
  },
  //数据
  data() {
    const that = this;
    var validateCheckSpecsArr = (rule, value, callback) => {
      if (
        this.isEdit &&
        this.renderSpecTable.spec_title.length == 0 &&
        this.renderSpecTable.specs.length == 0 &&
        this.renderSpecTable.spec_title_default.length == 0
      ) {
        callback(); //编辑时，如果不修改规格就不校验
      } else if (
        this.renderSpecTable.spec_title &&
        this.renderSpecTable.spec_title.length > 0
      ) {
        callback();
      } else {
        callback(new Error("请选择产品规格"));
      }
    };
    var validateCheckFid=(rule, value, callback)=>{
      //选择快递
       if(this.ruleForm.has_postage=="0" && !this.ruleForm.f_id){
         callback(new Error("请选择运费模板"));
       }else{
         callback();
       }
    }
    var serviceShopVerification=(rule, value, callback)=>{
      //选择快递
       if(!this.isApply && this.ruleForm.gc_id==''){
         callback(new Error("请选择店铺分类"));
       }else{
         callback();
       }
    }
    //  this.isApply: //是否为服务商，服务商店铺分类不展示，且不验证,在全局
    return {
      isApply:window.$isApply,
      isModify:false,//是否修改了规格表格
      loading:true,
      dialogVisibleSeeGoods:false, //ifame弹框
      ifamedata:{
        goods:{
          g_name:'',
          g_price:'',
          g_subtitle:'',
          g_images:'',
          g_description:''
        },
        goods_sku:[],
        goods_coupon:[],
        goods_spec:[]
      },
      iframeUrl:'//m.newgiftmall.com'+(window.location.port?':8001':'')+'/index/detail?id=1&preview=1', //ifame地址
      ableSelectAny:false,
      isEdit: this.$route.query.id ? true : false,
      uploadUrl: that.$uploadUrl,
      uploadParams: {
        imagePath: "goods",
         token:sessionStorage.getItem("__token__")
      },
      hideCircle: true,
      langZh: that.$uploadLangZh,
      showCrop: false,
      editorOption: {
        content: "",
        uploadUrl: that.$uploadUrl,
        placeholder: "请输入内容",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"], // toggled buttons
            // ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }],
            // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            // [{ 'direction': 'rtl' }],                         // text direction
            [{ size: ["small", false, "large", "huge"] }], // custom dropdown
            // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            // [{ 'font': [] }],
            [{ align: [] }],
            // ['clean']                                         // remove formatting button
            ["image"]
          ]
        }
      },
      dialogVisible: false,
      props: {
        value: "value",
        children: "children"
      },
      dialogImageUrl: "",
      anytype:'', // 控制商品标签不能重复
      labelPosition: "right",
      centerDialogVisible: false,
      goodsList: [], //经营类目
      shopCateList:[],//店铺分类
      freightList: [], //运费模板
      dynamicTags: [], //我的规格标签
      normalTags: [], //常用标签
      inputVisible: false,
      inputGoodVisible: false,
      inputValue: "",
      inputGoodValue: "",
      mySpecList: [],
      mainProps: {
        value: "gc_id",
        label: "gc_name",
        children: "child"
      },
      renderSpecTable: {
        specs: [], //规格名称
        spec_title: [], //规格属性
        spec_title_default: [], //规格属性组合
        spec_sku_price: [], //商品价格
        spec_stock_num: [], //商品库存
        spec_sku_nweight: [], //商品重量
        spec_sku_volume: [], //商品体积
        sku_ids:[],//sku id
      },
      origin_sku_obj:{//原始sku数据
      },
      ruleForm: {
        has_postage: "0",
        g_images: "",
        gc_id:[],
        specs_arr: [],
        g_tags:[]
      },

      rules: {
        g_name: [
          { required: true, message: "请输入产品名称", trigger: "blur" },
           { min: 1, max: 60, message: '字数不能超过60个字符', trigger: 'blur' }
        ],
        g_subtitle: [
          { required: false, message: "请输入产品副标题", trigger: "blur" },
           { min: 1, max: 60, message: '字数不能超过60个字符', trigger: 'blur' }
        ],
        g_description: [
          { required: false, message: "请输入产品描述", trigger: "blur" },
          { min: 1, max: 5000, message: '字数不能超过5000个字符', trigger: 'blur' }
        ],
        c_id: [
          { required: true, message: "请选择经营类目", trigger: "change" }
        ],
        gc_id: [
          {required: true,validator: serviceShopVerification}
        ],
        g_images: [
          { required: true, message: "请上传至少1张商品图片", trigger: "change" }
        ],
        g_price: [
          { required: true, message: "请输入产品价格", trigger: "blur" }
        ],
        has_postage: [{ required: true}],
        f_id:[{validator: validateCheckFid}],
        specs_arr: [{ required: true, validator: validateCheckSpecsArr }]
      }
    };
  },
  //执行事件
  methods: {
    //商品标签添加
    showGoodInput(){
        this.inputGoodVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveGoodTagInput.$refs.input.focus();
        });
    },
    //商品标签确定
    handleInputGoodConfirm(){
        let inputValue = this.inputGoodValue;
        let that = this;
        if (inputValue.replace(/\s+/,'').length>0 && inputValue.replace(/\s+/,'').length<6) {
          that.ruleForm.g_tags.push(inputValue);
        }else{
           this.$message({
            message: "字数为1-5个字符",
            type: "warning"
          });
        }
        this.inputGoodVisible = false;
        this.inputGoodValue = '';
    },
    //商品标签关闭
    handleCloseGoodTag(tag){
        this.ruleForm.g_tags.splice(this.ruleForm.g_tags.indexOf(tag), 1);
    },
    //取消
    handleClickCancel() {
      window.history.go(-1);
    },
    //上传图片
    handleSelctePic() {
      if( typeof this.ruleForm.g_images =="string" && this.ruleForm.g_images.split(",").length>3){
           this.$message({
            message: "超出上传数量限制",
            type: "warning"
          });
           return
      }
      this.showCrop = !this.showCrop;
    },
    onChange() {
      this.$emit("input", this.ruleForm.content);
    },
    /*选择上传图片切换*/

    onFileChange(e) {
      var self = this;
      var fileInput = e.target;
      if (fileInput.files.length == 0) {
        return;
      }
      this.editor.focus();
      // console.log(fileInput.files[0].size)
      if (fileInput.files[0].size > 1024 * 1024) {
        this.$alert("图片不能大于1M", "图片尺寸过大", {
          confirmButtonText: "确定",
          type: "warning"
        });
      }
      var data = new FormData();
      this.$message("图片上传中...");
      data.append("file", fileInput.files[0]);
      data.append("imagePath", this.uploadParams.imagePath);
      data.append("token", this.uploadParams.token);
      this.$axios
        .post(this.editorOption.uploadUrl, data)
        .then(res => {
          if (res.data.code == 0) {
            this.$message({
              message: "上传成功",
              type: "success"
            });
            this.editor.insertEmbed(
              this.editor.getSelection().index,
              "image",
              res.data.data.url
            );
          } else {
            this.$message({
              message: "上传失败",
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "上传失败",
            type: "warning"
          });
        });
    },
    /*点击上传图片按钮*/

    imgClick() {
      if (!this.editorOption.uploadUrl) {
        console.log("no editor editorOption.uploadUrl");
        return;
      }
      /*内存创建input file*/

      var input = document.createElement("input");
      input.type = "file";
      input.name = this.fileName;
      input.accept = "image/jpeg,image/png,image/jpg,image/gif";
      input.onchange = this.onFileChange;
      input.click();
    },
    //添加规则关闭时的回调
    addSpecDialogClose(flag) {
      console.log("close");
    },
    getMultiArrCombine(arr) {
      // //执行排列组合算法
      var len = arr.length;
      // 当数组大于等于2个的时候
      if (len >= 2) {
        // 第一个数组的长度
        var len1 = arr[0].length;
        // 第二个数组的长度
        var len2 = arr[1].length;
        // 2个数组产生的组合数
        var lenBoth = len1 * len2;
        //  申明一个新数组
        var items = new Array(lenBoth);
        // 申明新数组的索引
        var index = 0;
        for (var i = 0; i < len1; i++) {
          for (var j = 0; j < len2; j++) {
            if (arr[0][i] instanceof Array) {
              items[index] = arr[0][i].concat(arr[1][j]);
            } else {
              items[index] = [arr[0][i]].concat(arr[1][j]);
            }
            index++;
          }
        }
        var newArr = new Array(len - 1);
        for (var i = 2; i < arr.length; i++) {
          newArr[i - 1] = arr[i];
        }
        newArr[0] = items;
        return this.getMultiArrCombine(newArr);
      } else {
        return arr[0];
      }
    },
    //生成表格
    handleClickRenderTable(isModify) {
      this.isModify=isModify; //是否修改了表格
      let combin = [],
        spec_title = [],
        specs = [],
        price = [],
        nums = [],
        nweight = [],
        id=[],
        volume = [];
      this.mySpecList.map((item, index) => {
        //只有规格有值的时候才认为是有效值
        if (item.spec_title.length > 0) {
          combin.push(item.spec_title);
          spec_title.push(item.spec_title);
          specs.push(item.spec);
        }
      });
      const _combine = this.getMultiArrCombine(combin) || [];

      //设定价格和数量的存储地址
      _combine.map((item, index) => {
        price[index] = this.origin_sku_obj.price && typeof this.origin_sku_obj.price[index]!=="undefined" ?this.origin_sku_obj.price[index]:"0";
        nums[index] =this.origin_sku_obj.nums && typeof this.origin_sku_obj.nums[index]!=="undefined" ?this.origin_sku_obj.nums[index]:"0";
        nweight[index] =this.origin_sku_obj.nweight && typeof this.origin_sku_obj.nweight[index]!=="undefined" ?this.origin_sku_obj.nweight[index]:"0";
        volume[index] = this.origin_sku_obj.volume && typeof this.origin_sku_obj.volume[index]!=="undefined" ?this.origin_sku_obj.volume[index]:"0";
        id[index] =this.origin_sku_obj.id && typeof this.origin_sku_obj.id[index]!=="undefined" ?this.origin_sku_obj.id[index]:"0";
      });
      const fianlCombin = this.getMultiArrCombine(combin)||[];
      this.renderSpecTable.spec_title = spec_title; //规格属性
      this.renderSpecTable.specs = specs;
      this.renderSpecTable.spec_sku_price = price;
      this.renderSpecTable.spec_stock_num = nums;
      this.renderSpecTable.spec_sku_nweight = nweight;
      this.renderSpecTable.spec_sku_volume = volume;
      this.renderSpecTable.sku_ids = this.isModify?[]:id;
      if (fianlCombin[0] instanceof Array) {
        this.renderSpecTable.spec_title_default = fianlCombin;
      } else {
        this.renderSpecTable.spec_title_default = fianlCombin.map(item => {
          return [item];
        });
      }
    },
    findTagsIndex(item) {
      //标签添加时的去重
      for (let i = 0; i < this.mySpecList.length; i++) {
        if (this.mySpecList[i].spec == item) {
          return i;
        }
      }
      return -1;
    },
    //添加规格确定按钮
    handleChooseSpec() {
      let arr = [];
      this.dynamicTags.map(item => {
        //去重
        const _index=this.findTagsIndex(item);
        if (_index == -1) {
          this.mySpecList.push({
            spec: item,
            spec_title: [],
            inputVisible: false,
            inputValue: ""
          });
        }
      });
      this.centerDialogVisible = false;
    },
    //点击常用规格添加
    handleAddTag(tag) {
      this.dynamicTags.push(tag);
    },
    getNormal() {
      this.$axios.post("/merchant/Goods/getLastSpecName").then(res => {
        const _data = res.data;
        if (_data.code == 0) {
          this.normalTags =
            _data.data instanceof Array && _data.data[0]
              ? _data.data[0].split(",")
              : [];
        }
      });
    },
    handleCloseTag(tag, index, type) {
      //后两个参数存在则说明是操作下面表格的
      if (type == 1) {
        //删除规格
        this.mySpecList.splice(index, 1);
        this.dynamicTags.splice(index, 1);
        this.handleClickRenderTable(true);
      } else if (type == 2) {
        //删除规格下属性
        let item = this.mySpecList[index];
        item.spec_title.splice(item.spec_title.indexOf(tag), 1);
        this.mySpecList.splice(index, 1, item);
        this.handleClickRenderTable(true);
      } else {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      }
    },

    showInput(index) {
      if (typeof index == "number") {
        this.mySpecList[index].inputVisible = true;
        this.$nextTick(_ => {
          this.$refs["saveTagInput" + index][0].$refs.input.focus();
        });
      } else {
        if (this.dynamicTags.length == 5) {
          this.$message({
            message: "超出最大限制！",
            type: "warning"
          });
          return false;
        }
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      }
    },

    handleInputConfirm(index) {
      if (typeof index == "number") {
        //我的添加规格页面
        let inputValue = this.mySpecList[index].inputValue;
        if (inputValue) {
          this.mySpecList[index].spec_title.push(inputValue);
        }
        this.mySpecList[index].inputVisible = false;
        this.mySpecList[index].inputValue = "";
        this.handleClickRenderTable(true); //创建表格
      } else {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = "";
      }
    },
    jumpShopFreight() {
      this.$router.push("/infoSet_freight_detail");
    },
    getgoodsList() {
      this.$axios.post("/merchant/Merchant/getCategory").then(res => {
        const _data = res.data;
        if (_data.code == 0) {
          this.goodsList = _data.data;
        }
        
      });
    },
    getFreightList(){
      this.$axios.post("/merchant/Freight/all").then(res => {
        const _data = res.data;
        if (_data.code == 0) {
          this.freightList =_data.data;
        }
      });
    },
    getShopCateList() {
      this.$axios.post("/merchant/GoodsClass/getList").then(res => {
        const _data = res.data;
        if (_data.code == 0) {
          let _arr=[];
          _data.data.map((item)=>{
            let obj={
              gc_id:item.parent.gc_id,
              gc_name:item.parent.gc_name,
            }
            if(item.child &&  item.child  instanceof Array && item.child.length>0) obj.child=item.child;
             _arr.push(obj)
          })
          this.shopCateList =_arr
        }
      });
    },
    //数组去重
    arrayIndexof(item){
      let arr = [],isshow=true;
      for(let i=0;i<item.length;i++){
        if(arr.indexOf(item[i]) == -1){
          arr.push(item[i]);
          isshow=true;
        }else{
          isshow= false;
        }
      }
      return isshow;
    },
    submitAddData(obj) {
      let array = obj.g_tags.split(',');
      this.anytype = this.arrayIndexof(array);
      if(this.anytype){
        this.$axios
        .post("/merchant/Goods/addEdit",obj)
        .then(res => {
          const _data = res.data;
          if (_data.code == 0) {
            this.$message({
              message: this.isEdit
                ? "恭喜你，修改成功！"
                : "恭喜你，添加成功！",
              type: "success"
            });
            setTimeout(() => {
              this.$router.push({ path: "/goods_my_list" });
            }, 100);
          } 
        });
      }else{
        this.$message({
          type: 'warning',
          message: '商品标签名称不能重复'
        })
      }
    },
    //保存提交
    handleClickSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let obj = {
            g_name:this.ruleForm.g_name,
            g_subtitle:this.ruleForm.g_subtitle,
            g_description:this.ruleForm.g_description,
            g_tags:this.ruleForm.g_tags.join(","),
            gc_id:this.ruleForm.gc_id[this.ruleForm.gc_id.length-1],
            f_id:this.ruleForm.f_id,
            c_id:this.ruleForm.c_id,
            g_price:this.ruleForm.g_price,
            g_images:this.ruleForm.g_images,
            specs_data:JSON.stringify(this.renderSpecTable)
          };
          if (this.isEdit) obj.g_id = this.$route.query.id;
            this.submitAddData(obj);
          return false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //预览
    handleClickPreview(formName) {
      
      const that = this;
      this.ifamedata.goods.g_name = this.ruleForm.g_name //名称
      this.ifamedata.goods.g_price = this.ruleForm.g_price //价格
      this.ifamedata.goods.g_subtitle = this.ruleForm.g_subtitle //副标题
      this.ifamedata.goods.g_images = this.ruleForm.g_images //图片
      this.ifamedata.goods.g_description = this.ruleForm.g_description //图片描述
      this.ifamedata.goods.g_salenum = this.ruleForm.g_salenum //销量
      var specdataDATA = JSON.stringify(this.renderSpecTable);
      var specdata = JSON.parse(specdataDATA)
      // console.log(specdata)
      var arraypp = [],goods_sku=[];
      //合成规格数据
      for(let i=0;i<specdata.specs.length;i++){
        var arraypp = specdata.spec_title[i];
        var h = [];
        for(var j=0;j<arraypp.length;j++){
          h.push({
            'gsv_name':arraypp[j],
            'gsv_id':(i+""+j)
            }); 
        }
        this.ifamedata.goods_spec.push({
          'spec':specdata.specs[i],
          'spec_value':h});
      }
      //合成每个组合的价格数据
      for(let i=0;i<specdata.spec_sku_price.length;i++){
        let arr=[];
        specdata.spec_title_default[i].map((item)=>{
          for(let k=0;k<specdata.spec_title.length;k++){
                 let temp=specdata.spec_title[k].indexOf(item)
                 if(temp>-1){
                   arr.push(k+''+temp)
                   break;
                 }
          }
          
        })
         this.ifamedata.goods_sku.push({
             'sku_price':specdata.spec_sku_price[i]||"0",
             'sku_stock_num':specdata.spec_stock_num[i]||"0",
             'gsv_ids':arr.join(",")
           });
      }
      this.$refs[formName].validate(valid=>{
        if(valid){
          that.dialogVisibleSeeGoods = true; //显示预览弹框
          setTimeout(()=>{
            this.loading = false;
            let domifame = document.getElementById('iframeId');
            domifame.onload = function(){
              domifame.contentWindow.postMessage(that.ifamedata,'*');
            }
          },0)
        }else{
          console.log("error submit!!");
          return false;
        }
      })
    },
    //上传成功后的回调
    imgUpLoadSuccess(res) {
      let that = this;
      let arr = this.ruleForm.g_images.split(",");
      if (arr.length == 1 && arr[0] == "") arr = [];
      arr.push(res.data.url);
      this.ruleForm.g_images = arr.join(",");
      let backStepDom = document.getElementsByClassName('vicp-operate')[1].childNodes[0];
      if(backStepDom){
        let parentDom = document.getElementsByClassName('vicp-operate')[1];
        let parentChid = document.getElementsByClassName('vicp-operate')[1].childNodes[0];
        parentDom.removeChild(parentChid)
      }
    },
    //删除图片
    handleRemove(index) {
      let arr = this.ruleForm.g_images.split(",");
      arr.splice(index, 1);
      this.ruleForm.g_images = arr.join(",");
    },
    handlePictureCardPreview(url) {
      //大图预览
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    //添加规格
    addRules() {
      this.centerDialogVisible = true;
    },
    //原始数据回填
    getDataFunction() {
      this.$axios
        .post("/merchant/Goods/getDetail", { g_id: this.$route.query.id })
        .then(res => {
          const _data = res.data;
          if (_data.code == 0) {
            // this.ruleForm=_data.data;
            const renderData=_data.data||{};
            // this.ifamedata = renderData;
            let result={},gidArr=renderData.gc_id.toString().split(",");
            result.has_postage=renderData.f_id && renderData.f_id!="0"?"0":"1"; //0 快递，1包邮
            result.g_name=renderData.g_name;
            result.g_subtitle=renderData.g_subtitle;
            result.g_description=renderData.g_description;
            result.gc_id=gidArr.map((item)=>{return parseInt(item)});
            result.g_images=renderData.g_images;
            result.g_price=renderData.g_price;
            result.g_tags=renderData.g_tags!=""?renderData.g_tags.split(","):[];
            result.f_id=renderData.f_id;
            result.c_id=renderData.c_id+'';
            result.g_salenum=renderData.g_salenum||"0";
            this.ruleForm=result;
            //回填原始sku 数据
            this.origin_sku_obj=this.getOriginSku(renderData.goods_sku);
             //回填原始表格
            this.mySpecList=this.getOriginSpec(renderData.goods_spec);
            this.handleClickRenderTable(false); //创建表格
          }
        });
    },
    getOriginSku(skuArr){
      let  result={
        id:[],
        price:[],
        nweight:[],
        volume:[],
        nums:[]
      };
      if(skuArr && skuArr instanceof Array){
        skuArr.map((item)=>{
             result.id.push(item.sku_id);
             result.price.push(item.sku_price+'')
             result.nweight.push(item.sku_nweight+'')
             result.volume.push(item.sku_volume+'')
             result.nums.push(item.sku_stock_num+'')
        })
        
      }
      return result;
    },
    //将原始数据的规格拼接为需要的数据格式,含标签的回填
    getOriginSpec(specArr){
      let  result=[];
      if(specArr && specArr instanceof Array){
        
        specArr.map((item)=>{
            let spec_title=[];
            item.spec_value.map((sitem)=>{
              spec_title.push(sitem.gsv_name)
            })
            result.push({
              inputValue:"",
              inputVisible:false,
              spec:item.spec,
              spec_title:spec_title
            })
            this.dynamicTags.push(item.spec)
        })
    } 
    return result
    }
  },
  created() {
    this.getgoodsList();//经营类目
    this.getShopCateList();//店铺分类
    this.getFreightList();//运费模板
    this.getNormal();
    // //类表编辑回填数据
    this.isEdit && this.getDataFunction();
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill;
    },
    hasPostage() {
      return this.ruleForm.has_postage;
    }
  },
  watch: {
    hasPostage(val) {
      if (val == "1") {
        this.ruleForm.f_id = "";
      }
    },
  },
  mounted() {
    this.$refs.myTextEditor.quill
      .getModule("toolbar")
      .addHandler("image", this.imgClick);
  }
};
</script>

<style lang="scss">
.goods-add-wrap {
  .ql-snow .ql-picker {
    height: auto;
  }
  .img-arr li {
    float: left;
    width: 148px;
    margin: 20px 10px 20px 0;
    position: relative;
    .close {
      position: absolute;
      height: 20px;
      width: 20px;
      right: -10px;
      top: -10px;
      background-size: 20px auto;
      background-repeat: no-repeat;
    }
  }
  .add-spec-dialog {
    h5 {
      margin-bottom: 20px;
      margin-top: 10px;
    }
  }
  .my-specs-wrap {
    margin-top: 20px;
    .el-tag {
      margin-bottom: 20px;
      background-color: rgba(64, 158, 255, 0);
    }
    .tag-title {
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      position: relative;
      margin-right: 50px;
      background-color: rgba(64, 158, 255, 0.1);
      b.el-icon-arrow-right {
        height: 20px;
        width: 20px;
        position: absolute;
        right: -40px;
        top: 50%;
        margin-top: -10px;
      }
    }
  }
  .el-tag {
    margin-right: 10px;
  }
  .el-tag {
    margin-bottom: 10px;
  }
  .button-new-tag {
    // margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  textarea {
    resize: none;
  }
  .form-btn {
    width: 134px;
    margin-top: 40px;
    // margin: 58px 0 120px 100px;
  }
  .el-input {
    width: 330px;
  }
  .el-input__inner {
    border-radius: 6px;
  }
  .el-input__suffix-inner {
    color: #353535;
    margin-right: 10px;
  }
  .add-descript {
    width: 250px;
    height: 250px;
    border: 1px solid #ccc;
  }
  .pic-font {
    color: #ccc;
  }
  .item-btm em {
    font-size: 12px;
    color: #878d99;
    margin-right: 15px;
  }
  .city-select-wrap {
    .el-input {
      width: 106px;
    }
  }
  .iframe-box{
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    align-items:center;
    justify-content: center;
    .iframe-phone{
      // margin:20px 100px 0;
      background-image:url("../../../../static/img/phone_icon.png");
      background-repeat:no-repeat;
      background-size:100%;
      height: 867px;
      padding:100px 16px;
      box-sizing:border-box;
      width: 100%;
      overflow: hidden;
    }
  }
  .preview-dialog .el-dialog{
    border-radius: 60px;
    .el-dialog__header{
    display: none;
    }
    .el-dialog__body{
      padding: 0;
    }
  }
  
  .quill-editor{
    h1{font-size:2em; margin:.67em 0}
    h2{font-size:1.5em; margin:.75em 0}
    h3{font-size:1.17em; margin:.83em 0}
    h5{font-size:.83em; margin:1.5em 0}
    h6{font-size:.75em; margin:1.67em 0}
    h1,h2,h3,h4,h5,h6,b,strong{font-weight:bold}
    h4,p,blockquote,ul,fieldset,form,ol,dl,dir,menu{margin:1.12em 0}
    ul, ol, li{display:list-item;list-style:decimal}
    table{border-spacing:2px;}
    thead,tbody,tfoot{vertical-align:middle}
    td,th{vertical-align:inherit}
    s,strike,del{text-decoration:line-through}
    hr{border:1px inset}
    i,cite,em,var,address{font-style:italic}
    ol,ul,dir,menu,dd{margin-left:40px}
  }
}
</style>
