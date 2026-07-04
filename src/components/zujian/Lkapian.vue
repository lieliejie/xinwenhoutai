<template>
  <div class="page-container">
    <!-- 原有统计卡片 -->
    <div class="card-group">
      <router-link
          :to="{path:'/news'}"
          @click="zongcangku.isshaixuanxinwen=false"
          class="link-item "
        > 
      <div class="stat-card">
        <div class="card-icon green">📰</div>
        <div class="card-content">
          <div class="card-label">总新闻稿件</div>
          <div class="card-value">{{ zongcangku.shuju.length }}</div>
        </div></div>
      </router-link>
       <router-link 
      :to="{path:'/news'}"
      @click="zongcangku.isshaixuanxinwen=true"
      class="link-item "
       >
      <div class="stat-card">
        <div class="card-icon green">✍️</div>
        <div class="card-content">
          <div class="card-label">今日需处理</div>
          <div class="card-value">28</div>
        </div>
      </div>
      </router-link>
      <router-link 
      :to="{path:'/news'}"
      class="link-item "
      >
        <div class="stat-card">
        <div class="card-icon orange">⏳</div>
        <div class="card-content">
          <div class="card-label">待审核稿件</div>
          <div class="card-value">12</div>
        </div>
      </div>
    </router-link>
    
    <router-link 
    :to="{path:'/users'}"
    class="link-item "
    >
        <div class="stat-card">
        <div class="card-icon green">👁️</div>
        <div class="card-content">
          <div class="card-label">前台用户</div>
          <div class="card-value">{{ zongcangku.cunqiantaizhuceshuju.length}}</div>
        </div>
      </div>
  </router-link>
    </div>

    <!-- 新增：下方内容区 -->
    <div class="content-section">
      <!-- 模块1：最近发布 -->
      <div class="section-card">
        <div class="section-header">
          <span class="section-title">📅 最近发布</span>
          <router-link :to="{path:'/news'}" class="link-item ">查看所有 →</router-link>
        </div>
        <div class="news-list">
          <div v-for="item in recentNews" :key="item.id" class="news-item">
            <router-link :to="'/xiangqing/' + item.id" class="link-item">
              <div class="news-title">{{ item.title }}</div>
            <div class="news-meta">
              <span class="meta-item">📅 {{ item.time }}</span>
              <span class="meta-item">📰 {{ item.laiYuan }}</span>
            </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- 模块2：热门新闻TOP5 -->
      <div class="section-card">
        <div class="section-header">
          <span class="section-title">🔥 热门新闻TOP5</span>
          <span class="section-more">查看排行 →</span>
        </div>
        <div class="hot-list">
          <div v-for="(item, index) in hotNews" :key="item.id" class="hot-item">
            <span class="hot-rank" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
            <div class="hot-content">
              <div class="hot-title">{{ item.title }}</div>
              <div class="hot-views">👁️ {{ item.views.toLocaleString() }} 阅读</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import usezongcangku from '../pinia';
let zongcangku = usezongcangku()
// 从 zhongzhuanshuju 中按发布日期筛选最近 5 条
const recentNews = computed(() => {
  return [...zongcangku.shuju].sort((a, b) => new Date(b.riQi).getTime() - new Date(a.riQi).getTime()).slice(0, 5)
    //sort 会遍历数组里每两个元素 a 和 b，通过返回值决定谁放前面。
    //a.riQi 单纯就是取出这条数据里日期字符串
    // getTime ：日期越新，数字越大。
    //b-a 也就是 去选取时间戳大的 也就是选取新的日期的是啊
    .map(item => ({   //比如  sort晒出来的数据有20个字段  但是只要这四个字段 就行写一个map
      id: item.id,
      title: item.biaoTi,
      time: item.riQi,
      laiYuan: item.laiYuan
    }))
})

// 模拟数据：热门新闻TOP5
const hotNews = ref([
  { id: 1, title: '突发！我市迎来强降雨天气', views: 28560 },
  { id: 2, title: '2026年高考政策最新解读', views: 21340 },
  { id: 3, title: '地铁3号线预计年底通车', views: 18920 },
  { id: 4, title: '老旧小区改造工程全面推进', views: 15670 },
  { id: 5, title: '本地特色农产品展销会开幕', views: 12450 }
])

</script>

<style scoped>
/* 页面容器：统一内边距 */
.link-item {
  text-decoration: none;
  color: inherit;
  display: block;
}
.link-item:hover{
  color: #07c160
}
.page-container {
  padding: 20px;
  background-color: #fafafa;
  min-height: 100%;
}

/* 原有统计卡片样式（保留） */
.card-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  margin-bottom: 20px;
 
}

.stat-card {
  flex: 1;
  min-width: 250px;
  background-color: #fff;
  border-radius: 8px;
  padding: 25px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

.card-icon.green {
  width: 50px;
  height: 50px;
  background-color: #07c160;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  margin-right: 20px;
  flex-shrink: 0;
}

.card-icon.orange {
  width: 50px;
  height: 50px;
  background-color: #ff9500;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  margin-right: 20px;
  flex-shrink: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
}

.card-label {
  font-size: 14px;
  color: #999;
  margin-bottom: 5px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

/* 新增：下方内容区样式 */
.content-section {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.section-card {
  flex: 1;
  min-width: 400px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.section-more {
  font-size: 14px;
  color: #07c160;
  cursor: pointer;
}

/* 最近发布列表 */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-item {
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.news-item:last-child {
  border-bottom: none;
}

.news-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.news-meta {
  display: flex;
  gap: 15px;
  align-items: center;
}

.meta-item {
  font-size: 12px;
  color: #999;
}

.meta-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.tag-green {
  background-color: #e8f8f0;
  color: #07c160;
}

.tag-orange {
  background-color: #fff5e6;
  color: #ff9500;
}

/* 热门新闻TOP5 */
.hot-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hot-rank {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  flex-shrink: 0;
}

.rank-1 { background-color: #ff4d4f; }
.rank-2 { background-color: #ff7a45; }
.rank-3 { background-color: #ffc53d; }
.rank-4, .rank-5 { background-color: #d9d9d9; color: #666; }

.hot-content {
  flex: 1;
  overflow: hidden;
}

.hot-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hot-views {
  font-size: 12px;
  color: #999;
}
</style>