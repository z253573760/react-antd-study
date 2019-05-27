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
      { path: '/', redirect: '/goods/list/up' },
      {
        path: '/order',
        name: '订单管理',
        icon: 'smile',
        routes: [
          {
            path: 'list/cook',
            name: '点餐订单',
            component: './Order/Cook/List',
          },
          {
            path: 'list/subscribe',
            name: '预约订单',
            component: './Order/subscribe/List',
          },
          {
            path: 'cook/detail',
            component: './Order/Cook/Detail',
          },
          {
            path: 'subscribe/detail',
            component: './Order/Subscribe/Detail',
          },
        ],
      },
      {
        path: '/goods',
        name: '商品管理',
        icon: 'smile',
        routes: [
          {
            path: 'list/check',
            name: '待审核商品',
            component: './Goods/List',
            meta: {
              types: 4,
            },
          },
          {
            path: 'list/wait',
            name: '待上架商品',
            component: './Goods/List',
            meta: {
              types: 2,
            },
          },
          {
            path: 'list/up',
            name: '已上架商品',
            component: './Goods/List',
            meta: {
              types: 1,
            },
          },
          {
            path: 'list/down',
            name: '已下架商品',
            component: './Goods/List',
            meta: {
              types: 3,
            },
          },
          {
            path: 'add',
            name: '添加商品',
            component: './Goods/Edit',
          },
          {
            path: 'edit',
            icon: 'smile',
            component: './Goods/Edit',
          },
        ],
      },
    ],
  },
];
