<script setup>
import AppTopbar from './AppTopbar.vue';
import AppFooter from './AppFooter.vue';
import AppSidebar from './AppSidebar.vue';

</script>

<template>
    <div class="layout-wrapper">
        <app-topbar></app-topbar>
        <div class="layout-sidebar bg-white rounded-md p-4 top-20 m-5">
            <app-sidebar></app-sidebar>
        </div>

        <div class="layout-main-container top-20 mr-5 my-5 ml-[360px] transition-all">
            <router-view></router-view>
            <app-footer></app-footer>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
