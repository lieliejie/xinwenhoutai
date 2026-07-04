<template>
    <div class="login-wrapper">
      <div class="login-container">
        <h2 class="login-title">新闻管理系统</h2>
        <p class="login-subtitle">管理员登录</p>

        <div class="login-form" @submit.prevent="fangDouDengLu">
          <input
            v-model="yonghuming"
            type="text"
            placeholder="请输入账号"
            class="login-input"
            @keyup.enter="handleUserEnter"
            :disabled="jiazaiZhong"
          />
          <input
            v-model="mima"
            type="password"
            placeholder="请输入密码"
            class="login-input"
            ref="mimaRef"
            @keyup.enter="fangDouDengLu"
            :disabled="jiazaiZhong"
          />

          <div v-if="cuowuXinxi" class="error-tip">{{ cuowuXinxi }}</div>

          <button class="login-btn" type="submit" :disabled="jiazaiZhong" @click="fangDouDengLu">
            {{ jiazaiZhong ? '登录中...' : '登录' }}
          </button>

          <div class="switch-link">
            <router-link to="/zhuce">还没有账号？去注册</router-link>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { zongguan } from '../fengzhuang/axios'

  const router = useRouter()

  const yonghuming = ref('')
  const mima = ref('')
  const cuowuXinxi = ref('')
  const jiazaiZhong = ref(false)
  const mimaRef = ref(null)

  // ============ 新增通用防抖函数（无需修改，直接复用） ============
  function fangDou(fn, daojishi = 300) {   
    //1、也就是 点击按钮之后 不会立刻执行 而是选取最后一次间隔0。3s之后执行这个函数？
    // 每次点击都会重置倒计时，连续点击不执行，停手满设定延迟才运行目标函数。


    let jishiqi = null
    return function(...args) {  //canshu  就是  账号密码 之类  
      if (jishiqi) clearTimeout(jishiqi)  //如果 前面 那个还没执行完毕  然他别执行了  先执行我这个是
      jishiqi = setTimeout(() => {
        fn.apply(this, args)
        jishiqi = null
      }, daojishi)              ////后面这个 就是0.3s 外能执行完毕
    }
  }
  // =================================================================

  const handleUserEnter = () => {
    if (!yonghuming.value.trim()) {
      cuowuXinxi.value = '请输入账号'
      return
    }
    cuowuXinxi.value = ''
    mimaRef.value?.focus()
  }

  // 原始登录逻辑完全不变
  const denglu = async () => {
    if (!yonghuming.value.trim()) {
      cuowuXinxi.value = '请输入账号'
      return
    }
    if (!mima.value.trim()) {
      cuowuXinxi.value = '请输入密码'
      return
    }

    jiazaiZhong.value = true
    cuowuXinxi.value = ''

    try {
      const res = await zongguan.post('/api/login', {
        username: yonghuming.value,
        password: mima.value
      })

      localStorage.setItem('token', res.data.token || (res.data.data && res.data.data.token))
      localStorage.setItem('userId', res.data.userId || (res.data.data && res.data.data.userId))
      localStorage.setItem('username', res.data.username || (res.data.data && res.data.data.username))
      localStorage.setItem('avatar', res.data.data?.avatar || '')
      
      localStorage.setItem('nickname', res.data.nickname || (res.data.data && res.data.data.nickname))

      await router.push('/shouye')
    } catch (err) {
      if (err.response?.status === 401) {
        cuowuXinxi.value = err.response.data.message || '账号或密码错误'
      } else {
        cuowuXinxi.value = '网络请求失败，请稍后重试'
      }
    } finally {
      jiazaiZhong.value = false
    }
  }

  // 包装防抖登录，页面全部绑定这个方法
  const fangDouDengLu = fangDou(denglu, 300)

  watch(() => mima.value, () => {
    if (mima.value === '') {
      cuowuXinxi.value = ''
    }
  })
  </script>

  <style scoped>
  .login-wrapper {
    width: 100vw;
    height: 100vh;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login-container {
    background: #fff;
    width: 380px;
    padding: 40px 30px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    text-align: center;
  }

  .login-title {
    font-size: 24px;
    color: #333;
    margin-bottom: 8px;
  }

  .login-subtitle {
    font-size: 14px;
    color: #666;
    margin-bottom: 35px;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .login-input {
    height: 44px;
    padding: 0 15px;
    border: 1px solid #eee;
    border-radius: 6px;
    font-size: 14px;
    outline: none;
    transition: 0.3s;
  }

  .login-input:focus {
    border-color: #07c160;
  }

  .error-tip {
    color: #f56c6c;
    font-size: 12px;
    text-align: left;
    height: 12px;
  }

  .login-btn {
    height: 46px;
    background: #07c160;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 15px;
    cursor: pointer;
    transition: 0.3s;
  }

  .login-btn:hover {
    background: #06ad56;
  }

  .login-btn:disabled {
    background: #a0d4b0;
    cursor: not-allowed;
  }

  .switch-link {
    margin-top: 10px;
    font-size: 13px;
  }
  </style>