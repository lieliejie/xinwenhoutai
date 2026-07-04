<template>
  <!-- 批量驳回确认弹窗 → 风格和你的系统完全统一 -->
  <div class="tip-modal" v-if="zongcangku.isfbohui">
    <div class="tip-box">
      <p>确定要驳回新闻吗</p>
      <div class="tip-buttons">
        <button class="tip-btn cancel" @click="quxiao">取消</button>
        <button class="tip-btn confirm" @click="bohui">确认驳回</button>
      </div>
    </div>
  </div>
</template>

<script setup>

import usezongcangku from '../pinia';
import { zongguan } from '../fengzhuang/axios';
let zongcangku = usezongcangku();
// 取消
let quxiao = () => {
  zongcangku.isfbohui = false
};  
let bohui = async () => {
   try {
    // ✅ 正规 Vue 写法：Promise.all + map
    await Promise.all( //等里面所有的任务全部执行完了，我再往下走！
    //任务需求 多的情况下使用 要删除 还是要添加
     zongcangku.selectedList.map(async (item) => {
        // 驳回接口
        await zongguan.post("/bohuishuju", {
          biaoTi: item.biaoTi,
          fenLei: item.fenLei,
          laiYuan: item.laiYuan,
          riQi: item.riQi,
          jianJie: item.jianJie,
          isTop: false,
          tuPian: item.tuPian,
        });

        // 删除待审核
        await zongguan.delete(`/zhongzhuanshuju/${item.id}`);
      })
    );
    zongcangku.nashuju();
    zongcangku.isfbbhtishi = true
   
  } catch (error) {
    alert("批量驳回失败");
  }finally{
    zongcangku.isfbohui = false
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