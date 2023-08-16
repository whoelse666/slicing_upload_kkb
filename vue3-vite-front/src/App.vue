@click="handleMenuItem"
<template>
  <el-container class="layout-container" style="height: 100%">
    <el-aside>
      <el-scrollbar height="100%">
        <el-menu
          default-active="2"
          class="el-menu-vertical"
          :default-openeds="defaultOpeneds"
          active-text-color="#ffd04b"
          background-color="rgb(48, 65, 86)"
          text-color="rgb(191, 203, 217)"
          @open="handleOpen"
          @close="handleClose"
          :collapse="menuStore.isOpened"
        >
          <template v-for="(item, index) in menuList" :key="item.label">
            <el-menu-item :index="index" v-if="!item.children">
              <el-icon><component :is="item.icon" /></el-icon>
              <router-link :to="item.path">
                <span>{{ item.label }}</span>
              </router-link>
            </el-menu-item>

            <el-sub-menu v-else :index="index">
              <template #title>
                <el-icon><component :is="item.icon" /></el-icon>
                <router-link :to="item.path">
                  <span>{{ item.label }}</span>
                </router-link>
              </template>
              <el-menu-item-group v-if="item.children && item.children.length > 0">
                <el-menu-item @click="handleMenuItem" :index="index + '-' + index2" v-for="(item2, index2) in item.children" :key="item2.label">
                  <router-link :to="item2.path">
                    <span>{{ item2.label }}</span>
                  </router-link>
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
          </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header>
        <Header />
      </el-header>

      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { RouterView, RouterLink } from 'vue-router';
import Header from '@/components/Header.vue';
import { Menu as IconMenu, Message, Setting, Share,HomeFilled, Document } from '@element-plus/icons-vue';
import { useMenuStore } from '@/stores/menu';
const menuStore = useMenuStore();
const defaultOpeneds = ref(['1']);
const menuList = ref([
  {
    label: '首页',
    path: '/',
    icon: HomeFilled
  },
  {
    label: '关于',
    path: '/about',
    icon: Document,
    children: [
      {
        label: '关于1',
        path: '/about/child'
      },
      {
        label: '关于2',
        path: '/about/child'
      },
      {
        label: '关于3',
        path: '/about/child'
      },
     
    ]
  },
  {
    label: '其他',
    path: '/other',
    icon: Message,
    children: [
      {
        label: '其他1',
        path: '/other/child'
      }
    ]
  },
  {
    label: '测试',
    path: '/test',
    icon: Setting,
    children: []
  }
]);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleMenuItem = (m: any) => {
  console.log(m);
};
const item = {
  date: '2016-05-02',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles'
};
</script>

<style scoped lang="scss">
.layout-container {
  .el-aside {
    width: auto;
  }
  .el-header {
    // width: calc(100% - 63px);
    overflow: auto;
    padding: 0;
    box-shadow: 0 3px 4px rgba(41, 16, 0, 0.08);
  }
  .el-menu-vertical {
    height: 100%;
  }
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  // .layout-container .el-header {
  //   position: relative;
  //   /* background-color: var(--el-color-primary-light-7); */
  //   /* color: var(--el-text-color-primary); */
  // }
  .el-container {
    height: calc(100% - 60px);
  }
  .el-scrollbar {
    width: auto;
    background-color: rgb(48, 65, 86);
  }
}
</style>
