import axios from 'axios'
import { Message } from 'element-ui'

axios.default.timeout = 5000
axios.default.baseURL = ''

// http request 拦截器
axios.interceptors.request.use(
	config => {
		// const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
		config.data = JSON.stringify(config.data);
		config.headers = {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
		// if(token){
		//   config.params = {'token':token}
		// }
		return config;
	},
	error => {
		return Promise.reject(err);
	}
);

// http response 拦截器
axios.interceptors.response.use(
	response => {
		if (response.data.errCode == 2) {
			router.push({
				path: "/Login",
				querry: { redirect: router.currentRoute.fullPath }//从哪个页面跳转
			})
		}
		return response;
	},
	error => {
		Message({
			type: 'warning',
			message: '抱歉，请求处理异常',
			duration: 1500
		});
		return Promise.reject(error)
	}
)


/**
* Get方法
* @param url
* @param data
* @return {Promise}
*/
export function fetch(url, params = {}) {
	return new Promise((resolve, reject) => {
		axios.get(url, {
			params: params
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(error => {
				reject(error);
			})
	})
}


/**
 * Post请求
 * @param url
 * @param data
 * @return {Promise}
 */
export function post(url, data = {}) {
	return new Promise((resolve, reject) => {
		axios.post(url, data)
			.then(response => {
				resolve(response.data);
			}, error => {
				reject(error)
			})
	})
}


/**
* Patch请求
* @param url
* @param data
* @return {Promise}
*/
export function patch(url, data = {}) {
	return new Promise((resolve, reject) => {
		axios.patch(url, data)
			.then(response => {
				resolve(response.data);
			}, error => {
				reject(error)
			})
	})
}


/**
* Put请求
* @param url
* @param data
* @return {Promise}
*/
export function put(url, data = {}) {
	return new Promise((resolve, reject) => {
		axios.put(url, data)
			.then(response => {
				resolve(response.data);
			}, error => {
				reject(error)
			})
	})
}











