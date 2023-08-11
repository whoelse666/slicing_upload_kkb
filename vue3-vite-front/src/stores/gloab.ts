import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useGloabStore = defineStore('gloabStore', {
  state: () => ({
    isLogin: false
  }),
  actions: {
    changeLoginStatus() {
      this.isLogin = !this.isLogin;
    }
  }
});
