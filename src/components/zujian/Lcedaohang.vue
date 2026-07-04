<template>
  <div class="sidebar">
    <div class="sidebar-logo">
      猎猎杰后台管理系统
    </div>
    <div class="sidebar-menu">
      <router-link            
        :class="['menu-item', { active: activePath === item.path }]" 
        v-for="item in zongcangku.ceshujulist" 
        :key="item.id"
        :to="{ path: item.path }"  
        @click="zongcangku.ceitem = item.path; zongcangku.isshaixuanxinwen = false"   
      >
        <span class="icon">{{ item.icon }}</span>
        <span class="text">{{item.name}}</span>
      </router-link>
    </div>
  </div>
</template>
       
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { usezongcangku } from '../pinia';
import { computed, onMounted, watch } from 'vue';

const route = useRoute();
const zongcangku = usezongcangku();
const menuList = zongcangku.ceshujulist;

// 计算激活路径（保留你原来逻辑，不动）
const activePath = computed(() => {
  const current = route.path
  if (current.startsWith('/shezhi')) return '/shezhi'
  if (current.startsWith('/xiangqing')) return '/news'
  const exactItem = menuList.find(m => m.path === current)
  return exactItem ? exactItem.path : ''
})

// 根据路径字符串，找到完整菜单对象{icon,name,path}
function getMenuObj(pathStr:string) {
  return menuList.find(item => item.path === pathStr)
}

// 初始化页面，把路径转成完整菜单对象存入ceitem
onMounted(() => {
  const path = activePath.value
  const targetMenu = getMenuObj(path)
  if(targetMenu) zongcangku.ceitem = targetMenu
})

// 路由切换时，自动把路径转为完整菜单对象赋值给ceitem
watch(
  () => route.path,
  () => {
    const path = activePath.value
    const targetMenu = getMenuObj(path)
    if(targetMenu) zongcangku.ceitem = targetMenu
  }
)
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
.sidebar {
  width: 210px;
  height: 100vh;
  background-color: #07c160;
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
}

.sidebar-logo {
  padding: 30px 10px;
  text-align: center;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.sidebar-menu {
  left: 0;
  width: 100%;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px 25px;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  box-sizing: border-box;
  transition: background-color 0.5s ease;
  text-decoration: none;
}
.menu-item:hover{
background-color: rgba(255, 255, 255, 0.23);
}
.active{
    background-color: rgba(255, 255, 255, 0.5);
    box-shadow: inset 4px 0 0 0 #fff;
}
.menu-item.active:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
.menu-item .icon {
  margin-right: 12px;
  font-size: 18px;
}
.menu-item .text {
  font-size: 15px;
}
</style>