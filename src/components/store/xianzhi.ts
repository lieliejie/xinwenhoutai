// 一个菜单长什么样（id、图标、名字、地址）
// interface = “规定对象格式”
export interface xianzhichuanlaishuju {
  id: number;
  icon: string;
  name: string;
  path: string;
}
export interface NewsItem {
  id: number
  biaoTi: string
  fenLei: string
  laiYuan: string
  riQi: string
  jianJie?: string // 可选字段
  // 其他你用到的字段都可以写在这里
}