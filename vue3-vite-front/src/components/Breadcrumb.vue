<template>
  <div>
    <!-- <transition-group name="breadcrumb"> -->
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item v-for="item in list" :key="item">
        {{ item }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- </transition-group> -->
  </div>
</template>

<script setup lang="ts">
export interface BreadcrumbType {
  path: string;
  meta: object;
}
defineProps({
  list: Array<BreadcrumbType>
});
const emit = defineEmits(['update:list']);
const handleClick = (item: string) => {
  emit('update:list', item);
};
</script>

<style scoped lang="scss"></style>
