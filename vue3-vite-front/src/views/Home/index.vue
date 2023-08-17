<template>
  <div class="home">
    <h1>home</h1>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
 
import { getMusic } from '@/api/login';
onMounted(getMusic);
</script>
<style>
@media (min-width: 1024px) {
  .home {
    display: flex;
    align-items: center;
  }
}
</style>
