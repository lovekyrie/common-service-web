import type { PostFromUrlEncoded, PostParams } from '@/utils/types/posts'
import { get, post } from '@/utils/request'
import qs from 'qs'

// 通过url params传参
export function getPostByParams() {
  return get('posts/1')
}

// 通过url query传参
export function getPostByQuery(params: PostParams) {
  return get('posts/search', params)
}

// 通过body(application/x-www-form-urlencoded)传参
export function postUrlEncoded(params: PostFromUrlEncoded) {
  return post('posts/test', qs.stringify(params), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

// 通过body(application/json)传参 (post的默认方式)
export function postJson(params: PostFromUrlEncoded) {
  return post('posts/json', params)
}

// 通过body(multipart/form-data)传参
export function postFormData(data: FormData) {
  return post('posts/file', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
