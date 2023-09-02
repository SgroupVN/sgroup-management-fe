<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }],
    },

    {
        label: 'Pages',
        to: '/pages',
        items: [
            {
                label: 'Members',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'Group Members',
                        icon: 'pi pi-fw pi-users',
                        to: '/members',
                    },
                    {
                        label: 'Accessability',
                        icon: 'pi pi-fw pi-key',
                        to: '/members/accessability',
                    },
                ],
            },
            {
                label: 'Office Scheduler',
                icon: 'pi pi-fw pi-calendar',
                to: '/office-scheduler',
            },
            {
                label: 'Financial',
                icon: 'pi pi-fw pi-dollar',
                to: '/financial',
                items: [
                    {
                        label: 'Monthly Payment',
                        icon: 'pi pi-fw pi-dollar',
                        to: '/financial/monthly-payment',
                    },
                ],
            },
            {
                label: 'Recruitment',
                icon: 'pi pi-fw pi-user-plus',
                to: '/recruitment',
            },
        ],
    },
    {
        label: 'FOR DEV ONLY',
        items: [
            {
                label: 'PrimeIcons',
                icon: 'pi pi-fw pi-prime',
                to: '/utilities/icons',
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
