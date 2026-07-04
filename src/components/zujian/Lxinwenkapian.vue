  <template>
   <Lcedaohang></Lcedaohang>
    <div class="page-wrapper">
      <!-- 近日发布筛选提示条 --> 
      <div class="filter-banner" v-if="zongcangku.isshaixuanxinwen">
        <span class="filter-banner-text">🔍 正在筛选：近日发布的新闻</span>
        <button class="filter-banner-close" @click="zongcangku.isshaixuanxinwen = false">✕ 取消筛选</button>
      </div>

      <div class="table-container">
        <div class="table-header">
          <span class="table-title">{{ zongcangku.isshaixuanxinwen ? '新闻管理列表（近日发布）' : '新闻管理列表（待审核）' }}</span>
          <div class="table-button">
            <button class="add-fbtn" @click="handleAdd" v-if="!zongcangku.isshaixuanxinwen">新增</button>
            <button class="add-sbtn" @click="zongcangku.isfuxuan = !zongcangku.isfuxuan" v-if="!zongcangku.isshaixuanxinwen">{{ zongcangku.isfuxuan ? '取消选择' : '批量选择' }}</button>
            <button class="add-fbtn" @click="piliangbohuiff" v-if="zongcangku.isfuxuan && !zongcangku.isshaixuanxinwen">批量驳回</button>
            <button class="add-fbtn" @click="piliangfabu" v-if="zongcangku.isfuxuan && !zongcangku.isshaixuanxinwen">批量发布</button>
            <button class="add-fbtn" @click="yijianquanxuan" v-if="zongcangku.isfuxuan && !zongcangku.isshaixuanxinwen">{{ zongcangku.shuju.every(item => item.checked) ? '取消全选' : '一键全选' }}</button>
                                                                                        <!-- 也就是说看看每一个数据的 checked 是不是都是true -->
          </div>
        </div>

        <!-- 无近日新闻提示 -->
        <div class="empty-tip" v-if="zongcangku.isshaixuanxinwen && jinriShuju.length === 0">
          <span class="empty-icon">📭</span>
          <span class="empty-text">没有近日发布的新闻</span>
        </div>

        <table class="data-table" v-else>
          <thead>
            <tr>
              <!-- 1. 给复选框列固定宽度，防止挤压 -->
              <th v-if="zongcangku.isfuxuan && !zongcangku.isshaixuanxinwen" class="checkbox-col">选择</th>
              <th class="id-col">ID</th>
              <th>新闻标题</th>
              <th class="col-width">分类</th>
              <th class="col-width">来源</th>
              <th class="col-width">发布日期</th>
              <th class="col-width">状态</th>
              <th class="operate-col" v-if="!zongcangku.isshaixuanxinwen">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in dangqianShuju" :key="item.id">
               <router-link 
               class="link-item"
               :to="{ path: '/xiangqing/' + item.id }"
               >
              <td v-if="zongcangku.isfuxuan && !zongcangku.isshaixuanxinwen" class="checkbox-col">
                <input type="checkbox" 
                style="width: 16px; 
                height: 16px; 
                cursor: pointer;"
                v-model="item.checked"
                >
              </td>
              <td class="id-col">{{ item.id }}</td>
              <td>{{ biaoTi[item.id] }}</td>
              <td class="col-width">
                <span class="tag minsheng">{{ fenlei(item.fenLei) }}</span>
              </td>
              <td class="col-width">{{ item.laiYuan }}</td>
              <td class="col-width">{{ item.riQi }}</td>
              <td class="col-width">
                <span class="tag top">{{ item.isshenhe ? '已审核' : '待审核' }}</span>
              </td>
              <td class="operate-col" v-if="!zongcangku.isshaixuanxinwen">
                <span class="operate edit"  v-if="item.isfabu" @click.stop.prevent="fabu(item)">发布</span>
                <span class="operate delete"  v-if="item.isbohui" @click.stop.prevent="bohui(item)">驳回</span>
                <span class="operate delete"  v-if="item.isdel" @click.stop.prevent="shanchu(item)">删除</span>
              </td>
              </router-link>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
       <xinzeng></xinzeng>
       <piliangbohui></piliangbohui>
       <dangefabu></dangefabu>
      <dangebohui></dangebohui>
        <sd></sd>
      <dpiliangbohui></dpiliangbohui>
      <dpiliangfabu></dpiliangfabu>
  </template>

  <script setup>
  import { computed } from 'vue';
  import usezongcangku from '../pinia';
  import piliangbohui from '../tanchuzujian/piliangbohui.vue';
  import xinzeng from '../tanchuzujian/xinzeng.vue';
  import dangefabu from '../tanchuzujian/dangefabu.vue';
  import dangebohui from '../tanchuzujian/dangebohui.vue';
  import sd from '../tanchuzujian/sd.vue';
  import dpiliangbohui from '../tanchuzujian/dpiliangbohui.vue';
  import dpiliangfabu from '../tanchuzujian/dpiliangfabu.vue';
  import Lcedaohang from "./Lcedaohang.vue";
  let zongcangku = usezongcangku();

  // 获取今天的日期字符串（格式与 riQi 一致：YYYY-MM-DD）
  const getJinRi = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const jinRiStr = getJinRi();

  // 筛选"近日发布"（riQi === 今天）的新闻
  const jinriShuju = computed(() => {
    return zongcangku.shuju.filter(item => item.riQi === jinRiStr);
  });

  // 根据筛选状态决定展示哪个数据列表
  const dangqianShuju = computed(() => {
    return zongcangku.isshaixuanxinwen ? jinriShuju.value : zongcangku.shuju;
  });

  // 标题截取
  const biaoTi = computed(() => {
    const tong = {};
    dangqianShuju.value.map(item => {
      tong[item.id] = item.biaoTi.length > 17 ? item.biaoTi.slice(0, 17) + '...' : item.biaoTi;
    });
    return tong;
  });

  // 分类名称
  let fenlei = (fenLei) => {
    return zongcangku.fenLeiLieBiao.find(item => item.id === fenLei)?.mingCheng || '未知';
  };

let piliangbohuiff = () => {
  zongcangku.selectedList = zongcangku.shuju.filter(item => item.checked);

  if (zongcangku.selectedList.length === 0) {
    zongcangku.isbohui = true;
    return;
  }

  else{
    zongcangku.isfbohui = true
  }

 
};
   let piliangfabu = () => {
    zongcangku.selectedList = zongcangku.shuju.filter(item => item.checked)
    if (zongcangku.selectedList.length === 0) {
      zongcangku.isbohui = true
      return;
    }
   else{
    zongcangku.isffabu = true
   }
  }
  let fabu = (item)=>{
    zongcangku.shoudangqian = item
    zongcangku.isdfabu = true
    // try {
    //  await zongguan.post('zhanshishuju', {
    //     biaoTi: item.biaoTi,
    //     fenLei: item.fenLei,
    //     laiYuan: item.laiYuan,
    //     riQi: item.riQi,
    //     jianJie: item.jianJie,
    //     isTop: false,
    //     tuPian: item.tuPian,
    //     shouCang: false,
    //     status: 0
    //   })
    
   
    // await zongguan.delete(`/zhongzhuanshuju/${item.id}`)  
    // await zongcangku.nashuju();
    // alert("发布成功");
    // } catch (error) {
    //   alert("发布失败");
    // }
  }
  let bohui =  (item)=>{
     zongcangku.shoudangqian = item
     zongcangku.isdbohui = true
    // try {
    // await zongguan.post('/bohuishuju',{
    //     biaoTi: item.biaoTi,
    //     fenLei: item.fenLei,
    //     laiYuan: item.laiYuan,
    //     riQi: item.riQi,
    //     jianJie: item.jianJie,
    //     isTop: false,
    //     tuPian: item.tuPian,
    //     shouCang: false,
    //     status: 0
    //   })

    //   await zongguan.delete(`/zhongzhuanshuju/${item.id}`)
    //   await zongcangku.nashuju()
    //   alert('驳回成功')
    // } catch (error) {
    //    alert("驳回失败");
    // }
  }
  let  yijianquanxuan = ()=>{
    zongcangku.shuju.forEach(item=>item.checked = !item.checked)
    
  }
  // 新增
  const handleAdd = () => {
    zongcangku.isxinzeng = true;
  };
  </script>

  <style scoped>
  .link-item {
  text-decoration: none;
  color: inherit;
  display: contents; /* 让 router-link 不影响表格布局 */
}
  .page-wrapper {
    width: 100%;
    background-color: #f5f5f5;
    padding: 1px 0;
  
  }

  /* 筛选提示横幅 */
  .filter-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    border: 1px solid #a5d6a7;
    border-radius: 8px;
    padding: 12px 20px;
    margin: 20px auto;
    width: 100%;
    box-sizing: border-box;
  }

  .filter-banner-text {
    font-size: 14px;
    color: #2e7d32;
    font-weight: 500;
  }

  .filter-banner-close {
    padding: 4px 14px;
    background-color: #fff;
    color: #f56c6c;
    border: 1px solid #f56c6c;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .filter-banner-close:hover {
    background-color: #f56c6c;
    color: #fff;
  }

  /* 空数据提示 */
  .empty-tip {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #999;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .empty-text {
    font-size: 16px;
    color: #999;
  }

  .table-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    width: 100%;
    margin: 20px auto;
  }

  .table-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .table-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
  /* 修复按钮布局 */
  .table-button{
    display: flex;
    gap: 10px;
  }

  .add-fbtn {
    padding: 8px 20px;
    background-color: #07c160;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  .add-fbtn:hover {
    background-color: #06ad56;
  }
  .add-sbtn {
    padding: 8px 20px;
    background-color: #ffa500;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  .add-sbtn:hover {
    background-color: #ff8c00;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    table-layout: fixed; /* 关键：强制表格按列宽分配，不会被内容挤乱 */
  }

  thead th {
    background-color: #fafafa;
    padding: 16px;
    font-size: 15px;
    color: #666;
    font-weight: normal;
    white-space: nowrap; /* 防止表头文字换行 */
  }

  tbody tr {
    border-bottom: 1px solid #eee;
    transition: background-color 0.3s ease;
  }
  tbody tr:hover {
    background-color: #fafafa;
  }

  tbody td {
    padding: 16px 13px;
    font-size: 14px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 固定列宽，防止错乱 */
  .checkbox-col {
    width: 80px;
    text-align: center;
  }
  .id-col { 
    width: 60px;
    text-align: center;
  }
  .col-width {
    width: 100px;
    text-align: center;
  }
  .operate-col {
    width: 140px;
    text-align: center;
  }

  .tag {
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    color: #fff;
    display: inline-block;
  }
  .tag.minsheng {
    background-color: #07c160;
  }
  .tag.bendi {
    background-color: #ff9800;
  }
  .tag.caijing {
    background-color: #2196f3;
  }
  .tag.top {
    background-color: #ff9800;
  }
  .tag.normal {
    background-color: #ccc;
  }

  .operate {
    margin-right: 8px;
    cursor: pointer;
    font-size: 14px;
  }
  .operate.edit {
    padding: 4px 10px;
    border-radius: 10px;
    color: #fff;
    background-color: #07c160;
    transition: 0.4s;
  }
  .operate.edit:hover {
    background-color: #6ee7b7;
  }
  .operate.delete {
    padding: 4px 10px;
    border-radius: 10px;
    color: #fff;
    background-color: #f56c6c;
    transition: 0.4s;
  }
  .operate.delete:hover {
    background-color: #e04b4b;
  }
  </style>