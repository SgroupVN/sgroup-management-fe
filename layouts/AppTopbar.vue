
<template>
    <div class="layout-topbar sticky h-20 left-0 top-0 w-full px-4 py-2 flex items-center shadow-md bg-white">
        <router-link to="/" class="flex items-center">
            <img src="logo-sgroup.png" class="h-16 w-16" />
            <span>S-GROUP</span>
        </router-link>

        <button class="p-link layout-topbar-menu-button layout-topbar-button">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu">
            <button class="p-link layout-topbar-button">
                <i class="pi pi-user"></i>
                <span>Profile</span>
            </button>
            <button class="p-link layout-topbar-button">
                <i class="pi pi-cog"></i>
                <span>Settings</span>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.layout-topbar {
    z-index: 997;

    .layout-topbar-button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: relative;
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        cursor: pointer;

        i {
            font-size: 1.5rem;
        }

        span {
            font-size: 1rem;
            display: none;
        }
    }

    .layout-topbar-menu-button {
        display: none;

        i {
            font-size: 1.25rem;
        }
    }

    .layout-topbar-menu {
        margin: 0 0 0 auto;
        padding: 0;
        list-style: none;
        display: flex;

        .layout-topbar-button {
            margin-left: 1rem;
        }
    }
}
</style>
