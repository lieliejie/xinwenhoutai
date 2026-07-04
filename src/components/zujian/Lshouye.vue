<template>
  <div class="home-container">
    <!-- 顶部欢迎区 -->
    <div class="welcome-section">
      <div class="welcome-left">
      
        <div class="brand-tag">
        </div>
        <h1 class="welcome-title">欢迎回来，{{ yonghuming }}</h1>
        <p class="welcome-subtitle">{{ today }} · 高效管理，从这里开始</p>
      </div>
    </div>

    <!-- 数据概览 -->
    <div class="stats-section">
      <div class="stats-grid">
        <router-link :to="{ path: item.path }" class="stat-card link-item" v-for="item in statsList" :key="item.id" @click="zongcangku.isshaixuanxinwen = false">
          <div class="stat-top">
            <div class="stat-icon" :style="{ background: item.iconBg, color: item.iconColor }">
              {{ item.icon }}
            </div>
            <!-- <span class="stat-trend" :class="item.trend > 0 ? 'up' : 'down'">
              {{ item.trend > 0 ? '↑' : '↓' }} {{ Math.abs(item.trend) }}%
            </span> -->
          </div>
          <div class="stat-value">{{ item.value }}</div>
          <div class="stat-label">{{ item.label }}</div>
        </router-link>
      </div>
    </div>

    <!-- 系统公告 -->
    <div class="notice-section">
      <div class="notice-header">
        <span class="notice-title">系统公告</span>
        <span class="notice-more">查看全部</span>
      </div>
      <div class="notice-list">
        <div class="notice-item" v-for="item in notices" :key="item.id">
          <span class="notice-dot"></span>
          <span class="notice-text">{{ item.title }}</span>
          <span class="notice-time">{{ item.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import xinzeng from '../tanchuzujian/xinzeng.vue';
import usezongcangku from '../pinia/index.js';

let zongcangku = usezongcangku()
const today = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long'
});

const statsList = computed(() => [
  { id: 1, icon: '👥', iconBg: '#e6f7ef', iconColor: '#07c160', label: '注册用户', value: zongcangku.cunqiantaizhuceshuju.length, trend: 15.2  ,path:'/users' },
  { id: 2, icon: '📰', iconBg: '#e8f3ff', iconColor: '#1677ff', label: '新闻内容', value: zongcangku.shuju.length, trend: 8.7  ,path:'/news'},
  { id: 3, icon: '📊', iconBg: '#fff7e6', iconColor: '#fa8c16', label: '今日访问', value: '45,892', trend: -2.1 ,path:'/tongji' },
  { id: 4, icon: '💬', iconBg: '#fff1f0', iconColor: '#f5222d', label: '待办事项', value: '18', trend: 6.3 ,path:'/news' },
]);



const notices = ref([
  { id: 1, title: '系统将于今晚 02:00 进行例行维护，预计耗时30分钟', time: '5分钟前' },
  { id: 2, title: '新版本 v2.0 已发布，新增批量导入功能', time: '2小时前' },
  { id: 3, title: '用户数据导出功能已上线，支持Excel格式', time: '1天前' },
  { id: 4, title: '系统凌晨01:00进行数据库优化维护，预计耗时40分钟', time: '12分钟前' },
  { id: 5, title: '新版本 v2.1 更新上线，新增批量数据筛选功能', time: '3小时前' },
  { id: 6, title: '操作日志导出功能开放，支持CSV文件下载', time: '半天前' },
  { id: 7, title: '明日凌晨03:00开展服务器扩容维护，预计50分钟', time: '20分钟前' },

])


let yonghuming = ref(localStorage.getItem('nickname') || '管理员')
</script>

<style scoped>
/* 微信风格全局变量 */
.link-item {
  text-decoration: none;
  color: inherit;
  display: block;
}

:root {
  --wechat-green: #07c160;
  --wechat-bg: #f5f5f5;
  --wechat-card: #ffffff;
  --wechat-text-primary: #333333;
  --wechat-text-secondary: #666666;
  --wechat-text-tertiary: #999999;
  --wechat-border: #e5e5e5;
}

.home-container {
  padding: 20px;
  background-color: var(--wechat-bg);
  min-height: 100vh;
}

/* 欢迎区 */
.welcome-section {
  background: var(--wechat-card);
  border-radius: 8px;
 
  margin-bottom: 16px;
  border: 1px solid var(--wechat-border);
}

.brand-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--wechat-green);
  padding: 4px 12px;
  border-radius: 12px;
  margin-bottom: 12px;
}

.brand-icon {
  font-size: 14px;
}

.brand-name {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}

.welcome-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--wechat-text-primary);
  margin: 0 0 8px 0;
}

.welcome-subtitle {
  font-size: 14px;
  color: var(--wechat-text-tertiary);
  margin: 0;
}

/* 数据概览 */
.stats-section {
  margin-bottom: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  
}

.stat-card {
  background: var(--wechat-card);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid var(--wechat-border);
  background-color: #e2e2e2;
  transition: all 0.5s ease;
}

.stat-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
}

.stat-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.stat-trend {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
}

.stat-trend.up {
  color: var(--wechat-green);
  background: #e6f7ef;
}

.stat-trend.down {
  color: #f5222d;
  background: #fff1f0;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--wechat-text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: var(--wechat-text-tertiary);
}

/* 快捷入口 */
.quick-section {
  margin-bottom: 16px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.quick-card {
  background: var(--wechat-card);
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  border: 1px solid var(--wechat-border);
  transition: all 0.2s ease;
}

.quick-card:hover {
  border-color: var(--wechat-green);
  box-shadow: 0 2px 8px rgba(7, 193, 96, 0.1);
}

.quick-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.quick-name {
  font-size: 14px;
  color: var(--wechat-text-primary);
  font-weight: 500;
}

/* 系统公告 */
.notice-section {
  background: var(--wechat-card);
  border-radius: 8px;
  margin-top: 40px;
  border: 1px solid var(--wechat-border);
}

.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.notice-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--wechat-text-primary);
}

.notice-more {
  font-size: 13px;
  color: var(--wechat-green);
  cursor: pointer;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.notice-item:last-child {
  border-bottom: none;
}

.notice-dot {
  width: 6px;
  height: 6px;
  background: var(--wechat-green);
  border-radius: 50%;
  flex-shrink: 0;
}

.notice-text {
  flex: 1;
  font-size: 14px;
  color: var(--wechat-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice-time {
  font-size: 12px;
  color: var(--wechat-text-tertiary);
  flex-shrink: 0;
}

/* 响应式 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .quick-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>