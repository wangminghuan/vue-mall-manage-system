
<!-- 规格生成表格 -->
<template>
  <div  v-show="renderTable.specs.length>0">
  <div class="spec-table el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
    <div class="hidden-columns">
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div class="el-table__header-wrapper">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header">
            <colgroup>
                <col 
                v-for="(item1,index1) in renderTable.specs" 
                :key="index1" 
                :name="'el-table_26_column_'+index1" 
                width="140">
                <col name="el-table_26_column_04" width="140">
                <col name="el-table_26_column_03" width="140">
                <col name="el-table_26_column_02" width="140">
                <col name="el-table_26_column_01" width="140">
            </colgroup>
            <thead class="has-gutter">
                <tr class="">
                    <th  
                    v-for="(item2,index2) in renderTable.specs" 
                    :key="index2" 
                    colspan="1" 
                    rowspan="1" 
                    :class="['el-table_26_column_'+index2, 'is-leaf']">
                        <div class="cell">{{item2}}</div>
                    </th>
                    <th colspan="1" rowspan="1" class="el-table_26_column_04 is-leaf" style="border-right:1px solid #e6ebf5">
                        <div class="cell"><em>价格</em><span class="btn" @click="handleClickSame('spec_sku_price')">统一价格</span></div>
                        
                    </th>
                    <th colspan="1" rowspan="1" class="el-table_26_column_03 is-leaf">
                        <div class="cell"><em>库存</em><span class="btn" @click="handleClickSame('spec_stock_num')">统一库存</span></div>
                        
                    </th>
                    <th colspan="1" rowspan="1" class="el-table_26_column_02 is-leaf" style="border-right:1px solid #e6ebf5">
                        <div class="cell"><em>重量</em><span class="btn" @click="handleClickSame('spec_sku_nweight')">统一重量</span></div>
                        
                    </th>
                    <th colspan="1" rowspan="1" class="el-table_26_column_01 is-leaf">
                        <div class="cell"><em>体积</em><span class="btn" @click="handleClickSame('spec_sku_volume')">统一体积</span></div>
                        
                    </th>
                </tr>
            </thead>
        </table>
    </div>
    <div class="el-table__body-wrapper">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
            <colgroup>
            <col 
                v-for="(item3,index3) in renderTable.spec_title_default" 
                :key="index3" 
                :name="'el-table_26_column_'+index3" 
                width="140">
            <col name="el-table_26_column_04" width="140">
            <col name="el-table_26_column_03" width="140">
            <col name="el-table_26_column_02" width="140">
            <col name="el-table_26_column_01" width="140">
            </colgroup>
            <tbody>
                <tr class="el-table__row" 
                v-for="(item4,index4) in renderTable.spec_title_default" 
                :key="index4" >
                    <td 
                    v-for="(sitem,sindex) in item4" 
                    :key="sindex" 
                    :class="['el-table_26_column_'+sindex,{'td-1':sindex==0}]">
                        <div class="cell">{{sitem}}</div>
                    </td>
                    <td class="el-table_26_column_04">
                        <div class="cell">
                            <input v-model="renderTable.spec_sku_price[index4]">
                        </div>
                    </td>
                    <td class="el-table_26_column_03">
                        <div class="cell"><input v-model="renderTable.spec_stock_num[index4]"></div>
                    </td>
                     <td class="el-table_26_column_02">
                        <div class="cell">
                            <input v-model="renderTable.spec_sku_nweight[index4]">
                        </div>
                    </td>
                    <td class="el-table_26_column_01">
                        <div class="cell"><input v-model="renderTable.spec_sku_volume[index4]"></div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
  </div>
</template>
<script>
export default {
  props:{
    renderTable:Object
  },
  computed:{
    //   spec_title(){
    //       return this.renderTable.spec_title
    //   }
  },
  watch:{
    //   spec_title(val){
    //         setTimeout(()=>{
    //         console.log(document.getElementsByClassName("has-gutter")[0].offsetWidth)
    //         })
    //   }
  },
  methods:{
      handleClickSame(keyname){
         
          this.renderTable[keyname]=new Array(this.renderTable[keyname].length).fill(this.renderTable[keyname][0])
      }
  },
  created(){
    //   console.log(this.renderTable)
    //   this.renderSpecTable.spec_title=combin;//规格属性
    //    this.renderSpecTable.specs=specs;
    //    this.renderSpecTable.spec_sku_price=price;
    //    this.renderSpecTable.spec_stock_num=nums;
    //    this.renderSpecTable.spec_title_default=this.getMultiArrCombine(combin);
  }
}
</script>
<style lang="scss">
.spec-table-wrap{
     position: absolute; 
     left: 0;
    overflow: scroll;
}
.spec-table.el-table--border{
    border:none;
    &:after,&:before{
        width:0;
        height: 0;
    }
   }
.spec-table.el-table{
    thead th,{
       border-top:1px solid #ebeef5;
        background: #ecf5ff;
      color: #353535;
    }
    thead th:nth-of-type(1),
    .el-table__body,.td-1{
        border-left:1px solid #ebeef5;
    }
   th,td{
       min-width: 100px;
   }
    input{
        width:118px;
    }
   .cell .btn{
    color: #409EFF;
    font-size: 12px;
    margin-left: 4px;
    cursor: pointer;
   
   }
}
</style>

