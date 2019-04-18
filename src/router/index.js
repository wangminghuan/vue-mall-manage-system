import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
const router = new Router({
        routes: [{
                path: '/',
                redirect: '/login'
            },
            {
                path: '*',
                redirect: '/error'
            },
            {
                path: '/home',
                component: resolve => require(['../components/common/Home.vue'], resolve),
                children: [
                    //首页
                    {
                        path: '/',
                        redirect: '/infoSet_myInfo'
                            // component: resolve => require(['../components/page/infoSet/myInfo.vue'], resolve)
                    },
                    // 信息设置
                    {
                        path: '/infoSet_myInfo',
                        component: resolve => require(['../components/page/infoSet/myInfo.vue'], resolve)
                    },
                    {
                        path: '/infoSet_freight_list',
                        component: resolve => require(['../components/page/infoSet/freightList.vue'], resolve)
                    },
                    {
                        path: '/infoSet_freight_detail',
                        component: resolve => require(['../components/page/infoSet/freightDetail.vue'], resolve)
                    },
                    //商品管理
                    {
                        path: '/goods_add',
                        component: resolve => require(['../components/page/goods/add.vue'], resolve)
                    },
                    {
                        path: '/goods_my_list',
                        component: resolve => require(['../components/page/goods/myList.vue'], resolve)
                    },
                    //订单管理
                    {
                        path: '/order_my_list',
                        component: resolve => require(['../components/page/order/myList.vue'], resolve)
                    },
                    // 订单详情
                    {
                        path: '/order_my_detail',
                        component: resolve => require(['../components/page/order/myDetail.vue'], resolve)
                    },
                    //发货
                    {
                        path: '/order_my_delivery',
                        component: resolve => require(['../components/page/order/delivery.vue'], resolve)
                    },
                    //店铺管理
                    {
                        path: '/shop_classify',
                        component: resolve => require(['../components/page/shop/classify.vue'], resolve)
                    },
                    //数据统计
                    {
                        path: '/statistical_data_list',
                        component: resolve => require(['../components/page/statistical/dataList.vue'], resolve)
                    },
                ]
            },
            {
                path: '/login',
                component: resolve => require(['../components/page/Login.vue'], resolve)
            },
            {
                path: '/error',
                component: resolve => require(['../components/common/404.vue'], resolve)
            }

        ]
    })
    // 登录校验
router.beforeEach((to, from, next) => {
    const _token = sessionStorage.getItem('__token__');
    //token不存在且访问的不是登陆页面，跳转到登陆页
    if (!_token && to.path !== "/login") {
        next("/login")
    } else if(window.$isApply && to.path == "/shop_classify"){
        next("/error");
    } else{
        next()
    }
})
export default router