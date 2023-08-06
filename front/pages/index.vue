<!--
 * @Author: RONGWEI PENG
 * @Date: 2020-05-06 16:47:08
 * @LastEditTime: 2020-05-06 17:30:57
 * @LastEditors: Do not edit
 * @FilePath: \my__kkb__project\front\pages\index.vue
 * @Description: 
 -->
<template>
  <div class="container">
    <div>
      <h1 class="title">
        front
      </h1>
    </div>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";

export default {
  layout: "login",
  components: {
    Logo
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
