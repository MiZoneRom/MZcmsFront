import axios from 'axios'
import { Message } from 'element-ui'
import { getRefreshToken, isRefreshTokenExpired } from '../helper/tokenHelper'
import router from '../router'

axios.default.timeout = 5000
axios.default.baseURL = ''
window.isReresh = false;

// http request 拦截器
axios.interceptors.request.use(
	config => {

		config.data = JSON.stringify(config.data);
		config.headers = {
			'Content-Type': 'application/x-www-form-urlencoded'
		}

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
axios.interceptors.response.use(
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
		const resetTime = sessionStorage.getItem('resetTime');

		if (token) {

			//更新过期时间
			isRefreshTokenExpired(resetTime);

			//如果时间小于20分种
			if (resetTime < 1200) {
				if (!window.isReresh) {

					window.isReresh = true;
					let refresh_token = sessionStorage.getItem('refreshToken');

					getRefreshToken(refresh_token).then(res => {
						window.isReresh = false;
						isRefreshTokenExpired(res.data.resetTime);// 重新获取的token有效时间
						store.commit('changeLogin', {//vuex中修改相关信息
							Authorization: res.data.access_token,
							token_type: res.data.token_type,
							refresh_token: res.data.refresh_token,
						});
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

