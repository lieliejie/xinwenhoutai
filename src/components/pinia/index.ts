import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import { zongguan } from "../fengzhuang/axios";
import type { NewsItem } from "../store/xianzhi";

export const usezongcangku = defineStore('cangku', () => {
  let ceshujulist = ref([
    { id: 1, icon: '🏠', name: '首页', path: '/shouye' },
    { id: 2, icon: '📊', name: '数据统计', path: '/tongji' },
    { id: 3, icon: '👥', name: '用户管理', path: '/users' },
    { id: 4, icon: '📰', name: '新闻管理', path: '/news' },
    { id: 5, icon: '⚙️', name: '系统设置', path: '/shezhi' }
  ])

  const fenLeiLieBiao = ref([
    { id: 'quanbu', mingCheng: '全部' },
    { id: 'shizheng', mingCheng: '时政' },
    { id: 'minsheng', mingCheng: '民生' },
    { id: 'bendi', mingCheng: '本地' },
    { id: 'caijing', mingCheng: '财经' },
    { id: 'jinri', mingCheng: '今日' }
  ]);

  let ceitem = ref({})
  let shuju = ref<NewsItem[]>([])
  let isxinzeng = ref(false)
  let isfuxuan = ref(false)
  let isbohui = ref(false)
  let isfabu = ref(false)
  let shoudangqian = ref('')
  let isdbohui = ref(false)
  let isdfabu = ref(false)
  let isfbohui = ref(false)
  let isffabu = ref(false)
  let isfbbhtishi = ref(false)
  let cunqiantaizhuceshuju = ref([])
  let isshaixuanxinwen = ref(false)
  let iszhanghao = ref(false)
  let isgerenziliaochonggong = ref(false)
  let selectedList = ref([])
  let isgerensaving = ref(false)
  // 获取【待审核数据】
  let nashuju = async () => {
    try {
      let r = await zongguan.get('/zhongzhuanshuju')
      shuju.value = r.data.map((item: NewsItem) => ({
        ...item,
        isfabu: true,
        isbohui: true,
        isdel: false,
        checked: false
      }))
      
      console.log("存入store的数据：", shuju.value)
    } catch (error) {
      console.log("拿待审核数据失败", error);
    }
  }
  let naqiantaizhuceshuju =  async () => {
    try {
    let r = await zongguan.get('/api/users')
      cunqiantaizhuceshuju.value = r.data.data
      
      console.log("存入store的数据：", cunqiantaizhuceshuju.value)
    } catch (error) {
      console.log("拿前台数据失败", error);
    }
  }
  // 删除用户
  let shanyonghu = async (id: number) => {
    try {
      let r = await zongguan.delete(`/api/users/${id}`)
      cunqiantaizhuceshuju.value = r.data.data
    } catch (error) {
      console.log("删除失败", error);
    }
  }
  naqiantaizhuceshuju()
  nashuju()

  return {
    ceshujulist,
    ceitem,
    nashuju,
    shuju,
    fenLeiLieBiao,
    isxinzeng,
    isfuxuan,
    isbohui,
    isfabu,
    isdfabu,
    shoudangqian,
    isdbohui,
    isfbbhtishi,
    selectedList,
    isfbohui,
    isffabu,
    cunqiantaizhuceshuju,
    naqiantaizhuceshuju,
    shanyonghu,
    isshaixuanxinwen,
    iszhanghao,
    isgerenziliaochonggong,
    isgerensaving,

  }
})

export default usezongcangku