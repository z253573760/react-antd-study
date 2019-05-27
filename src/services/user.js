import request from '@/utils/request';
import axios from '@/utils/axios';
export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function queryNotices() {
  return request('/api/notices');
}

export function login({ username = 'mb5655', password = '123456', clinet = 'pc' }) {
  return axios({
    method: 'POST',
    url: '/mobile/index.php?act=login&op=login',
    data: { username, password, clinet },
  });
}

export function getRoleAccess() {
  return axios({
    method: 'POST',
    url: '/store_account/get_group_limits',
    data: {},
  });
}
