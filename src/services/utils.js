import axios from '@/utils/axios';
// 判断OSS
export function isOss() {
  return axios({
    method: 'POST',
    url: '/images/get_setting',
  });
}
// 获取OSS
export function getOss(savetype) {
  return axios({
    method: 'POST',
    url: '/images/get_mobile_sts',
    data: { savetype },
  });
}
