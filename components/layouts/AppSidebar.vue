<template>
  <ul class="layout-menu">
    <app-menu-item
      v-for="(item, i) in filteredItems"
      :key="i"
      :item="item"
      :index="i"
    />
  </ul>
</template>

<script setup lang="ts">
import AppMenuItem from "@/components/layouts/AppMenuItem.vue";
import { useAuthStore } from "@/store/auth";
import { computed } from "vue";
import { SIDEBAR_ITEMS } from "@/types/constants/base/sidebar.const";
const auth = useAuthStore();

const filteredItems = computed(() => {
  return filterMenuItems(Array.from(SIDEBAR_ITEMS));
});

const filterMenuItems = (menuItems) => {
  const filteredItems = [];

  for (const menuItem of menuItems) {
    let hasPermission = menuItem.permission
      ? auth.hasPermission(menuItem.permission)
      : true;
    if (hasPermission) {
      if (menuItem.items && menuItem.items.length) {
        const subMenuItems = filterMenuItems(menuItem.items);

        if (subMenuItems.length) {
          menuItem.items = subMenuItems;
          filteredItems.push(menuItem);
        }
      } else {
        filteredItems.push(menuItem);
      }
    }
  }
  return filteredItems;
};
</script>

<style lang="scss" scoped></style>
