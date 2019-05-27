export default {
  namespace: 'user',
  state: {
    list: [],
    currentUser: {},
    group_limits: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      //dispatch({ type: 'getRoleAccess' });
    },
  },
  effects: {
    *login(_, { call, put }) {
      // const {
      //   datas: { group_limits },
      // } = yield login({});
    },
    *getRoleAccess(_, { call, put }) {
      // const {
      //   datas: { group_limits },
      // } = yield getRoleAccess();
      // yield put({
      //   type: 'save',
      //   payload: { group_limits },
      // });
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
