<template>
  <Lcedaohang></Lcedaohang>
  <div class="settings-page">
    <!-- 在 /shezhi 及其子路由下都显示设置列表 -->
    <div v-show="route.path.startsWith('/shezhi')">
      <div class="settings-card">
        <div class="header-box">
          <div class="icon-box">
            <span class="icon">⚙️</span>
          </div>
          <div class="header-info">
            <h3>系统设置</h3>
            <p>新闻资讯管理系统 · 配置中心</p>
          </div>
        </div>
      </div>

      <div class="menu-wrapper">
        <router-link 
        v-for="item in shezhiList"
        :key="item.path"
        :to="item.path" 
         class="link-item"
        >
          <div class="menu-item" :class="{ active: route.path === item.path || route.path.startsWith(item.path + '/') }">
            <div class="menu-left">
              <span class="icon">{{ item.icon }}</span>
              <span class="text">{{ item.text }}</span>
            </div>
            <span class="arrow">></span>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 子路由出口：始终存在，子路由时撑满页面 -->
    <router-view />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import usezongcangku from "../pinia";
import Lcedaohang from "./Lcedaohang.vue";
const route = useRoute()
const zongcangku = usezongcangku();

const shezhiList = [
  { path: '/shezhi/zhanghao', icon: '👤', text: '我的账号' },
  { path: '/shezhi/zhuti', icon: '🎨', text: '主题设置' },
  { path: '/shezhi/tongzhi', icon: '🔔', text: '消息通知' },
  { path: '/shezhi/beifen', icon: '💾', text: '数据备份' },
  { path: '/shezhi/xitong', icon: 'ℹ️', text: '关于系统' },
];
</script>

<style scoped>
/* 去掉 router-link 默认样式 */
.link-item {
  text-decoration: none;
  color: inherit;
  display: block;
}

/* 你的原有样式保持不变 */
.settings-page {
  width: 100%;
  margin: 0 auto;
  padding: 25px 20px;
  background: #f5f7fa;
}

.settings-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 32px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  transition: all 0.25s ease;
}
.settings-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
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
  font-weight: 600;
  color: #121212;
  margin: 0 0 4px 0;
}
.header-info p {
  font-size: 14px;
  color: #888;
  margin: 0;
}

.menu-wrapper {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  font-size: 16px;
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
  transition: all 0.2s ease;
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-item:active {
  background: #f7f7f7;
  transform: scale(0.98);
}
.menu-item:hover {
  background: #fafafa;
  padding-left: 28px;
}

.menu-item.active {
  background: #e8f8f2;
  border-left: 4px solid #07c160;
}
.menu-item.active .text {
  color: #056b3a;
  font-weight: 700;
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.menu-left .icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}
.text {
  color: #222;
  font-weight: 500;
}

.arrow {
  color: #ccc;
  font-size: 16px;
}
</style>