// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// use es6 syntax and api
import 'babel-polyfill'

// use element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// use vue-router
import VueRouter from 'vue-router'

// use lodash
import _ from 'lodash'

import axios from 'axios'

// use moment
import moment from 'moment'

// register global filter
import '@/utils/filters'

// use vuex
import store from './store/index'

import apiPath from "@/service/apiPath";

import cacheKeyCollection from "@/service/cacheKeyCollection";

import Home from '@/views/Home'

const _import = require('./router/_import_' + process.env.NODE_ENV)

// use axios
import { post, fetch, patch, put } from './service/requestApi.js'
Vue.prototype.$post = post;
Vue.prototype.$fetch = fetch;
Vue.prototype.$patch = patch;
Vue.prototype.$put = put;

Vue.use(ElementUI)
Vue.use(VueRouter)

//用来获取后台拿到的路由
var siteRouter;
//系统配置
var siteSettings;

router.beforeEach(async (to, from, next) => {

	//如果前往登录 清空登录信息
	if (to.path == '/login') {
		sessionStorage.removeItem('admin');
	}

	//获取用户信息
	let user = JSON.parse(sessionStorage.getItem('admin'));

	//获取系统配置
	if (!siteSettings) {
		if (!getLocalStorage(cacheKeyCollection.SITE_SETTINGS)) {
			var remoteSiteSettings = await axios.get(apiPath.SITE_SETTINGS);
			siteSettings = remoteSiteSettings.data.data;
			saveLocalStorage(cacheKeyCollection.SITE_SETTINGS, siteSettings);
		} else {
			siteSettings = getLocalStorage(cacheKeyCollection.SITE_SETTINGS);
		}
	}

	//获取系统路由
	if (!siteRouter) {
		if (!getLocalStorage(cacheKeyCollection.ROUTER)) {
			//从后台获取路由
			var remoteRouter = await axios.get(apiPath.NAVIGATION);
			var siteRouterData = remoteRouter.data.data;
			//存储路由到localStorage
			saveLocalStorage(cacheKeyCollection.ROUTER, siteRouterData);
			//执行路由跳转方法
			initRouter(siteRouterData, to, next);
		} else {//从localStorage拿到了路由
			//拿到路由
			var siteRouterData = getLocalStorage(cacheKeyCollection.ROUTER);
			initRouter(siteRouterData, to, next);
		}
	}

	//如果用户过期且没有前往登录
	if (!user && to.path != '/Login') {
		next({ path: '/Login' });
	} else {
		next();
	}

});

//初始化路由
function initRouter(data, to, next) {
	siteRouter = filterAsyncRouter(data); //过滤路由
	router.addRoutes(siteRouter); //动态添加路由
	router.addRoutes([{ path: '*', redirect: '/404', hidden: true }]);//添加动态路由后再添加404页面
	global.antRouter = siteRouter //将路由数据传递给全局变量，做侧边栏菜单渲染工作
	next({ ...to, replace: true });
}

//保存本地储存
function saveLocalStorage(name, data) { //localStorage 存储数组对象的方法
	localStorage.setItem(name, JSON.stringify(data));
}

//获取本地储存
function getLocalStorage(name) { //localStorage 获取数组对象的方法
	return JSON.parse(window.localStorage.getItem(name));
}

//遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
	const accessedRouters = asyncRouterMap.filter(route => {
		if (route.component) {
			if (route.component === 'Layout') {//Layout组件特殊处理
				route.component = Home;
			} else {
				route.component = _import(route.component);
			}
		}
		if (route.children && route.children.length) {
			route.children = filterAsyncRouter(route.children);
		}
		return true;
	});
	return accessedRouters;
}

new Vue({
	// el: '#app',
	// template: '<App/>',
	router,
	store,
	// components: { App }
	render: h => h(App)
}).$mount('#app');
