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

// use moment
import moment from 'moment'

// register global filter
import '@/utils/filters'

// use vuex
import store from './store/index'

// use axios
import {post,fetch,patch,put} from './service/requestApi.js'
Vue.prototype.$post=post;
Vue.prototype.$fetch=fetch;
Vue.prototype.$patch=patch;
Vue.prototype.$put=put;

Vue.use(ElementUI)
Vue.use(VueRouter)

// handle admin, should release
router.beforeEach((to,from,next) => {

	if(to.path == '/login'){
		sessionStorage.removeItem('Admin');
  }
  
	let user = JSON.parse(sessionStorage.getItem('Admin'));
	if(!user && to.path != '/Login'){
		next({path: '/Login'});
	} else{
		next();
	}
})

/* eslint-disable no-new */
new Vue({
	// el: '#app',
	// template: '<App/>',
	router,
	store,
	// components: { App }
	render: h => h(App)
  }).$mount('#app');
  