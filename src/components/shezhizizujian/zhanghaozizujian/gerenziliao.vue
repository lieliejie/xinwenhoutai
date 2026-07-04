<template>
  <div class="profile-page">
    <div class="profile-card">
      <span class="close-btn" @click="router.back()" title="返回">✕</span>
      <!-- 头像区 -->
      <div class="avatar-section">
        <div class="avatar-box" @click="triggerUpload" title="点击更换头像">
          <img v-if="formData.avatar" :src="avatarSrc" class="avatar-img" @error="handleAvatarError" />
          <span v-else class="avatar-text">👤</span>
          <div class="avatar-overlay">
            <span>📷</span>
          </div>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="file-hidden"   
          @change="handleAvatarChange"
        />
        <div class="user-info">
          <h2 class="nickname">{{ formData.username || '未设置昵称' }}</h2>
          <p class="uid">ID：{{ userId || '未登录' }}</p>
        </div>
      </div>

      <!-- 表单区 -->
      <div class="form-section">
        <div class="form-item">
          <label>账号</label>
          <input v-model="formData.username" disabled class="form-input disabled-input" />
        </div>
        <div class="form-item">
          <label>昵称</label>
          <input v-model="formData.nickname" placeholder="请输入昵称" class="form-input" />
        </div>
        <div class="form-item">
          <label>手机号</label>
          <input v-model="formData.phone" placeholder="请输入手机号" class="form-input" />
        </div>
        <div class="form-item">
          <label>邮箱</label>
          <input v-model="formData.email" placeholder="请输入邮箱" class="form-input" />
        </div>
        <div class="form-item">
          <label>性别</label>
          <div class="radio-group">
            <label class="radio-item">
              <input type="radio" v-model="formData.gender" value="male" />
              <span>男</span>
            </label>
            <label class="radio-item">
              <input type="radio" v-model="formData.gender" value="female" />
              <span>女</span>
            </label>
          </div>
        </div>
        <div class="form-item">
          <label>个人简介</label>
          <textarea v-model="formData.bio" placeholder="介绍一下自己吧..." class="form-textarea" rows="3"></textarea>
        </div>

        <div class="btn-group">
          <button class="save-btn" :disabled="zongcangku.isgerensaving" @click="saveProfile">
            {{ zongcangku.isgerensaving ? '保存中...' : '保存修改' }}
          </button>
          <button class="cancel-btn" @click="cancelEdit">取消</button>
          <button class="back-btn" @click="goBack">返回</button>
        </div>
      </div>
    </div>
  </div>
  <Baocunchonggong :formData="formData"></Baocunchonggong>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// 错误写法（默认导入，会报export default不存在）
// import zongguan from '../../fengzhuang/axios.ts'

// 正确命名导入
import { zongguan } from '../../fengzhuang/axios.ts'
// import usezongcangku from '../components/pinia/index.ts'
import usezongcangku from '../../pinia/index.ts'
import Baocunchonggong from './baocunchonggong.vue'
import { getAvatarUrl, handleAvatarError } from '../../../utils/avatar.ts'

const zongcangku = usezongcangku()

const router = useRouter()

// 从localStorage取用户ID，没有则提示未登录
const rawId = localStorage.getItem('userId')
const userId = ref(rawId && rawId !== 'undefined' && rawId !== 'null' ? rawId : '')
const saving = ref(false)

// 头像 src：通过公用工具函数拼接完整 URL
const avatarSrc = computed(() => getAvatarUrl(formData.avatar))

const fileInput = ref()
//formData 是一个"容器"，用来存 onMounted 从后端拿回来的数据，然后显示在页面上。
const formData = reactive({
  username: localStorage.getItem('username') || '',
  nickname: '',
  phone: '',
  email: '',
  gender: 'male',
  bio: '',
  avatar: ''
})

// 备份初始数据，取消时直接恢复，不重复请求
const backupData = ref({})

// 点击头像触发文件选择
const triggerUpload = () => {
  fileInput.value?.click()
  //<input ref="fileInput"
}

// 选中图片后先上传到后端，拿到路径再预览
const handleAvatarChange = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    alert('图片不能超过 2MB')
    return
  }
  // 先转 base64 用于上传
  const reader = new FileReader()
  //创建一个总转战 用来 图片转 64
  // 那我就去执行别的函数？ 等   
  // reader.readAsDataURL(file) 处理完了在回过头来 执行 reader.onload
  reader.onload = async (event) => {
    const base64 = event.target.result
    // 就是转换完成后得到的 Base64 字符串（那一大串字母)
    try {
      const res = await zongguan.post('/api/admin/upload-avatar', {
        base64,
        userId: userId.value
      })
      // 后端返回纯文件名，存入 formData（数据库也只存文件名）
      const filename = res.data?.filename || res.data?.data?.filename
      formData.avatar = filename || ''
      console.log('上传成功', formData.avatar, res.data)
      // "/uploads/avatar_123_xxx.jpg"是后端存图片的位置，也是浏览器取图片的路径！
      // 数据库这个 就是 存到额硬盘的路径？
    } catch (err) {
      console.error('头像上传失败:', err)
      alert('头像上传失败')
    }
  }
  reader.readAsDataURL(file) //  先执行这个 在执行上卖弄这一块  正在把图片文件"拆"成 Base64 字母串。
}
//前端把数据发给后端
// 后端把数据存到硬盘
// 后端也存一个“这个图片的路径”
// 后端把这个路径传回给前端
// 前端就能拿着这个路径去显示图片



// ========== 页面加载：从后端获取当前用户的个人资料 ==========
//onMounted 里的代码是最先执行的
// json-server 会自动为 yonghulist 生成 REST 接口：GET /yonghulist/:id
onMounted(async () => {
  // userId 和 token 是“并存”的
  if (!userId.value) {
    console.warn('未登录，无法获取个人资料')
    return
  }
  try {
    let res = await zongguan.get('/houtaiyonghulist/' + userId.value)
    if (res.data) {
      formData.nickname = res.data.nickname || res.data.yonghuming || ''
      // 也就是说去取用户名的几率很小只是 就是组一个保险
      formData.phone = res.data.phone || ''
      formData.email = res.data.email || ''
      formData.gender = res.data.gender || 'male'
      formData.bio = res.data.bio || ''
      formData.avatar = res.data.avatar || ''
      // 存一份原始数据备份
      backupData.value = { ...formData }
    }
  } catch (err) {
    console.error('获取个人资料失败:', err)
  }
})

// ========== 保存：用 PUT /yonghulist/:id 覆盖更新用户数据 ==========
const saveProfile =  () => {
  zongcangku.isgerenziliaochonggong = true
}

const cancelEdit = () => {
  Object.assign(formData, backupData.value)
  //Object.assign(A, B) = 把 B 的内容全部复制到 A 里。
  //考试前 → 先备份一份答案（backupData）
  // 考试中 → 随便改
  // 不想改了 → 直接把备份盖回去（Object.assign）

}

const goBack = () => {
  router.back()
}

</script>

<style scoped>
.profile-page {
  width: 100%;
  margin: 0 auto;
  padding: 30px 20px;
}

.profile-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 32px 40px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  position: relative;
  transition: background 0.3s, box-shadow 0.3s;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 20px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f0f0;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, transform 0.2s;
}
.close-btn:hover {
  background: #999;
  color: #fff;
  transform: scale(1.1);
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
  margin-bottom: 30px;
}

.avatar-box {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, #07c160, #06b057);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-text {
  font-size: 44px;
  color: #fff;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  opacity: 0;
  transition: opacity 0.25s;
}

.avatar-box:hover .avatar-overlay {
  opacity: 1;
}

.file-hidden {
  display: none;
}

.nickname {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 6px 0;
}

.uid {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.form-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.form-item label {
  width: 90px;
  line-height: 44px;
  font-size: 15px;
  color: #666;
  flex-shrink: 0;
  text-align: right;
}

.form-input {
  flex: 1;
  height: 44px;
  padding: 0 14px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  background: #fff;
  color: #333;
  transition: border-color 0.2s, background 0.3s, color 0.3s;
}

.form-input:focus {
  border-color: #07c160;
}

.disabled-input {
  background: #f7f7f7;
  color: #666;
  cursor: not-allowed;
}

.form-textarea {
  flex: 1;
  padding: 12px 14px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  resize: vertical;
  font-family: inherit;
  background: #fff;
  color: #333;
  transition: border-color 0.2s, background 0.3s, color 0.3s;
}

.form-textarea:focus {
  border-color: #07c160;
}

.radio-group {
  display: flex;
  gap: 30px;
  height: 44px;
  align-items: center;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 15px;
  color: #333;
  transition: color 0.3s;
}

.radio-item input[type="radio"] {
  accent-color: #07c160;
}

.btn-group {
  display: flex;
  gap: 14px;
  margin-top: 10px;
  padding-left: 110px;
}

.save-btn {
  height: 44px;
  width: 140px;
  background: #07c160;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.save-btn:hover {
  background: #06b057;
}

.save-btn:disabled {
  background: #a0d4b0;
  cursor: not-allowed;
}

.cancel-btn,
.back-btn {
  height: 44px;
  width: 100px;
  background: #f0f0f0;
  color: #333;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover,
.back-btn:hover {
  background: #e6e6e6;
}
</style>
