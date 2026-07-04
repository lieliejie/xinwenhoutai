import axios from "axios";

export const zongguan = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  timeout: 5000
});

//是get 或者 post 数据 就把 
//当前这个 token 处理一下 再给后端  让后端知道 你是谁 你是哪个用户 你有没有登录 你有没有权限访问这个接口

// 请求拦截器：自动给所有请求带上令牌（token）
zongguan.interceptors.request.use(
         //拦截器   去看有没有登录令牌
  (peiZhi) => {
    const lingPai = localStorage.getItem('token');   // 拼音：令牌
    if (lingPai) {
      peiZhi.headers.Authorization = `Bearer ${lingPai}`;
      //peiZhi.headers.Authorization 就是 HTTP 请求里专门放令牌的“标准格子”
     //Bearer 加上 后端给的  那个fake-token 加日期
    
    }
    return peiZhi;
  },
  (cuoWu) => Promise.reject(cuoWu) //login 接住
  // 虽然没写  到那时写了拦截器  拦截器 在get 就拿着token 处理了  自动就给了后端
);

zongguan.interceptors.response.use(
  (xiangYing) => {
  // 成功返回也拦一下，比如只取data
  console.log('请求成功:', xiangYing.status)
  return xiangYing;  // 还是得return，不然你拿不到数据
},
  (cuoWu) => {
    if (cuoWu.response?.status === 401) {
      // 令牌过期或无效，清除本地存储并跳转登录页
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      // 注意 hash 模式下跳转
      window.location.href = '/#/login';
    }
    return Promise.reject(cuoWu);
  //就是继续 往下走的意思？ 后端给了数据  拦住了  就是得放行了是吧  得数据给前段了是吧
  }
);