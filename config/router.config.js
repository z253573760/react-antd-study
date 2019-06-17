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
      { path: '/', redirect: '/new' },
      {
        path: '/new',
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
          {
            path: 'tree',
            name: '权限树单选',
            component: './Hooks/tree',
          },
        ],
      },
      {
        path: '/UForm',
        name: '表单-UForm',
        icon: 'dashboard',
        routes: [
          {
            path: 'simple',
            name: '简单场景',
            component: './UForm/simple.js',
          },
          {
            path: 'test',
            name: '测试',
            component: './UForm/test.js',
          },
        ],
      },
      {
        path: '/test',
        name: '瞎写',
        icon: 'dashboard',
        component: './Test/index.js',
      },
    ],
  },
];
