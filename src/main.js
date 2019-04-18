import Vue from 'vue';
import App from './App';
import router from './router';
import axios from './http/http';
import {formatDate} from "./utils/utils";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "babel-polyfill";
import VueQuillEditor from 'vue-quill-editor';
import vueCropUpload from 'vue-image-crop-upload';
// 动态设置publicPath,模板中 window.resourceBaseUrl为最终结果
__webpack_public_path__ = window.resourceBaseUrl;
window.__vBus = new Vue(); //全局公共通道
// Date原型链挂载格式化方法
Date.prototype.format = formatDate;
Vue.use(ElementUI);
Vue.use(VueQuillEditor);
Vue.prototype.$axios = axios;
//判断是供应商还是服务商
window.$isApply=sessionStorage.getItem('__userType__') == 2 ? true : false;
Vue.component('vueCropUpload', vueCropUpload)
Vue.prototype.$uploadUrl = "/merchant/Upload/upload";
Vue.prototype.$uploadLangZh = {
        hint: '点击，或拖动图片至此处',
        loading: '正在上传……',
        noSupported: '浏览器不支持该功能，请使用IE10以上或其他现在浏览器！',
        success: '上传成功',
        fail: '图片上传失败',
        preview: '图片预览',
        btn: {
            off: '取消',
            close: '关闭',
            back: '上一步',
            save: '保存'
        },
        error: {
            onlyImg: '仅限图片格式',
            outOfSize: '单文件大小不能超过 ',
            lowestPx: '图片最低像素为（宽*高）：'
        }
    }
    //end
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');