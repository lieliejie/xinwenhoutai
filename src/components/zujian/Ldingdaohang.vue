<template>
  <div class="header">
    <div class="header-left">
      <span class="title">{{ zongcangku.ceitem?.icon }}</span>
      <span class="title">{{ zongcangku.ceitem?.name }}</span>
    </div>
    <div class="header-right">
      <router-link :to="{path: '/shezhi/zhanghao'}" style="text-decoration: none">
        <div class="user-info">
          <div class="avatar-box">
            <img :src="avatarUrl" @error="loadDefaultAvatar" alt="头像"/>
          </div>
          <span class="username">{{ yhmRef }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import usezongcangku from '../pinia'
import { getAvatarUrl, defaultAvatar } from '../../utils/avatar.ts'

const zongcangku = usezongcangku()
const route = useRoute()

const touxiangRef = ref(localStorage.getItem('avatar') || '')
function getShowNickName() {
  const nick = localStorage.getItem('nickname')
  return nick ? nick : '管理员'
}
const yhmRef = ref(getShowNickName())

const avatarUrl = computed(() => getAvatarUrl(touxiangRef.value))

// 极端兜底，避免裂图
const loadDefaultAvatar = (e) => {
  if (!e?.target) return
  e.target.src = defaultAvatar
}

// 刷新头像&昵称
function shuaXinTouXiang() {
  touxiangRef.value = localStorage.getItem('avatar') || ''
  yhmRef.value = getShowNickName()
}

// 路由切换刷新用户信息
watch(route, () => {
  shuaXinTouXiang()
})

// 全局监听头像刷新事件（修改头像后触发）
function handleRefresh() {
  shuaXinTouXiang()
}

onMounted(() => {
  window.addEventListener('refreshAvatar', handleRefresh)
})
onUnmounted(() => {
  window.removeEventListener('refreshAvatar', handleRefresh)
})
</script>

<style scoped>
.header {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  box-sizing: border-box;
}
.header-left .title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-left: 8px;
}
.header-right {
  display: flex;
  align-items: center;
}
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.avatar-box {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}
.avatar-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.username {
  font-size: 15px;
  color: #333;
}
</style>