// 使用线上地址 
let apiUrl = 'http://127.0.0.1:6060/api/admin'

export default {
	'LOGIN': apiUrl + '/Login',//登录
	'USER_INFO': apiUrl + '/Manager',// 用户基本资料获取
	'REFRESH_TOKEN': apiUrl + '/Login/RefreshToken',
	'NAVIGATION': apiUrl + '/Console/Navigation'
}