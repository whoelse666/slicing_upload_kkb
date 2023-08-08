<!--
 * @Author: WHO ELSE
 * @Date: 2020-05-06 17:28:14
 * @LastEditTime: 2020-05-06 17:28:45
 * @LastEditors: Do not edit
 * @FilePath: \my__kkb__project\front\layouts\error.vue
 * @Description: 
 -->
<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">页面不存在</h1>
    <h1 v-else>应用发生错误异常</h1>
    <nuxt-link to="/">首 页</nuxt-link>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'login' // 你可以为错误页面指定自定义的布局
}
</script>

<style lang="less" scoped>

</style>