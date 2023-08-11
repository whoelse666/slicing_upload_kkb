import { createRouter, createWebHistory } from 'vue-router';

const pages = import.meta.glob('../views/**/page.js', {
  eager: true,
  import: 'default'
});

const pageComps = import.meta.glob('../views/**/index.vue', {});
console.log('pageComps', pageComps);

const routes = Object.entries(pages).map(([path, meta]) => {
  const pageJsPath = path;
  path = path.replace('../views', '').replace('/page.js', '');
  path = path || '';
  const name = path.split('/').filter(Boolean).join('-') || 'index';
  const component = pageJsPath.replace('page.js', 'index.vue');
  console.log('meta',meta);
  return {
    path: path.toLocaleLowerCase(),
    name,
    component: pageComps[component],
    meta
    // children:[]
  };
});
routes.unshift({
  path: '/',
  redirect: '/home'
});
console.log('routes', routes);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
