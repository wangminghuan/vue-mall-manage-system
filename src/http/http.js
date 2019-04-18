import axios from 'axios';
import qs from "qs";
import router from 'router';
import Vue from 'vue'
import getMd5Code from "../utils/sign";
//设置基本数据
const  __vue=new Vue();
//获取完整签名和公共参数方法(拦截器中方法改写，暂时没有共用)
let getFullArg=(url,obj)=>{
    let _params={
        timestamp:String(new Date().getTime()).substring(0,10)
    };
    //获取token
    const _token=sessionStorage.getItem("__token__")
    if(_token) _params.token=_token;
     //生成签名参数
     const sortParams={
        sign:getMd5Code(url,qs.stringify({
            ..._params,
            ...obj
        }))
    };
    //将原参数与签名函数再组装，生成最终参数
    const finalData=qs.stringify({
        ..._params,
        ...obj,
        ...sortParams
    })
    //将最终链接拼接返回
    return ("//"+window.location.host)+(url+"?"+finalData)
};
//end
//挂载原型链
Vue.prototype.getFullArg=getFullArg;

// 将签名挂载到原型链上
let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken;
let removePending = (config) => {
    for(let p in pending){
        if(pending[p].u === config.url + '&' + config.method) { //当当前请求在数组中存在时执行函数体
            pending[p].f(); //执行取消操作
            pending.splice(p, 1); //把这条记录从数组中移除
        }
    }
}
axios.interceptors.request.use(
config => {
    removePending(config); //在一个ajax发送前执行一下取消操作
    config.cancelToken = new cancelToken((c)=>{
       // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
       pending.push({ u: config.url + '&' + config.method, f: c });  
   });

    let _params={
        timestamp:String(new Date().getTime()).substring(0,10)
    };
    //获取token
    const _token=sessionStorage.getItem("__token__")
    if(_token) _params.token=_token;
    // 多媒体类型不转换
    if(config.data instanceof FormData){
        config.params = {
            ..._params,
            ...config.params
        }
        return config
    }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    if(config.method === 'post') {
        let data = qs.parse(config.data)
        const allParams = qs.stringify({
            ..._params,
            ...data
        })
        //生成签名参数
        const sortParams={
            sign:getMd5Code(config.url,allParams)
        };
        //将原参数与签名函数再组装，生成最终参数
        const finalData={
            ..._params,
            ...data,
            ...sortParams
        }
        config.data = qs.stringify(finalData)
        if(finalData.export_files=="export"){
            // Promise.reject()
            window.location.href="//"+window.location.host+config.url+"?"+config.data;
        }
    } else if(config.method === 'get') {
        config.params = {
            ..._params,
            ...config.params
        }
    }
    return config;
},
err => {
    return Promise.reject(err);
});
axios.interceptors.response.use((response) =>{  
    // token 已过期，重定向到登录页面  
    removePending(response.config);  
    if (response.data.code == 100){  
        sessionStorage.clear();  
        __vue.$message.error('登录过期，请重新登录！！！~');
        router.replace('/login');
    }else if(response.data.code != 0){
        __vue.$message.error(response.data.message);
    }  
    return response  
}, (error) =>{ 
    if(error.toString()!=="Cancel"){
        __vue.$message({
            showClose: true,
            message: '抱歉，网络连接异常，请稍候重试~',
            type: 'error'
          });
    }
    return Promise.reject(error)  
});
export  default axios;
