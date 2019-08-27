import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import NotFound from '@/views/404'

Vue.use(Router)

//设置默认路由
export default new Router({
  routes: [
    {
      path: '/',
      name: '控制台',
      component: Home,
      iconCls: 'el-icon-edit',
      children: [
        {
          path: '/',
          hidden: true,
          redirect: '/Console',
        },
        {
          path: '/Console',
          name: '主页',
          component: () => import('@/views/Console')
        }
      ]
    },
    // {
    //   path: '/',
    //   name: '系统',
    //   component: Home,
    //   iconCls: 'el-icon-edit',
    //   children: [
    //     {
    //       path: '/SiteSettings',
    //       name: '网站设置',
    //       meta: '',
    //       component: () => import('@/views/manage/SiteSettings')
    //     }
    //   ]
    // },
    {
      path: '/Login',
      name: 'Login',
      hidden: true, // 左侧导航栏中隐藏
      component: () => import('@/views/Login'),
      iconCls: 'el-icon-message',//图标样式class
    }//,
    // {
    //   path: '/404',
    //   name: '404',
    //   component: NotFound,
    //   hidden: true
    // },
    // {
    //   path: '*',
    //   hidden: true,
    //   redirect: { path: '/404' }
    // }
  ]
})
