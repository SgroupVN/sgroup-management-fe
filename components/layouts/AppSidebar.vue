<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in menuItems" :key="i">
      <app-menu-item :item="item" :index="i"></app-menu-item>
    </template>
  </ul>
</template>

<script setup lang="ts">
import AppMenuItem from "./AppMenuItem.vue";
import { useAuthStore } from "@/store/auth";
import { ref, onMounted } from "vue";
import { SIDEBAR_ITEMS } from "@/types/constants/base/sidebar.const";
import { SidebarMenuItemModel } from "@/types/models/ui/sidebar.model";

const menuItems = ref<SidebarMenuItemModel[]>([]);
const auth = useAuthStore();

onMounted(() => {
  loadMenuItems();
});

const loadMenuItems = () => {
  const items = SIDEBAR_ITEMS.filter((menuItem) => {
    let hasPermission = menuItem?.permission
      ? auth.hasPermission(menuItem.permission)
      : true;
    if (hasPermission) {
      // if has sub menu
      if (menuItem?.items?.length) {
        const subMenuItems = menuItem.items.filter((subMenuItem) => {
          return subMenuItem.permission
            ? auth.hasPermission(subMenuItem.permission)
            : true;
        });
        menuItem.items = subMenuItems;
      }
      if (menuItem?.items?.length) {
        return true;
      }
    }
    return false;
  });

  menuItems.value = items;
};
</script>

<style lang="scss" scoped></style>
