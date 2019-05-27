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
      { path: '/', redirect: '/api/new' },
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
            icon: 'smile',
            component: './Hooks/windows',
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
