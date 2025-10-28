import axios from 'axios'
import { Message } from 'element-ui'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL || '', // 后端服务地址（从环境变量读取）
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    console.log('发送请求:', config.method?.toUpperCase(), config.url)

    // 可以在这里添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数
    const res = response.data
    console.log('响应数据:', res)

    // 如果后端返回的数据结构有特定格式，可以在这里处理
    if (res.success === false) {
      Message({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5 * 1000,
      })
      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数
    console.error('响应错误:', error)

    let message = '请求失败'

    if (error.response) {
      // 服务器响应了错误状态码
      const { status, data } = error.response

      switch (status) {
        case 400:
          message = data?.message || '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          // 可以在这里处理登录过期，跳转到登录页
          localStorage.removeItem('token')
          // window.location.href = '/login'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = data?.message || `请求失败 (${status})`
      }
    }
    else if (error.request) {
      // 请求已发出但没有收到响应
      if (error.code === 'ECONNABORTED') {
        message = '请求超时，请检查网络连接'
      }
      else {
        message = '网络错误，请检查网络连接'
      }
    }
    else {
      // 其他错误
      message = error.message || '请求失败'
    }

    Message({
      message,
      type: 'error',
      duration: 5 * 1000,
    })

    return Promise.reject(error)
  },
)

// 封装常用的请求方法
const request = {
  /**
   * GET请求
   * @param {string} url 请求地址
   * @param {object} params 请求参数
   * @param {object} config 额外配置
   */
  get(url, params = {}, config = {}) {
    return service({
      method: 'GET',
      url,
      params,
      ...config,
    })
  },

  /**
   * POST请求
   * @param {string} url 请求地址
   * @param {object} data 请求数据
   * @param {object} config 额外配置
   */
  post(url, data = {}, config = {}) {
    return service({
      method: 'POST',
      url,
      data,
      ...config,
    })
  },

  /**
   * PUT请求
   * @param {string} url 请求地址
   * @param {object} data 请求数据
   * @param {object} config 额外配置
   */
  put(url, data = {}, config = {}) {
    return service({
      method: 'PUT',
      url,
      data,
      ...config,
    })
  },

  /**
   * DELETE请求
   * @param {string} url 请求地址
   * @param {object} params 请求参数
   * @param {object} config 额外配置
   */
  delete(url, params = {}, config = {}) {
    return service({
      method: 'DELETE',
      url,
      params,
      ...config,
    })
  },

  /**
   * PATCH请求
   * @param {string} url 请求地址
   * @param {object} data 请求数据
   * @param {object} config 额外配置
   */
  patch(url, data = {}, config = {}) {
    return service({
      method: 'PATCH',
      url,
      data,
      ...config,
    })
  },

  /**
   * 上传文件
   * @param {string} url 请求地址
   * @param {FormData} formData 文件数据
   * @param {object} config 额外配置
   */
  upload(url, formData, config = {}) {
    return service({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    })
  },

  /**
   * 下载文件
   * @param {string} url 请求地址
   * @param {object} params 请求参数
   * @param {string} filename 文件名
   */
  download(url, params = {}, filename = 'download') {
    return service({
      method: 'GET',
      url,
      params,
      responseType: 'blob',
    }).then((response) => {
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    })
  },
}

// 导出axios实例和封装的请求方法
export default request
export { service }
