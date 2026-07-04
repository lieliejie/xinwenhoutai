<template>
  <div class="dialog-overlay" v-if="zongcangku.isxinzeng">
    <div class="dialog-box">
      <!-- 右上角关闭叉号 -->
      <span class="close-btn" @click="guanbi">✕</span>

      <h3 class="dialog-title">新增新闻</h3>

      <div class="form-item">
        <label>新闻标题</label>
        <input v-model="form.biaoTi" type="text" placeholder="请输入标题" />
      </div>

      <div class="form-item">
        <label>分类</label>
        <select v-model="form.fenLei" >
            <option value="" disabled selected hidden>请选择分类</option>
          <option
            v-for="item in zongcangku.fenLeiLieBiao"
            :key="item.id"
            :value="item.id">
            {{ item.mingCheng }}
          </option>
        </select>
      </div>

      <div class="form-item">
        <label>来源</label>
        <input v-model="form.laiYuan" type="text" placeholder="请输入来源" />
      </div>

      <div class="form-item">
        <label>图片地址</label>
        <input 
          ref="tupiankuang"
          type="file" 
          accept="image/*" 
          @change="chulitupian"
        />
      </div>

      <!-- <div class="form-item">
        <label>发布日期</label>
        <input v-model="form.riQi" type="date" />
      </div> -->

      <div class="form-item">
        <label>简介</label>
        <textarea v-model="form.jianJie" placeholder="请输入新闻简介" rows="3"></textarea>
      </div>
        <div class="form-item">
        <label>内容</label>
        <textarea v-model="form.neiRong" placeholder="请输入新闻内容" rows="3"></textarea>
      </div>


      <!-- <div class="form-item">
        <label>置顶</label>
        <label class="switch-label">
          <input type="checkbox" v-model="form.isTop" /> 是
        </label>
      </div> -->

      <div class="dialog-footer">
        <button class="btn-cancel" @click="guanbi">取消</button>
        <button 
          class="btn-confirm" 
          @click="querenxinzeng"
          :disabled="submitting"
        >
          {{ submitting ? '提交中...' : '确认新增' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { zongguan } from '../fengzhuang/axios';  // 路径根据项目调整
import usezongcangku from '../pinia';

const zongcangku = usezongcangku();

const form = reactive({
  biaoTi: '',
  fenLei: '',
  laiYuan: '',
  riQi: new Date().toISOString().slice(0, 10),
  jianJie: '',
  neiRong: '',
  yueduLiang: 0,
  tuPian: '',
  isTop: false,
  shouCang: false
});

// 提交中状态（防止重复点击）
const submitting = ref(false);
// 文件输入框引用
const tupiankuang = ref(null);

// 选了本地图片 → 转 base64 → 调后端存成文件 → 返回可访问的 URL
const chulitupian = () => {
  const file = tupiankuang.value?.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    // reader.result 就是 base64 字符串
    form.tuPian = reader.result
  }
  reader.readAsDataURL(file)
}

const resetForm = () => {
  form.biaoTi = '';
  form.laiYuan = '';
  form.jianJie = '';
  form.tuPian = '';
  form.neiRong = '';
  form.yueduLiang = 0;
  form.isTop = false;
  form.shouCang = false;
  // 重置为默认分类和当前日期
  form.fenLei = zongcangku.fenLeiLieBiao[0]?.id || 'bendi';
  form.riQi = new Date().toISOString().slice(0, 10);
  // 清空文件选择框
  if (tupiankuang.value) {
    tupiankuang.value.value = ''
  }
};


const guanbi = () => {
  resetForm();
  zongcangku.isxinzeng = false;
};


const querenxinzeng = async () => {
  // 1. 防止重复提交
  if (submitting.value) return;

  // 2. 简单的表单校验
  if (!form.biaoTi.trim()) {
    alert('请输入新闻标题');
    return;
  }

  // 3. 开始提交
  submitting.value = true;

  try {
    const res = await zongguan.post('/zhongzhuanshuju', {
      biaoTi: form.biaoTi,
      fenLei: form.fenLei,
      isTop: form.isTop,
      laiYuan: form.laiYuan,
      riQi: form.riQi,
      jianJie: form.jianJie,
      tuPian: form.tuPian,
      shouCang: form.shouCang,
      neiRong: form.neiRong,
      yueduLiang: 0,
      status: 0
    });
    alert('新增成功');

    // 4. 关闭弹窗（自动清空表单）
    guanbi();

        //数据类型   //直接存进 zongcangku（总仓库 
    if (typeof zongcangku.nashuju === 'function') {
      zongcangku.nashuju();
    }
  } catch (error) {
    console.error('新增失败', error);
    alert('新增失败，请稍后重试');
    // 注意：失败时不清空表单，保留用户输入方便修改
  } finally {
    // 6. 无论成功失败，都要关闭loading
    submitting.value = false;
  }
};


//后端允许 new FormData(); 这个情况下在使用
// import { ref } from 'vue';
// import usezongcangku from '../pinia';
// import { zongguan } from '../fengzhuang/axios';

// let zongcangku = usezongcangku();
// let submitting  = ref(false);
// const tupiankuang = ref(null)

// let form = {
//   biaoTi: '',
//   fenLei: '',
//   laiYuan: '',
//   riQi: new Date().toISOString().slice(0, 10),
//   jianJie: '',
//   tuPian: '',
//   isTop: false, 
// }

// let chongzhi = ()=>{
//   form.biaoTi = '';
//   form.laiYuan = '';
//   form.jianJie = '';
//   form.tuPian = '';
//   form.fenLei = zongcangku.fenLeiLieBiao[0]?.id || 'bendi';
//   form.riQi = new Date().toISOString().slice(0, 10);
//   if (tupiankuang.value) {
//     tupiankuang.value = ''
//   }
// }
// //所以两个都要清，一个管后台数据干净，一个管前台界面干净，各管各的，缺一不可
// //一个管屏幕上显示的，一个管内存里记的，两样都清干净，下次从头来

// let guanbi = ()=>{
//   chongzhi();
//   zongcangku.isxinzeng = false;
// }

// let querenxinzeng = async () => {
//   // 1. 简单校验
//   if (!form.biaoTi.trim()) {
//     alert('请输入标题');
//     return;
//   }
//   if (!form.fenLei) {
//     alert('请选择分类');
//     return;
//   }
//   submitting.value = true;
//   try {
//       const xiangzi = new FormData();
//       xiangzi.append('biaoTi', form.biaoTi);
//       xiangzi.append('fenLei', form.fenLei);
//       xiangzi.append('laiYuan', form.laiYuan);
//       xiangzi.append('riQi', form.riQi);
//       xiangzi.append('jianJie', form.jianJie);
//       xiangzi.append('isTop', form.isTop || false);
//       const file = tupiankuang.value?.files[0];
//       xiangzi.append('tuPian', file || '');  // 有图放图，没图放空字符串      // 图片文件用 tuPian 字段
//     await zongguan.post('/zhongzhuanshuju', xiangzi);
//     alert('新增成功');
//     zongcangku.nashuju();
//     guanbi();
//   } catch (error) {
//     alert('新增失败，请稍后重试');
//     console.error('新增失败', error);
//   } finally {
//     submitting.value = false;
//   }
// };
</script>

<style scoped>
/* 原有样式保持不变，只补充 textarea 的样式 */

.dialog-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}


.dialog-box {
  position: relative;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  width: 500px; /* 稍微加宽以容纳更多字段 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 22px;
  color: #999;
  cursor: pointer;
  user-select: none;
}
.close-btn:hover {
  color: #333;
}

.dialog-title {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.form-item {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.form-item label {
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
}


.form-item input[type="text"],
.form-item input[type="date"],
.form-item select,
.form-item textarea {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-item input:focus,
.form-item select:focus,
.form-item textarea:focus {
  border-color: #07c160;
}

.switch-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  gap: 12px;
}

.btn-cancel,
.btn-confirm {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #666;
}
.btn-cancel:hover {
  background-color: #e8e8e8;
}

.btn-confirm {
  background-color: #07c160;
  color: #fff;
}
.btn-confirm:hover {
  background-color: #06ad56;
}

/* 提交中按钮的禁用样式 */
.btn-confirm:disabled {
  background-color: #90e3a9;
  cursor: not-allowed;
}
</style>