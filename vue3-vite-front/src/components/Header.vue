<template>
  <div class="navbar">
    <div class="left-ctr">
      <hamburger id="hamburger-container" :is-active="!menuStore.isOpened" @toggleClick="toggleSideBar" />

      <transition-group name="breadcrumb">
        <el-breadcrumb class="breadcrumb" separator="/">
          <el-breadcrumb-item :to="{ path: '/' + item }" v-for="item in breadList" :key="item.id">
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </transition-group>

      <!-- <el-breadcrumb-item><a href="/">promotion management</a></el-breadcrumb-item> -->
    </div>
    <div class="right-ctr">
      <el-icon class="full-screen pointer" :size="24" @click="toggle"><FullScreen /></el-icon>

      <el-dropdown @command="handleCommand" trigger="click" class="pointer">
        <el-avatar :size="30" :src="circleUrl" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="1">个人信息</el-dropdown-item>
            <el-dropdown-item command="2">{{ gloabStore.isLogin ? '登出' : '登录' }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useFullscreen } from '@vueuse/core';
const route = useRoute();
const { toggle } = useFullscreen();

import hamburger from '@/components/icons/Hamburger.vue';
import { useMenuStore } from '@/stores/menu';
const menuStore = useMenuStore();
import { useGloabStore } from '@/stores/gloab';
const gloabStore = useGloabStore();
// const circleUrl = ref<string | undefined>('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png');
const circleUrl = ref<string | undefined>('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png');
const breadList = ref<Array<any>>([]);

onMounted(() => {
  getBreadcrumb();
});

function getBreadcrumb() {
  console.log('route :>> ', route, route.matched);

  route.matched.forEach(item => {
    if (item.meta.title && item.path) {
      breadList.value.push(item.meta);
    }
  });
  console.log(' breadList.value :>> ', breadList.value);
  // let matched = route.matched[0]?.path.split('/');
  // // matched = route.matched.filter(item => item.meta && item.meta.title);
  // const first = matched[0];
  // if (!isDashboard(first)) {
  //   matched = [{ path: '/dashboard', meta: { title: 'Dashboard' } }].concat(matched);
  // }
  // breadList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
}

function isDashboard(v) {
  const name = v && v.name;
  if (!name) {
    return false;
  }
  return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase();
}

const toggleSideBar = () => {
  menuStore.toggleSideBar();
};

const handleCommand = (command: string | number | object) => {
  if (2 == command) {
    gloabStore.changeLoginStatus();
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  padding: 0 50px 0 0;
  position: relative;
  height: 60px;
  width: 100%;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  .left-ctr {
    display: flex;
    justify-content: start;
    align-items: center;
  }
  #hamburger-container {
    cursor: pointer;
  }
  .breadcrumb {
    cursor: pointer;
  }
  .right-ctr {
    display: flex;
    align-items: center;
  }
  .pointer {
    cursor: pointer;
    margin: 0 6px;
  }

  .el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 8px;

    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
}
</style>
