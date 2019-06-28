import qs from 'qs';
import request from '@/utils/axios';

export function getList(pageOtps = {}) {
  return request.get(`/article?${qs.stringify(pageOtps)}`);
}
