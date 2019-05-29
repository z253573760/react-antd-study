export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [{ path: '/user', component: './Welcome' }],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/', redirect: '/api' },
      {
        path: '/api',
        name: 'v16-新特性',
        icon: 'smile',
        component: './Api/index',
      },
      {
        path: '/hooks',
        name: 'Hooks-Demo',
        icon: 'smile',
        routes: [
          {
            path: 'windows',
            name: '监听页面大小',

            component: './Hooks/windows',
          },
          {
            path: 'redux',
            name: '模拟-redux',
            component: './Hooks/useRedux',
          },
          {
            path: 'useMemo',
            name: 'useMemo-的使用',
            component: './Hooks/useMemo',
          },
          {
            path: 'useCallback',
            name: 'useCallback-的使用',
            component: './Hooks/useCallback',
          },
          {
            path: 'useList',
            name: '自己封装HOOKS轮子',
            component: './Hooks/useList',
          },
        ],
      },
      {
        path: '/UForm',
        name: '表单-UForm',
        icon: 'dashboard',
        routes: [
          {
            path: 'dashboard',
            name: '简单场景',
            component: './UForm/index.js',
          },
        ],
      },
    ],
  },
];
