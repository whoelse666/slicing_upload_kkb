import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menuStore', {
  state: () => ({
 
    isOpened: false
  }),
  actions: {
    toggleSideBar() {
      this.isOpened = !this.isOpened;
    }
  }
});
