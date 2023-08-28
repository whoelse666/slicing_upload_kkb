import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/layout';
const pages = import.meta.glob('../views/**/page.js', {
  eager: true,
  import: 'default'
});

const pageComps = import.meta.glob('../views/**/index.vue', {});

const childrenRoutes = Object.entries(pages)
  .filter(([path, meta]) => {
    return meta.menuOrder > 0;
  })
  .map(([path, meta]) => {
    const pageJsPath = path;
    path = path.replace('../views', '').replace('/page.js', '');
    path = path || '';
    const name = path.split('/').filter(Boolean).join('-') || 'index';
    const component = pageJsPath.replace('page.js', 'index.vue');
    return {
      path: path.toLocaleLowerCase(),
      name,
      component: pageComps[component],
      meta,
      children: []
    };
  });
console.log('childrenRoutes', childrenRoutes);

export const routes = [
  // {
  //   path: '/',
  //   // redirect: '/home'
  //   component: Layout
  // },

  {
    path: '',
    component: Layout,
    name: '模型管理',
    // meta: { title: '模型管理', icon: 'dashboard' },
    children: [
      ...childrenRoutes
      // {
      //   path: '/home',
      //   component: () => import('@/views/index'),
      //   name: 'Index',
      //   meta: { title: '首页', icon: 'dashboard', affix: true }
      // }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
    component: () => import('@/components/NotFound.vue')
  }
];

console.log('routes', routes);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
