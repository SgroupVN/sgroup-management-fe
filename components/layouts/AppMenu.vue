<script setup>
import { ref } from "vue";
import AppMenuItem from "./AppMenuItem.vue";
const model = ref([
  {
    label: "Home",
    items: [{ label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" }],
  },

  {
    label: "Pages",
    to: "/pages",
    items: [
      {
        label: "Members",
        icon: "pi pi-fw pi-users",
        items: [
          {
            label: "Group Members",
            icon: "pi pi-fw pi-users",
            to: "/members",
          },
          {
            label: "Accessability",
            icon: "pi pi-fw pi-key",
            to: "/members/accessability",
          },
        ],
      },
      {
        label: "Office Scheduler",
        icon: "pi pi-fw pi-calendar",
        to: "/office-scheduler",
      },
      {
        label: "Financial",
        icon: "pi pi-fw pi-dollar",
        to: "/financial",
        items: [
          {
            label: "Monthly Payment",
            icon: "pi pi-fw pi-dollar",
            to: "/financial/monthly-payment",
          },
        ],
      },
      {
        label: "Recruitment",
        icon: "pi pi-fw pi-user-plus",
        to: "/recruitment",
      },
    ],
  },
  {
    label: "FOR DEV ONLY",
    items: [
      {
        label: "PrimeIcons",
        icon: "pi pi-fw pi-prime",
        to: "/utilities/icons",
      },
      {
        label: "UI Components",
        icon: "pi pi-fw pi-prime",
        to: "/utilities/icons",
        items: [
          {
            label: "Form Layout",
            icon: "pi pi-fw pi-id-card",
            to: "/utilities/uikit/form-layout",
          },
          {
            label: "Input",
            icon: "pi pi-fw pi-check-square",
            to: "/utilities/uikit/input",
          },
          {
            label: "Float Label",
            icon: "pi pi-fw pi-bookmark",
            to: "/utilities/uikit/float-label",
          },
          {
            label: "Invalid State",
            icon: "pi pi-fw pi-exclamation-circle",
            to: "/utilities/uikit/invalid-state",
          },
          {
            label: "Button",
            icon: "pi pi-fw pi-mobile",
            to: "/utilities/uikit/button",
            class: "rotated-icon",
          },
          {
            label: "Table",
            icon: "pi pi-fw pi-table",
            to: "/utilities/uikit/table",
          },
          {
            label: "List",
            icon: "pi pi-fw pi-list",
            to: "/utilities/uikit/list",
          },
          {
            label: "Tree",
            icon: "pi pi-fw pi-share-alt",
            to: "/utilities/uikit/tree",
          },
          {
            label: "Panel",
            icon: "pi pi-fw pi-tablet",
            to: "/utilities/uikit/panels",
          },
          {
            label: "Overlay",
            icon: "pi pi-fw pi-clone",
            to: "/utilities/uikit/overlay",
          },
          {
            label: "Media",
            icon: "pi pi-fw pi-image",
            to: "/utilities/uikit/media",
          },

          {
            label: "Message",
            icon: "pi pi-fw pi-comment",
            to: "/utilities/uikit/messages",
          },
          {
            label: "File",
            icon: "pi pi-fw pi-file",
            to: "/utilities/uikit/file",
          },
          {
            label: "Chart",
            icon: "pi pi-fw pi-chart-bar",
            to: "/utilities/uikit/chart",
          },
          {
            label: "Misc",
            icon: "pi pi-fw pi-circle",
            to: "/utilities/uikit/misc",
          },
        ],
      },
    ],
  },
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item
        v-if="!item.separator"
        :item="item"
        :index="i"
      ></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
