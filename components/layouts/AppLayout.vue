<script setup>
import AppTopbar from "./AppTopbar.vue";
import AppFooter from "./AppFooter.vue";
import AppSidebar from "./AppSidebar.vue";
</script>

<template>
  <div class="h-screen w-screen overflow-hidden">
    <app-topbar></app-topbar>
    <div class="layout-sidebar bg-white rounded-md p-4 top-20 m-4">
      <app-sidebar></app-sidebar>
    </div>

    <div
      class="layout-main-container top-20 mr-4 my-4 ml-[340px] transition-all relative overflow-y-auto overflow-x-hidden"
    >
      <div class="content h-full">
        <router-view></router-view>
      </div>

      <!-- <app-footer></app-footer> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-main-container {
  height: calc(100vh - 9rem);

  .content {
    // min-height: calc(100vh - 55px);
  }
}
</style>
