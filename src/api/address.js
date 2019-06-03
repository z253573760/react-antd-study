import qs from 'qs';
import request from '@/utils/request';

export function getList(p_id) {
  return request.get(`/api/common/get_region?${qs.stringify({ p_id })}`);
}
