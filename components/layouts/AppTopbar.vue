<script setup>
import { useAuthStore } from "@/store/auth";
const { logout } = useAuthStore();

const onSignOut = async () => {
  await logout();
};
const menu = ref();
const items = ref([
  {
    label: "",
    items: [
      {
        label: "Settings",
        icon: "pi pi-cog",
        command: () => {
          //  this.$router.push({ name: 'settings' });
        },
      },
      {
        label: "Sign out",
        icon: "pi pi-sign-out",
        command: () => {
          onSignOut();
        },
      },
    ],
  },
]);
const toggle = (event) => {
  menu.value.toggle(event);
};

const user = computed(() => {
  return useAuthStore().user;
});

// fullName
const fullName = computed(() => {
  return user.value?.firstName || user.value?.lastName
    ? user.value?.firstName + " " + user.value?.lastName
    : "";
});
</script>

<template>
  <div
    class="layout-topbar fixed h-20 left-0 top-0 w-full px-4 py-2 flex items-center justify-between shadow-md bg-white"
  >
    <router-link to="/" class="flex items-center">
      <img src="../../public/logo/logo-sgroup-black.png" class="h-14" />
    </router-link>

    <div class="flex gap-2 items-center">
      <Button
        type="button"
        label="Profile"
        @click="toggle"
        aria-haspopup="true"
        aria-controls="overlay_menu"
      >
        <i class="pi pi-user mr-2"></i> {{ fullName }}
      </Button>
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-topbar {
  z-index: 997;
}
</style>
