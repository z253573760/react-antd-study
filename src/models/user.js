import { getList } from '@/api/article';

export default {
  namespace: 'user',
  state: {
    list: [],
    currentUser: {},
    group_limits: [],
    info: {
      name: 'none',
      password: 'none',
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      //dispatch({ type: 'getRoleAccess' });
    },
  },
  effects: {
    *getInfo(_, { put }) {
      console.log('getInfo');
      const info = {
        name: 'name',
        password: 'password',
      };
      yield put({
        type: 'save',
        payload: { info },
      });
    },
    *add({ payload }, { call, put }) {
      console.log('add', payload);
    },
    *login(_, { call, put }) {
      // const {
      //   datas: { group_limits },
      // } = yield login({});
    },
    *getList(action, { call, put }) {
      console.log('getList', action);
      const data = yield getList();
      console.log('data', data);
      const data2 = yield call(getList);
      console.log('data2', data2);
    },
    *fetch(_, { call, put }) {
      // const response = yield call(queryUsers);
      // yield put({
      //   type: 'save',
      //   payload: { list: response },
      // });
    },
    *fetchCurrent(_, { call, put }) {
      // const response = yield call(queryCurrent);
      // yield put({
      //   type: 'save',
      //   payload: { currentUser: response },
      // });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
