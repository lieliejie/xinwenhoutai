import { createApp } from 'vue'
import App from './App.vue'
import router from './components/fengzhuangrouter'

// 1. 导入 createPinia
import { createPinia } from 'pinia'

const app = createApp(App)

// 2. 创建仓库实例
const pinia = createPinia()

// 3. 注册到 Vue 上
app.use(pinia)
app.use(router)

app.mount('#app')