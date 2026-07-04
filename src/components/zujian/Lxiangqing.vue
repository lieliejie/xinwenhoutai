<template>
<div class="detail-page">
  <div class="detail-container">
    <!-- 文章头部 -->
    <div class="article-header">
      <!-- <div class="back-btn" @click="$router.back()">← 返回</div> -->
      <h1 class="article-title">{{ dangqianxinwen?.biaoTi }}</h1>
      <div class="article-meta">
        <div class="author-info">
          <div class="author-avatar">📰</div>
          <div class="author-text">
            <div class="author-name">{{ dangqianxinwen?.laiYuan || '未知来源' }}</div>
            <div class="publish-info">{{ dangqianxinwen?.riQi }} · {{ fenlei(dangqianxinwen?.fenLei) }} · 已阅读 {{ dangqianxinwen?.yueduLiang || 0 }} 次</div>
          </div>
        </div>
        <div class="article-actions">
          <span class="action-btn" @click="$router.back()">返回列表</span>
        </div>
      </div>
    </div>

    <!-- 引导语 -->
    <div class="article-lead" v-if="dangqianxinwen?.jianJie">
     {{ dangqianxinwen.jianJie }}
    </div>

    <!-- 正文 -->
    <div class="article-body">
      <p class="body-text">{{ dangqianxinwen?.neiRong }}</p>
      
      <div class="body-image" v-if="dangqianxinwen?.tuPian && dangqianxinwen.tuPian.length">
        <div class="img-placeholder">
          <img :src="getImageUrl(dangqianxinwen.tuPian[0])" alt="新闻图片" />
        </div>
      </div>
    </div>

    <!-- 审核操作区 -->
    <div class="article-audit">
      <div class="audit-info">
        <span class="audit-label">审核状态：待处理</span>
        <div class="audit-btns">
          <button class="btn-publish" @click="fabu(dangqianxinwen)">发布</button>
          <button class="btn-reject" @click="bohui(dangqianxinwen)">驳回</button>
        </div>
      </div>
    </div>

    <!-- 发布确认弹窗（自给自足） -->
    <div class="modal-overlay" v-if="showFabuModal">
      <div class="modal-box">
        <div class="modal-title">确认发布</div>
        <div class="modal-body">确定要发布《{{ dangqianxinwen?.biaoTi }}》吗？</div>
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="showFabuModal = false">取消</button>
          <button class="modal-btn confirm" @click="confirmFabu">确认发布</button>
        </div>
      </div>
    </div>

    <!-- 声明 -->
    <div class="article-declare">
      声明：本文内容仅供参考，不构成任何投资建议。文中所述观点仅代表作者个人立场，与本平台无关。
    </div>

    <!-- 相关推荐 -->
    <!-- <div class="related-section" v-if="xiangguanTuijian.length">
      <div class="related-title">相关推荐</div>
      <div class="related-list">
        <div class="related-item" v-for="item in xiangguanTuijian" :key="item.id">
          <router-link :to="'/xiangqing/' + item.id" class="related-link">
            <div class="related-img">
              <img v-if="item.tuPian && item.tuPian.length" :src="item.tuPian[0]" alt="" />
            </div>
            <div class="related-text">{{ item.biaoTi }}</div>
          </router-link>
        </div>
      </div>
    </div> -->
  </div>
</div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import usezongcangku from '../pinia/index.ts'
import { onMounted } from 'vue'
import { getImageUrl } from '../../utils/avatar.ts'

onMounted(() => {
  // 找到父菜单 /news 对应的菜单数据
  const newsMenu = zongcangku.ceshujulist.find(m => m.path === '/news')
  if(newsMenu) {
    zongcangku.ceitem = newsMenu
  }
})
const zongcangku = usezongcangku()
const route = useRoute()
const router = useRouter()

// 根据路由参数 id 找到当前这一条新闻（从 zhongzhuanshuju 中查找）
const dangqianxinwen = computed(() => {
  return zongcangku.shuju.find(item => item.id == route.params.id)
})

// 分类名称映射
const fenlei = (fenLei) => {
  return zongcangku.fenLeiLieBiao.find(item => item.id === fenLei)?.mingCheng || '未知'
}

// 相关推荐：取同分类的其他新闻，最多 3 条
const xiangguanTuijian = computed(() => {
  if (!dangqianxinwen.value) return []
  return zongcangku.shuju
    .filter(item => item.id !== dangqianxinwen.value.id && item.fenLei === dangqianxinwen.value.fenLei)
    .slice(0, 3)
})

// ========== 发布与驳回 ==========
let showFabuModal = ref(false)

const fabu = (item) => {
  zongcangku.shoudangqian = item
  
  showFabuModal.value = true
}

const confirmFabu = () => {
  showFabuModal.value = false
  router.back()
}

const bohui = (item) => {
  zongcangku.shoudangqian = item
  router.back()
}


</script>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }

.detail-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 50%, #f0f2f5 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.detail-container {

  margin: 0 auto;
  padding: 48px 48px 80px;
  background: #ffffff;
  min-height: 100vh;
  box-shadow: 0 2px 40px rgba(0, 0, 0, 0.06);
}

/* ========== 文章头部 ========== */
.article-header {
  position: relative;
  padding-bottom: 28px;
  margin-bottom: 32px;
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(90deg, #07c160, #06ad56, #10b981) 1;
}
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #07c160;
  padding: 8px 18px;
  border-radius: 24px;
  background: rgba(7, 193, 96, 0.06);
  margin-bottom: 20px;
  transition: all 0.3s;
  font-weight: 500;
}
.back-btn:hover {
  background: rgba(7, 193, 96, 0.14);
  transform: translateX(-3px);
}
.article-title {
  font-size: 32px;
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1.45;
  margin-bottom: 24px;
  letter-spacing: 0.3px;
}
.article-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}
.author-info {
  display: flex;
  align-items: center;
  gap: 14px;
}
.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(7, 193, 96, 0.3);
}
.author-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 3px;
}
.publish-info {
  font-size: 12px;
  color: #999;
  letter-spacing: 0.2px;
}
.action-btn {
  padding: 10px 28px;
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  color: #fff;
  border-radius: 24px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(7, 193, 96, 0.3);
  letter-spacing: 0.5px;
}
.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(7, 193, 96, 0.45);
}

/* ========== 引导语 ========== */
.article-lead {
  font-size: 15px;
  color: #555;
  line-height: 1.9;
  padding: 22px 28px;
  background: linear-gradient(135deg, rgba(7, 193, 96, 0.04) 0%, rgba(6, 173, 86, 0.04) 100%);
  border-radius: 12px;
  border-left: 4px solid #07c160;
  margin-bottom: 36px;
  position: relative;
}
.article-lead::before {
  content: '"';
  position: absolute;
  top: -8px;
  left: 16px;
  font-size: 48px;
  color: rgba(7, 193, 96, 0.15);
  font-family: Georgia, serif;
  line-height: 1;
}

/* ========== 正文 ========== */
.article-body {
  margin-bottom: 40px;
}
.body-text {
  font-size: 17px;
  color: #333;
  line-height: 2;
  margin-bottom: 28px;
  text-indent: 2em;
  text-align: justify;
}
.body-image {
  margin: 32px 0;
  display: flex;
  justify-content: flex-start;
}
.img-placeholder {
  max-width: 100%;
  display: inline-block;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.1);
}
.img-placeholder img {
  display: block;
  max-width: 100%;
  max-height: 520px;
  width: auto;
  height: auto;
  border-radius: 16px;
  object-fit: contain;
  transition: transform 0.5s;
}
.img-placeholder img:hover {
  transform: scale(1.02);
}

/* ========== 审核操作区 ========== */
.article-audit {
  margin: 36px 0 28px;
  padding: 28px 32px;
  background: linear-gradient(135deg, #f6fdf9 0%, #e6f7ef 100%);
  border-radius: 16px;
  border: 1px solid rgba(7, 193, 96, 0.15);
}
.audit-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}
.audit-label {
  font-size: 15px;
  color: #333;
  font-weight: 600;
}
.audit-btns {
  display: flex;
  gap: 14px;
}
.btn-publish {
  padding: 10px 28px;
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  color: #fff;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(7, 193, 96, 0.3);
}
.btn-publish:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(7, 193, 96, 0.45);
}
.btn-reject {
  padding: 10px 28px;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: #fff;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
}
.btn-reject:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(231, 76, 60, 0.45);
}

/* ========== 发布确认弹窗 ========== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-box {
  background: #fff;
  border-radius: 16px;
  padding: 32px 36px;
  min-width: 380px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 16px;
}
.modal-body {
  font-size: 14px;
  color: #555;
  margin-bottom: 28px;
  line-height: 1.7;
}
.modal-actions {
  display: flex;
  gap: 14px;
  justify-content: flex-end;
}
.modal-btn {
  padding: 10px 26px;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}
.modal-btn.cancel {
  background: #f0f0f0;
  color: #666;
}
.modal-btn.cancel:hover {
  background: #e0e0e0;
}
.modal-btn.confirm {
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(7, 193, 96, 0.3);
}
.modal-btn.confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(7, 193, 96, 0.45);
}

/* ========== 声明 ========== */
.article-declare {
  font-size: 12px;
  color: #bbb;
  line-height: 1.8;
  padding: 20px 0;
  border-top: 1px solid #f0f0f0;
  margin-bottom: 0;
}

/* ========== 相关推荐 ========== */
.related-section {
  margin-top: 48px;
  padding-top: 36px;
  border-top: 2px solid transparent;
  border-image: linear-gradient(90deg, #07c160, #06ad56, #10b981) 1;
}
.related-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.related-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #07c160, #06ad56);
  border-radius: 2px;
}
.related-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.related-item {
  cursor: pointer;
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.35s;
  background: #fafbfc;
}
.related-item:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(7, 193, 96, 0.15);
  background: #fff;
}
.related-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
.related-img {
  width: 100%;
  height: 150px;
  background: linear-gradient(135deg, #e8ecf1, #dce2e8);
  overflow: hidden;
}
.related-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}
.related-item:hover .related-img img {
  transform: scale(1.08);
}
.related-text {
  font-size: 14px;
  color: #333;
  line-height: 1.7;
  padding: 14px 16px 18px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 500;
}
.related-item:hover .related-text {
  color: #07c160;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .detail-container {
    padding: 24px 20px 60px;
  }
  .article-title {
    font-size: 24px;
  }
  .related-list {
    grid-template-columns: 1fr;
  }
  .article-audit {
    padding: 20px 20px;
  }
}
</style>
