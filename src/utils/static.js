//商品模块 操作API 对应类型
export const GOODS_API_TYPE_ACTIONS = {
  DEL: 0, //删除
  UP: 1, //上架
  DOWN: 2, //下架
  LIKE: 3, //推荐
  NO_LIKE: 4, //取消推荐
};
export const GOODS_API_TYPE_ACTIONS_TXT = {
  [GOODS_API_TYPE_ACTIONS.UP]: '上架',
  [GOODS_API_TYPE_ACTIONS.DOWN]: '下架',
  [GOODS_API_TYPE_ACTIONS.LIKE]: '推荐',
  [GOODS_API_TYPE_ACTIONS.NO_LIKE]: '取消推荐',
};

//商品模块 获取列表API 对应类型
export const GOODS_API_LIST_TYPE_CODE = {
  ALL: 0,
  UP: 1,
  WAIT: 2,
  DOWN: 3,
  CHECK: 4,
  FOUL: 10,
};
export const GOODS_API_LIST_TYPE_TXT = {
  [GOODS_API_LIST_TYPE_CODE.ALL]: '全部',
  [GOODS_API_LIST_TYPE_CODE.UP]: '已上架',
  [GOODS_API_LIST_TYPE_CODE.WAIT]: '待上架',
  [GOODS_API_LIST_TYPE_CODE.CHECK]: '待审核',
  [GOODS_API_LIST_TYPE_CODE.DOWN]: '已下架',
  [GOODS_API_LIST_TYPE_CODE.FOUL]: '违规商品',
};

export const GOODS_CHECK_STATUS_CODE = {
  N0_PASS: 0,
  PASS: 1,
  ING: 10,
};

export const GOODS_CHECK_STATUS_TXT = {
  [GOODS_CHECK_STATUS_CODE.NO_PASS]: '未通过',
  [GOODS_CHECK_STATUS_CODE.PASS]: '通过',
  [GOODS_CHECK_STATUS_CODE.ING]: '审核中',
};

export const ORDER_STATUS_CODE = {
  10: 'state_received', //待接单
  30: 'state_cooking', //已下厨
  40: 'state_success', //已完成
  0: 'state_cancel', //已取消
};

export const SUBSCRIBE_STATUS_CODE = {
  STATE_WAIT: 10,
  STATE_STORE_WAIT: 20,
  STATE_STORE_OVER: 30,
  STATE_SUCCESS: 40,
  STATE_CANCEL: 0,
};

export const SUBSCRIBE_STATUS_TXT = {
  [SUBSCRIBE_STATUS_CODE.STATE_WAIT]: '待确认',
  [SUBSCRIBE_STATUS_CODE.STATE_STORE_WAIT]: '待到店',
  [SUBSCRIBE_STATUS_CODE.STATE_STORE_OVER]: '已到店',
  [SUBSCRIBE_STATUS_CODE.STATE_SUCCESS]: '已消费',
  [SUBSCRIBE_STATUS_CODE.STATE_CANCEL]: '已取消',
};
