<template>
  <el-container class="layout-container" style="height: 100%">
    <el-aside>
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
        <el-sub-menu index="1">
          <template #title>
            <el-icon><location /></el-icon>
            <span>Navigator One</span>
          </template>
          <el-menu-item-group>
            <template #title><span>Group One</span></template>
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="Group Two">
            <el-menu-item index="1-3">item three</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="1-4">
            <template #title><span>item four</span></template>
            <el-menu-item index="1-4-1">item one</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="2">
          <el-icon><icon-menu /></el-icon>
          <template #title>Navigator Two</template>
        </el-menu-item>
        <el-menu-item index="3" disabled>
          <el-icon><document /></el-icon>
          <template #title>Navigator Three</template>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><setting /></el-icon>
          <template #title>Navigator Four</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <Header />
      </el-header>

      <!-- <el-main>
        <RouterView />
     <el-scrollbar>
          <el-table :data="tableData">
            <el-table-column prop="date" label="Date" width="140" />
            <el-table-column prop="name" label="Name" width="120" />
            <el-table-column prop="address" label="Address" />
          </el-table>
        </el-scrollbar>  
      </el-main> -->
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import Header from '@/components/Header.vue';
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue';
import { useMenuStore } from '@/stores/menu';
const menuStore = useMenuStore();
const defaultOpeneds = ref(['1']);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
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
