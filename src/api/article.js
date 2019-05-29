import qs from 'qs';
import request from '@/utils/request';

export function getList(pageOtps = {}) {
  return request.get(`/article?${qs.stringify(pageOtps)}`);
}
