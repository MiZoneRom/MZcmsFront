import axios from 'axios'
import { Message } from 'element-ui'
import { getRefreshToken, isRefreshTokenExpired } from '../helper/tokenHelper'
import router from '../router'

let request = axios.create({
	baseURL: process.env.VUE_APP_BASE_API,
	timeout: 5000
})

window.isReresh = false;

// http request 拦截器
request.interceptors.request.use(
	config => {

		//影响后端接受json

		//config.data = JSON.stringify(config.data);

		// config.headers = {
		// 	'Content-Type': 'application/x-www-form-urlencoded'
		// }

		const token = JSON.parse(sessionStorage.getItem('token'));

		if (token) {
			config.headers.Authorization = 'Bearer ' + token;
		}

		return config;
	},
	error => {
		return Promise.reject(err);
	}
);

// http response 拦截器
request.interceptors.response.use(
	response => {

		//如果登录失效
		if (response.data.code == 2) {
			router.push({
				path: "/Login",
				querry: { redirect: router.currentRoute.fullPath }//从哪个页面跳转
			})
			return response;
		}

		//获取Token
		const token = JSON.parse(sessionStorage.getItem('token'));
		const expires = parseInt(JSON.parse(sessionStorage.getItem('expires')));
		const refresh_token = JSON.parse(sessionStorage.getItem('refreshToken'));
		var timestamp = (new Date()).valueOf();

		if (token) {

			var timeSpan = expires - timestamp;

			console.info('token get countdown:' + timeSpan);

			//如果时间小于10分种
			if (timeSpan < 60000) {

				if (!window.isReresh) {

					window.isReresh = true;

					let refreshData = {
						token: token,
						refresh_token: refresh_token
					};

					getRefreshToken(refreshData).then(res => {

						console.info(res);

						window.isReresh = false;

						sessionStorage.setItem("token", JSON.stringify(res.data.token));
						sessionStorage.setItem("refreshToken", JSON.stringify(res.data.refreshToken));
						sessionStorage.setItem("expires", JSON.stringify(res.data.expires));
						sessionStorage.setItem("refreshExpires", JSON.stringify(res.data.refreshExpires));



					}).catch(err => { });

				}

			}


		} else {
			window.isReresh = false;
		}

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
export function fetch(url, params = {}) {
	return new Promise((resolve, reject) => {
		request.get(url, {
			params: params
		}, {
			responseType: 'json',
			withCredentials: true
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
		request.post(url, data, {
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

