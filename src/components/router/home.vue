<template>
  <div class="layout">
    <!-- 左侧侧边栏：固定显示 -->
    <aside class="sidebar">
      <!-- 用了 flex 控制 左右 -->
      <Lcedaohang/>
    </aside>
    <!-- 右侧区域 -->
    <div class="right-area">
      <!-- 用了flex 和  flex-direction: column; 控制 上下-->
      <header class="header-wrapper">
        <Ldingdaohang /> 
      </header>
      <!-- 中间内容区：🔥 这里用 router-view，路由切换时这里会变 -->
      <main class="main-content"> 
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">

import Lcedaohang from '../zujian/Lcedaohang.vue'
import Ldingdaohang from '../zujian/Ldingdaohang.vue';
// 在你的布局组件（含有 router-view 的那个）中
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import usezongcangku from '../pinia'

const route = useRoute()
const zongcangku = usezongcangku()

</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  /* 相当于自动设置了： */
  /* flex-direction: row;           ← 水平方向排列 */
  /* justify-content: flex-start;   ← 从左开始 */
}
.sidebar {
  width: 220px;
  flex-shrink: 0;
  height: 100%;
}
.right-area {
    flex: 1; /* 和 sidebar 争地盘 */
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 100vh;
  
}
.header-wrapper {
  flex-shrink: 0;
  height: 70px;
 
}
.main-content {
  flex: 1;
  overflow: auto;
  padding: 20px;

  border-radius: 8px;
}
.main-content::-webkit-scrollbar {
  display: none;
}

</style>