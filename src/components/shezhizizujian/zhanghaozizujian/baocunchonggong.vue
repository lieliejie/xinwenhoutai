<template>
  <!-- 批量驳回确认弹窗 → 风格和你的系统完全统一 -->
  <div class="tip-modal" v-if="zongcangku.isgerenziliaochonggong">
    <div class="tip-box">
      <p>保存成功</p>
      <div class="tip-buttons">

        <button class="tip-btn confirm" @click="queren">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps } from 'vue';
import usezongcangku from '../../pinia/index.ts'
import { zongguan } from '../../fengzhuang/axios.ts'

const zongcangku = usezongcangku();
// 正确接收父组件传过来的formData
const props = defineProps(['formData'])

const userId = ref(localStorage.getItem('userId'))
onMounted(()=>{
  userId.value = localStorage.getItem('userId')
})

const queren = async () => {
  if (zongcangku.isgerensaving) return
  if (!userId.value) {
    alert('请先登录')
    return
  }
  zongcangku.isgerensaving = true
 
  try {
    const old = await zongguan.get('/houtaiyonghulist/' + userId.value)
    await zongguan.put('/houtaiyonghulist/' + userId.value, {
      ...old.data,
      nickname: props.formData.nickname,
      phone: props.formData.phone,
      email: props.formData.email,
      gender: props.formData.gender,
      bio: props.formData.bio,
      avatar: props.formData.avatar
    })
    localStorage.setItem('avatar', props.formData.avatar)
    localStorage.setItem('nickname', props.formData.nickname)
    window.dispatchEvent(new Event('refreshAvatar'))
  } catch (err){
    console.error('保存失败:', err)
    alert('保存失败，请稍后重试')
  } finally {
    zongcangku.isgerensaving = false
    zongcangku.isgerenziliaochonggong = false
  }
} 
</script>

<style>

.tip-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.tip-box {
  background: #fff;
  width: 280px;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
}

.tip-box p {
  font-size: 15px;
  margin-bottom: 18px;
  color: #333;
}

.tip-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.tip-btn {
  flex: 1;
  padding: 8px 0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.3s;
}

/* 取消按钮 → 你的灰色风格 */
.tip-btn.cancel {
  background: #f2f2f2;
  color: #666;
}
.tip-btn.cancel:hover {
  background: #e0e0e0;
}

/* 确认驳回按钮 → 你批量驳回的红色 #f56c6c */
.tip-btn.confirm {
  background: #f56c6c;
  color: #fff;
}
.tip-btn.confirm:hover {
  background: #e04b4b;
}
</style>