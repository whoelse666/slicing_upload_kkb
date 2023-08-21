import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.directive('focus', {
  mounted: (el: HTMLElement) => {
    console.log('focus mounted', el);
    // el.focus();
  }
});

app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.mount('#app');
