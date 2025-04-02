import type { RouteRecordRaw } from 'vue-router';

import { VBEN_LOGO_URL } from '@vben/constants';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      badgeType: 'dot',
      icon: VBEN_LOGO_URL,
      keepAlive: true,
      order: 1000,
      title: $t('demos.title'),
    },
    name: 'Demos',
    path: '/demos',
    children: [
      {
        meta: {
          title: $t('demos.antd'),
        },
        name: 'AntDesignDemos',
        path: '/demos/ant-design',
        component: () => import('#/views/demos/antd/index.vue'),
      },
      {
        meta: {
          title: '表单读取示例',
        },
        name: 'FormRead',
        path: '/demos/form-read',
        component: () => import('#/views/demos/api-demo/form-read.vue'),
      },
      {
        meta: {
          title: '表单提交示例',
        },
        name: 'FormSubmit',
        path: '/demos/form-submit',
        component: () => import('#/views/demos/api-demo/form-submit.vue'),
      },
      {
        meta: {
          title: '列表读取示例',
        },
        name: 'ListRead',
        path: '/demos/list-read',
        component: () => import('#/views/demos/api-demo/list-read.vue'),
      },
    ],
  },
];

export default routes;
