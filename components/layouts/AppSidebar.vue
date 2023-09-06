<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in menuItems" :key="i">
      <app-menu-item :item="item" :index="i"></app-menu-item>
    </template>
  </ul>
</template>

<script setup lang="ts">
import AppMenuItem from "@/components/layouts/AppMenuItem.vue";
import { useAuthStore } from "@/store/auth";
import { ref, onMounted } from "vue";
import { SIDEBAR_ITEMS } from "@/types/constants/base/sidebar.const";
import { SidebarMenuItemModel } from "@/types/models/ui/sidebar.model";

const menuItems = ref<SidebarMenuItemModel[]>([]);
const auth = useAuthStore();

onMounted(() => {
  loadMenuItems();
});

const loadMenuItems = async () => {
  menuItems.value = await filterMenuItems(SIDEBAR_ITEMS);
};

const filterMenuItems = async (menuItems) => {
  const filteredItems = [];
  for (const menuItem of menuItems) {
    let hasPermission = menuItem.permission
      ? await auth.hasPermission(menuItem.permission)
      : true;
    if (hasPermission) {
      if (menuItem.items && menuItem.items.length) {
        const subMenuItems = await filterMenuItems(menuItem.items);
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
