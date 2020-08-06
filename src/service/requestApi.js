import axios from 'axios'
import { Message } from 'element-ui'
import { getRefreshToken } from '../helper/tokenHelper'
import router from '../router'

let request = axios.create({
	baseURL: process.env.VUE_APP_BASE_API,
	timeout: 5000
})


// 配置通用请求动画
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let requests = [];

// http request 拦截器
request.interceptors.request.use(
	config => {

		var token = sessionStorage.getItem('token');

		if (token != 'undefined' && token) {
			config.headers.Authorization = 'Bearer ' + JSON.parse(token);
		}

		return config;
	},
	error => {
		return Promise.reject(err);
	}
);

// http response 拦截器
request.interceptors.response.use(async response => {

	//请求状态
	var status = response.status;

	//如果登录失效
	if (response.data.code == 2) {
		router.push({
			path: "/Login",
			querry: { redirect: router.currentRoute.fullPath }//从哪个页面跳转
		})
		return response;
	}

	//如果请求正常
	if (status == 200) {
		return response;
	} else if (status == 402) {

		//获取Token
		const token = JSON.parse(sessionStorage.getItem('token'));
		const expires = parseInt(JSON.parse(sessionStorage.getItem('expires')));
		const refresh_token = JSON.parse(sessionStorage.getItem('refreshToken'));

		if (!isRefreshing) {

			isRefreshing = true;

			let refreshData = {
				token: token,
				refresh_token: refresh_token
			};

			var tokenResult = await getRefreshToken(refreshData);

			console.info(res);

			//如果获取成功
			if (res.success) {
				isRefreshing = false;

				sessionStorage.setItem("token", JSON.stringify(tokenResult.data.token));
				sessionStorage.setItem("refreshToken", JSON.stringify(tokenResult.data.refreshToken));
				sessionStorage.setItem("expires", JSON.stringify(tokenResult.data.expires));
				sessionStorage.setItem("refreshExpires", JSON.stringify(tokenResult.data.refreshExpires));

				response.config.headers.Authorization = tokenResult.data.token;
				// 已经刷新了token，将所有队列中的请求进行重试
				requests.forEach(cb => cb(tokenResult.data.token));
				requests = [];

				//重新请求之前的内容
				return request(response.config);

			} else {
				Message({
					type: 'warning',
					message: res.msg,
					duration: 1500
				});
				//跳转到登录
				router.replace({
					path: '/Login',
					query: {
						redirect: router.currentRoute.fullPath
					}
				});
			}

		} else {

			// 正在刷新token，将返回一个未执行resolve的promise
			return new Promise((resolve) => {
				// 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
				requests.push((token) => {
					response.config.headers.Authorization = token;
					resolve(request(response.config));
				});
			});

		}

	}

	// if (token) {

	// 	var timeSpan = expires - timestamp;

	// 	console.info('token get countdown:' + timeSpan);

	// 	//如果时间小于10分种
	// 	if (timeSpan < 60000) {


	// 	}


	// } else {
	// 	window.isReresh = false;
	// }

	return response;
},
	error => {

		if (error.response) {

			switch (error.response.status) {
				case 401://认证过期
					//store.commit('DelToken');
					router.replace({
						path: '/Login',
						query: {
							redirect: router.currentRoute.fullPath//登录之后跳转到对应页面
						}
					});
					return;
				case 403://权限
					//store.commit('DelToken');
					router.replace({
						path: '/Login',
						query: {
							redirect: router.currentRoute.fullPath//登录之后跳转到对应页面
						}
					});
					return;
			}

		} else {

			Message({
				type: 'warning',
				message: '抱歉，请求处理异常',
				duration: 1500
			});

		}

		return Promise.reject(error)
	}
)


/**
* Get方法
* @param url
* @param data
* @return {Promise}
*/
export function get(url, params = {}) {
	return new Promise((resolve, reject) => {
		request.get(url, {
			params: params
		})
			.then(response => {
				resolve(response.data);
			}).catch(error => {
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
		request.post(url, data)
			.then(response => {
				resolve(response.data);
			}, error => {
				reject(error)
			})
	});
}


/**
* Patch请求
* @param url
* @param data
* @return {Promise}
*/
export function patch(url, data = {}) {
	return new Promise((resolve, reject) => {
		request.patch(url, data, {
			responseType: 'json',
			withCredentials: true
		})
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
		request.put(url, data, {
			responseType: 'json',
			withCredentials: true
		})
			.then(response => {
				resolve(response.data);
			}, error => {
				reject(error)
			})
	})
}

