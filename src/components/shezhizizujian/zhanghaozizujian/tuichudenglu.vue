<template>
  <div class="tuichu-box">
    <h3>退出登录</h3>
    <p>确定要退出当前账号吗？</p>
    <button class="tuichu-btn" @click="tuichu">确认退出</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const tuichu = () => {
  // 第1步：清空所有本地存储（token、用户信息等）
  localStorage.clear()
  sessionStorage.clear()
  router.push('/login')
  // window.location.replace('/#/login')
}

// ==============================================

// // ========== 你之前的写法（注释保留） ==========
// // 以前你可能是这样写的：
// // router.push('/login')
  
// // 问题：push 只是新增一条历史记录，用户点后退就回到后台了
// // ==============================================
</script>

<style scoped>
.tuichu-box {
  max-width: 400px;
  margin: 40px auto;
  text-align: center;
  padding: 30px;
}

.tuichu-box h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 12px;
}

.tuichu-box p {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
}

.tuichu-btn {
  height: 42px;
  padding: 0 40px;
  background: #f56c6c;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  transition: 0.3s;
}

.tuichu-btn:hover {
  background: #e04040;
}
</style>
