# 极夫特商城内部管理后台 #
基于Vue.js 2.x系列 + Element UI 的后台管理系统解决方案。在此[项目](http://blog.gdfengshuo.com/example/work/)基础上修改而成

> 线上地址：https://fuwu.newgiftmall.com   
> 测试地址:http://fuwu.newgiftmall.com:8001(配置host:192.168.1.66 fuwu.newgiftmall.com)  
> （用户名 admin, 密码：123456）

## 一、项目说明

### 1. 项目启动说明
#### 第一步：安装依赖

	npm i
建议不要用cnpm  安装有各种诡异的bug 可以通过如下操作解决npm速度慢的问题 npm install --registry=https://registry.npm.taobao.org
#### 第二步：运行开发环境

	npm run dev //浏览器会自动打开 http://localhost:8060

#### 2. 项目构建说明

#### 第一步：修改异步模块版本号

	build/webpack.prod.conf.js 修改该文件中的版本号(目前版本号改为了动态时间戳，所以此步可以跳过~)
#### 第二步：运行构建命令

	npm run build


## 二、结构目录说明

		├─.babelrc
		├─.editorconfig
		├─.gitignore
		├─index.html
		├─package-lock.json
		├─package.json
		├─README.md
		├─static
		|   ├─.gitkeep
		|   ├─img  //图片
		|   ├─css
		|   |  └main.css
		├─src
		|  ├─App.vue
		|  ├─main.js
		|  ├─utils
		|  |   ├─sign.js
		|  |   └utils.js
		|  ├─router
		|  |   └index.js
		|  ├─http
		|  |  └http.js
		|  ├─components
		|  |     ├─page
		|  |     |  ├─Im.vue
		|  |     |  ├─Login.vue    //登录
		|  |     |  ├─Welcome.vue
		|  |     |  ├─statistical  //数据统计
		|  |     |  |      └dataList.vue
		|  |     |  ├─shop  //店铺管理
		|  |     |  |  └classify.vue
		|  |     |  ├─order   //订单管理
		|  |     |  |   ├─delivery.vue
		|  |     |  |   ├─myDetail.vue
		|  |     |  |   └myList.vue
		|  |     |  ├─infoSet   //信息设置
		|  |     |  |    ├─freightDetail.vue
		|  |     |  |    ├─freightList.vue
		|  |     |  |    ├─myAdmissionInfo.vue
		|  |     |  |    ├─myBasicInfo.vue
		|  |     |  |    └myInfo.vue
		|  |     |  ├─goods    //商品管理
		|  |     |  |   ├─add.vue
		|  |     |  |   ├─myList.vue
		|  |     |  |   └specTable.vue
		|  |     ├─common
		|  |     |   ├─404.vue
		|  |     |   ├─citySelect.vue
		|  |     |   ├─Header.vue
		|  |     |   ├─Home.vue
		|  |     |   └Sidebar.vue
		├─dist
		├─config
		|   ├─dev.env.js
		|   ├─index.js
		|   └prod.env.js
		├─build
		|   ├─build.js
		|   ├─check-versions.js
		|   ├─dev-client.js
		|   ├─dev-server.js
		|   ├─utils.js
		|   ├─vendor-manifest.json
		|   ├─vue-loader.conf.js
		|   ├─webpack.base.conf.js
		|   ├─webpack.dev.conf.js
		|   ├─webpack.dll.conf.js
		|   └webpack.prod.conf.js



