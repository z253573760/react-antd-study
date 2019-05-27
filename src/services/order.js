import axios from '@/utils/axios';
import qs from 'qs';
// 获取点餐订单列表
export function getCookList(pageOtps) {
  pageOtps = { ...pageOtps, order_sn: pageOtps.sn };
  delete pageOtps.sn;
  return axios({
    method: 'GET',
    url: `/orders/order_list?${qs.stringify(pageOtps)}`,
  });
}

//2.10 订单确认接单
export function okCook(order_id) {
  return axios({
    method: 'POST',
    url: `orders/order_receive`,
    data: { order_id },
  });
}
//2.9 订单详情
export function getCookById(order_id) {
  return axios({
    method: 'POST',
    url: `/orders/order_info`,
    data: { order_id },
  });
}
//2.13 商家操作订单

export function editCook({ order_id, type, number }) {
  return axios({
    method: 'POST',
    url: `/orders/order_edit	`,
    data: { order_id, type, number },
  });
}
//2.11 商家取消原因列表
export function cancelCookReason() {
  return axios({
    method: 'GET',
    url: `/orders/reason`,
  });
}
//2.12 商家取消操作
export function cancelCook({ cancel_reason, order_id }) {
  return axios({
    method: 'POST',
    url: `/orders/order_cancel`,
    data: {
      order_id,
      cancel_reason,
    },
  });
}
//2.1 预约单列表
export function getSubscribeList(pageOpts) {
  pageOpts = { ...pageOpts, reserve_sn: pageOpts.sn };
  delete pageOpts.sn;
  return axios({
    method: 'GET',
    url: `/orders_reserve/order_list?${qs.stringify(pageOpts)}`,
  });
}

//2.3 预约单确认接单
export function okSubscribe(reserve_id) {
  return axios({
    method: 'POST',
    url: `/orders_reserve/order_receive`,
    data: { reserve_id },
  });
}

//2.11 商家取消原因列表
export function getCancelSubscribeReason() {
  return axios({
    method: 'GET',
    url: `/orders_reserve/reason`,
  });
}

export function cancelSubscribe({ reserve_id, cancel_reason, cancel_goodsid }) {
  return axios({
    method: 'GET',
    url: `/orders_reserve/order_cance`,
  });
}
