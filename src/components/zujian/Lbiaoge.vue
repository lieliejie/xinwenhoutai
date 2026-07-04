<template>
  <div class="table-container">
    <div class="table-header">
      <span class="table-title">用户列表</span>
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th>用户ID</th>
          <th>用户名称</th>

          <th>用户状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in zongcangku.cunqiantaizhuceshuju" :key="item.id">
          <td>{{  item.id }}</td>
          <td>{{item.yonghuming}}</td>
         
          <td>
            <span class="status active">正常</span>
          </td>
          <td>
            
            <span class="operate red" @click="shanchu(item)">删除</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup> 
 import usezongcangku from '../pinia';
 import { zongguan } from '../fengzhuang/axios';
 let zongcangku = usezongcangku()

 const shanchu = async (item) => {
   try {
     const r = await zongguan.delete(`/api/users/${item.id}`)
     console.log('删除响应:', r.data)
     zongcangku.naqiantaizhuceshuju()
   } catch (e) {
     console.error('删除失败:', e)
     alert('删除失败: ' + (e.response?.data?.message || e.message))
   }
 }
</script>

<style scoped>
/* 表格外层容器：白色背景，圆角8px，阴影，溢出隐藏 */
.table-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  width: 100%;
  margin-top: 20px;
  overflow: hidden;  /* 如果表格内容超出，直接截断，没有滚动条 */
  overflow-x: auto;  /* 超出时横向滚动，而不是截断 */

}

/* 表格头部：内边距20px，底部边框，弹性布局 */
.table-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

/* 表格标题：加粗，深灰色，18px */
.table-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 表格：全屏宽度，合并边框，文字左对齐 */
.data-table {
  width: 100%;
  border-collapse:collapse;/* ← 边框合并成一条，没有缝隙 */
  /* border-collapse:separate;  ← 边框合并成一条，有缝隙 */
  text-align: left;
}

/* 表头：浅灰色背景，内边距16px，15px文字，左对齐 */
thead th {
  background-color: #fafafa;
  padding: 16px;
  font-size: 15px;
  color: #666;
  font-weight: normal;
}

/* 表格内容行：底部边框，鼠标悬浮浅灰背景 */
tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.6s ease;  /* 悬浮时平滑变色 */
}
tbody tr:hover {
background-color: #f0f0f0;
}

/* 单元格：内边距16px，14px文字，深灰色 */
tbody td {
  padding: 16px;
  font-size: 14px;
  color: #333;
}

/* 状态标签：微信绿色，圆角4px，内边距4px 10px，白色文字 */
.status.active {
  background-color: #07c160;
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
}

/* 操作按钮：间距8px，鼠标手势 */
.operate {
  margin-right: 8px;
  cursor: pointer;
  font-size: 14px;
}

/* 绿色编辑按钮 */
.operate.green {
  color: #07c160;
}

/* 红色删除按钮 */
.operate.red {
  display: block;
  width: 50px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border: 1px solid #f56c6c;
  border-radius: 4px;
  color: #f56c6c;
  transition: all 0.4s;
}

.operate.red:hover {
background-color: #f56c6c;
color: #fff;
}
</style>