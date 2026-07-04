


import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../router/home.vue";// 导入上面的布局文件
const router = createRouter({
  history: createWebHashHistory(),
  
 routes:[
  // ====== 独立页面（无布局） ======
  { path: '/login', component: () => import('../zujian/Login.vue') },
  { path: '/zhuce', component: () => import('../zujian/Lzhuce.vue') },

  // ====== 主布局页面（平级路径，但共用 Home 布局） ======
  {
    path: '/',
    component: Home,
    redirect: '/shouye',
    children: [
      { path: '/shouye', component: () => import('../zujian/Lshouye.vue') },
      { path: '/tongji', component: () => import('../zujian/Lkapian.vue') },
      { path: '/users', component: () => import('../zujian/Lbiaoge.vue') },
      { path: '/xiangqing/:id', component: () => import('../zujian/Lxiangqing.vue') },
      { path: '/news', component: () => import('../zujian/Lxinwenkapian.vue') },
      { path: '/shezhi', component: () => import('../zujian/shezhi.vue') },
      { path: '/shezhi/zhanghao', component: () => import('../shezhizizujian/zhanghao.vue') },
      { path: '/shezhi/zhanghao/gerenziliao', component: () => import('../shezhizizujian/zhanghaozizujian/gerenziliao.vue') },
      { path: '/shezhi/zhanghao/xiugaimima', component: () => import('../shezhizizujian/zhanghaozizujian/xiugaimima.vue') },
      
      { path: '/shezhi/zhanghao/tuichudenglu', component: () => import('../shezhizizujian/zhanghaozizujian/tuichudenglu.vue') },
      { path: '/shezhi/zhuti', component: () => import('../shezhizizujian/tongyong.vue') },
      { path: '/shezhi/beifen', component: () => import('../shezhizizujian/tongyong.vue') },
      { path: '/shezhi/xitong', component: () => import('../shezhizizujian/tongyong.vue') },
      { path: '/shezhi/tongzhi', component: () => import('../shezhizizujian/tongyong.vue') },
    ]
  },
]
})

router.beforeEach((to) => {
  //  每次进页面   就是都执行一次    进入页面  默认进入shouye   
  //  redirect: '/shouye', / 进来一看不是去登录页
  if (to.path === '/login' || to.path === '/zhuce') {
    return true
  }
  // 继续往下执行  执行 刚开始肯定没有 token  就执行这个 就去了登录页
  if (!localStorage.getItem('token')) {
    return '/login'
  }
  // 有token → 放行
    if (localStorage.getItem('token')) {
    return true
    // 就允许 去下一个页面  就是了对吧
   }
})
// ====================================================

// // ========== 你之前的守卫写法（注释保留） ==========
// router.beforeEach((to) => {
//   if (to.path === '/login' || to.path === '/zhuce') {
//     return true
//   }
//   if (!localStorage.getItem('token')) {
//     return '/login'
//   }
//   if(localStorage.getItem('token')){
//     return true
//   }
// })
// // 刚开始 就是先去首页 你告诉守卫  守卫一看 你的进入证  一看浏览器没存  没存就是 null 就是false 然后就出发  if (!isLogin) {
// //   return '/login'
// // }  强制你去登录页    // 如果去登录页，直接放行
// // if  (to.path === '/login') {
// //   return true
// // }
// ====================================================
export default router