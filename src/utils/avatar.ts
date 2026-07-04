// ========== 后台管理系统静态资源统一工具 ==========
// 本地默认头像：直接使用 public 下的相对根路径，避免打包/解析问题
// 请确保 `xinwenhoutai/public/uploads/default.png` 或 `xinwenhoutai/uploads/default.png` 存在
const defaultAvatar = '/uploads/default.png'

/** 后端静态资源域名 + /uploads/，通过 .env.development / .env.production 区分环境 */
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

/**
 * 把数据库里存的 /uploads/xxx 或纯文件名转成完整 URL
 * - data: → 直接返回（base64）
 * - http/https → 直接返回（已是完整外部 URL）
 * - /uploads/xxx 或纯文件名 → 提取文件名，拼接 `${BACKEND_URL}/uploads/${filename}`
 * - 兼容数组、对象包裹的图片字段，避免渲染时报错
 */
function normalizeUploadSrc(src: unknown): string {
  if (typeof src === 'string') return src.trim()

  if (Array.isArray(src)) {
    for (const item of src) {
      const normalized = normalizeUploadSrc(item)
      if (normalized) return normalized
    }
    return ''
  }

  if (src && typeof src === 'object') {
    const maybeUrl = (src as { url?: unknown; src?: unknown; path?: unknown; name?: unknown }).url
      ?? (src as { url?: unknown; src?: unknown; path?: unknown; name?: unknown }).src
      ?? (src as { url?: unknown; src?: unknown; path?: unknown; name?: unknown }).path
      ?? (src as { url?: unknown; src?: unknown; name?: unknown }).name
    if (typeof maybeUrl === 'string') return maybeUrl.trim()
  }

  return ''
}

function toUploadUrl(src: unknown): string {
  const value = normalizeUploadSrc(src)
  if (!value) return ''
  if (value.startsWith('data:')) return value
  if (value.startsWith('http://') || value.startsWith('https://')) return value

  // 提取纯文件名，兼容旧数据库中 /uploads/xxx 格式的数据
  const filename = value.split('/').pop() || ''
  if (!filename) return ''
  return `${BACKEND_URL}/uploads/${filename}`
}

/**
 * 获取头像完整 URL
 * - 空值或无有效文件名 → 本地默认头像
 */
export function getAvatarUrl(avatar: string | null | undefined): string {
  const url = toUploadUrl(avatar)
  return url || defaultAvatar
}

/**
 * 获取新闻图片完整 URL（头像逻辑一致，都是 /uploads 下的静态资源）
 * - 空值 → 返回空字符串（调用方可据此不渲染图片）
 */
export function getImageUrl(src: string | null | undefined): string {
  return toUploadUrl(src)
}

/**
 * 把 tuPian 字段（可能是字符串或字符串数组）转成可渲染的 URL 数组
 */
export function getImageArr(pic: string | string[] | null | undefined): string[] {
  if (!pic) return []
  const arr = Array.isArray(pic) ? pic : [pic]
  return arr.map(getImageUrl).filter(Boolean)
}

/** 头像 img 加载失败时回退到默认头像 */
export function handleAvatarError(e: Event) {
  const img = e.target as HTMLImageElement
  if (img) img.src = defaultAvatar
}

export { defaultAvatar, BACKEND_URL }
