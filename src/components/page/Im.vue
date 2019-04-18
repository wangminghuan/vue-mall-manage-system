<template>
    <div class="el-dialog__wrapper im-iframe-wrap" style="z-index: 2001;" v-show="dialogVisible">
    <div class="el-dialog el-dialog--center" style="width: 900px; margin-top: 15vh;">
        <div class="el-dialog__header"><span class="el-dialog__title">聊天对话</span>
            <button type="button" aria-label="Close" class="el-dialog__headerbtn"><i class="el-dialog__close el-icon el-icon-close" @click="dialogVisible=false"></i>
            </button>
        </div>
        <div class="el-dialog__body" style="padding:0">
            <iframe name="myiframe" style="width:100%;height:580px" id="iframeId" :src="iframeUrl"></iframe>
        </div>
    </div>
    </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      value: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      iframeUrl: "//"+(window.location.port?"s29.dev.bxd365.com":"s29.9956.cn")+"/res/common/im_v1/www.html?merchant_token="+sessionStorage.getItem('__token__')
    };
  },
  watch: {
    value(val) {
      //监听父级v-modle的值
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  mounted() {
    const that=this;
    window.addEventListener("message", function(event) {
      if (event.data == "hasNewMsg" ) {
         !that.dialogVisible && that.$notify.info({
          title: '消息提示',
          message: '您有一条新的聊天消息，请点击顶部图标查看',
          position: 'top-right',
          duration: 3000,
          offset:50,
        });
      }
    });
  }
};
</script>
<style lang="scss">
.im-iframe-wrap {
    background-color: rgba(0, 0,0, 0.5);
}
</style>


