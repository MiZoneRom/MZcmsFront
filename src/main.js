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

var getRouter //用来获取后台拿到的路由

// handle admin, should release
router.beforeEach((to, from, next) => {

	if (to.path == '/login') {
		sessionStorage.removeItem('Admin');
	}

	let user = JSON.parse(sessionStorage.getItem('Admin'));
	if (!user && to.path != '/Login') {

		next({ path: '/Login' });

	} else if (!getRouter) {

		if (!getObjArr('router')) {
			axios.get(apiPath.NAVIGATION).then(res => {
				getRouter = res.data.router//后台拿到路由
				saveObjArr('router', getRouter) //存储路由到localStorage
				routerGo(to, next)//执行路由跳转方法
			});
		} else {//从localStorage拿到了路由
			getRouter = getObjArr('router')//拿到路由
			routerGo(to, next)
		}

	} else {
		next();
	}
})

function routerGo(to, next) {
	getRouter = filterAsyncRouter(getRouter) //过滤路由
	router.addRoutes(getRouter) //动态添加路由
	router.addRoutes([{ path: '*', redirect: '/404', hidden: true }]);//添加动态路由后再添加404页面
	global.antRouter = getRouter //将路由数据传递给全局变量，做侧边栏菜单渲染工作
	next({ ...to, replace: true })
}

function saveObjArr(name, data) { //localStorage 存储数组对象的方法
	localStorage.setItem(name, JSON.stringify(data))
}

function getObjArr(name) { //localStorage 获取数组对象的方法
	return JSON.parse(window.localStorage.getItem(name));
}

function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象

	const accessedRouters = asyncRouterMap.filter(route => {
		if (route.component) {
			if (route.component === 'Layout') {//Layout组件特殊处理
				route.component = Home
			} else {
				route.component = _import(route.component)
			}
		}
		if (route.children && route.children.length) {
			route.children = filterAsyncRouter(route.children)
		}
		return true
	});

	return accessedRouters
}

/* eslint-disable no-new */
new Vue({
	// el: '#app',
	// template: '<App/>',
	router,
	store,
	// components: { App }
	render: h => h(App)
}).$mount('#app');
