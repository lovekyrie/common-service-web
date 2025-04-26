import { get } from '@/utils/request'

export function getPostByParams() {
  return get('/api/posts/1')
}
