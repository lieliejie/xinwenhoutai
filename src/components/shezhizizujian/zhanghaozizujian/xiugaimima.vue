
<template>
  <div class="xiugaimima-page">
    <div class="card">
      <div class="header-box">
        <div class="icon-box">
          <span class="icon">🔒</span>
        </div>
        <div class="header-info">
          <h3>修改密码</h3>
          <p>修改当前账号密码</p>
        </div>
      </div>
      <span class="close-btn" @click="router.back()" title="返回">✕</span>
    </div>

    <div class="form-wrapper">
      <div class="input-item">
        <label>原密码</label>
        <div class="input-box">
          <input
            v-model="yuanmima"
            :type="isyuanmima ? 'text' : 'password'"
            placeholder="请输入原密码"
          />
          <span class="eye-icon" @click="isyuanmima = !isyuanmima">
            <span v-if="!isyuanmima" class="eye-closed">👁</span>
            <span v-else class="eye-open">👁</span>
          </span>
        </div>
      </div>

      <div class="input-item">
        <label>新密码</label>
        <div class="input-box">
          <input
            v-model="xinmima"
            :type="isxinmima ? 'text' : 'password'"
            placeholder="请输入新密码"
          />
          <span class="eye-icon" @click="isxinmima = !isxinmima">
            <span v-if="!isxinmima" class="eye-closed">👁</span>
            <span v-else class="eye-open">👁</span>
          </span>
        </div>
      </div>

      <div class="input-item">
        <label>确认密码</label>
        <div class="input-box">
          <input
            v-model="querenmima"
            :type="isquerenmima ? 'text' : 'password'"
            placeholder="请确认新密码"
          />
          <span class="eye-icon" @click="isquerenmima = !isquerenmima">
            <span v-if="!isquerenmima" class="eye-closed">👁</span>
            <span v-else class="eye-open">👁</span>
          </span>
        </div>
      </div>

      <p v-if="errorMsg" class="error-tip">{{ errorMsg }}</p>

      <div class="button">
        <button class="btn save" :disabled="baocunzhong" @click="baocun">{{ baocunzhong ? '保存中...' : '保存修改' }}</button>
      <button class="btn back" @click="router.back()">返回</button>
      </div>
    </div>

   
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { zongguan } from '../../fengzhuang/axios.ts'
import { useRouter } from 'vue-router'

const router = useRouter()
const yuanmima = ref('')
const xinmima = ref('')
const querenmima = ref('')
const baocunzhong = ref(false)
const isyuanmima = ref(false)
const isxinmima = ref(false)
const isquerenmima = ref(false)
const errorMsg = ref('')

const baocun = async () => {
  errorMsg.value = ''
  if (!yuanmima.value || !xinmima.value || !querenmima.value) {
    errorMsg.value = '请填写完整'
    return
  }
  if (xinmima.value !== querenmima.value) {
    errorMsg.value = '确认密码不一致'
    return
  }

  const userId = localStorage.getItem('userId')
  if (!userId) {
    errorMsg.value = '未获取到当前用户，无法修改密码'
    return
  }

  baocunzhong.value = true
  try {
    const res = await zongguan.post('/api/change-password', {
      userId: Number(userId),
      oldPassword: yuanmima.value,
      newPassword: xinmima.value
    })

    alert(res.data?.message || '密码修改成功')
    yuanmima.value = ''
    xinmima.value = ''
    querenmima.value = ''
    errorMsg.value = ''
    localStorage.removeItem('userId')
    localStorage.removeItem('token')
    router.push('/login')
  } catch (err) {
    console.error(err)
    errorMsg.value = err.response?.data?.message || '修改密码失败'
  } finally {
    baocunzhong.value = false
  }
}
</script>
<style scoped>
.xiugaimima-page {
  width: 100%;
  margin: 0 auto;
  background: transparent;
}

.card {
  background: #ffffff;
  border-radius: 20px;
  padding: 32px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}

.header-box {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-box {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #07c160, #06b057);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-box .icon {
  font-size: 36px;
  color: #fff;
}

.header-info h3 {
  font-size: 20px;
  margin: 0 0 4px;
}
.header-info p {
  font-size: 14px;
  color: #888;
}

.form-wrapper {
  background: #fff;
  border-radius: 20px;
  padding: 60px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.04);
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
}

.input-item {
  margin-bottom: 20px;
}
.input-item label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
}

.input-box {
  position: relative;
  width: 100%;
}
.input-box input {
  width: 100%;
  height: 44px;
  padding: 0 40px 0 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  box-sizing: border-box;
}

input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none;
}
input::-webkit-credentials-auto-fill-button {
  visibility: hidden;
  display: none !important;
  pointer-events: none;
}

.eye-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #999;
  font-size: 18px;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
}
.eye-icon:hover {
  color: #666;
}

.eye-closed {
  position: relative;
  display: inline-block;
}
.eye-closed::after {
  content: '';
  position: absolute;
  left: -2px;
  top: 50%;
  width: calc(100% + 4px);
  height: 2px;
  background: currentColor;
  transform: rotate(-45deg);
  transform-origin: center;
  border-radius: 1px;
}

.eye-open {
  display: inline-block;
}

.btn {
  width: 100%;
  height: 46px;
  border-radius: 8px;
  font-size: 15px;
  margin-top: 10px;
  border: none;
  cursor: pointer;
}
.save {
  background: #07c160;
  color: #fff;
}
.back {
  background: #f2f2f2;
  color: #666;
}
.error-tip{
  color:red;
}
</style>