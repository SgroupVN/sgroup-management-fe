<template>
    <div class="flex">
        <div
            class="flex flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4"
        >
            <div class="card flex flex-column align-items-center">
                <PanelMenu
                    v-model:expandedKeys="expandedKeys"
                    :model="items"
                    class="w-full md:w-25rem"
                />
            </div>
        </div>
        <div class="lg:pl-72">
            <div
                class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8"
            >
                <button
                    type="button"
                    class="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                >
                    <span class="sr-only">Open sidebar</span>
                    <svg
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </button>

                <!-- Separator -->
                <div
                    class="h-6 w-px bg-gray-200 lg:hidden"
                    aria-hidden="true"
                ></div>

                <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                    <form class="relative flex flex-1" action="#" method="GET">
                        <label for="search-field" class="sr-only">Search</label>
                        <svg
                            class="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        <input
                            id="search-field"
                            class="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                            placeholder="Search..."
                            type="search"
                            name="search"
                        />
                    </form>
                    <div class="flex items-center gap-x-4 lg:gap-x-6">
                        <button
                            type="button"
                            class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                        >
                            <span class="sr-only">View notifications</span>
                            <svg
                                class="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                                />
                            </svg>
                        </button>

                        <!-- Separator -->
                        <div
                            class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                            aria-hidden="true"
                        ></div>

                        <!-- Profile dropdown -->
                    </div>
                </div>
            </div>

            <main class="py-10">
                <div class="px-4 sm:px-6 lg:px-8">
                    <slot />
                </div>
            </main>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/store/auth';
const { layoutConfig, layoutState, onMenuToggle } = useLayout();
const topbarMenuActive = ref(false);
const containerClass = computed(() => {
    return {
        'layout-overlay': layoutConfig.menuMode.value === 'overlay',
        'layout-static': layoutConfig.menuMode.value === 'static',
        'layout-static-inactive':
            layoutState.staticMenuDesktopInactive.value &&
            layoutConfig.menuMode.value === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive.value,
        'layout-mobile-active': layoutState.staticMenuMobileActive.value,
        'p-input-filled': layoutConfig.inputStyle.value === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple.value,
    };
});
const auth = useAuthStore();
const logoUrl = computed(() => {
    return `layout/images/${
        layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'
    }.svg`;
});

const expandedKeys = ref({});
const items = ref([
    {
        key: '0',
        label: 'File',
        icon: 'pi pi-fw pi-file',
        items: [
            {
                key: '0_0',
                label: 'New',
                icon: 'pi pi-fw pi-plus',
                items: [
                    {
                        key: '0_0_0',
                        label: 'Bookmark',
                        icon: 'pi pi-fw pi-bookmark',
                    },
                    {
                        key: '0_0_1',
                        label: 'Video',
                        icon: 'pi pi-fw pi-video',
                    },
                ],
            },
            {
                key: '0_1',
                label: 'Delete',
                icon: 'pi pi-fw pi-trash',
            },
            {
                key: '0_2',
                label: 'Export',
                icon: 'pi pi-fw pi-external-link',
            },
        ],
    },
    {
        key: '1',
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
            {
                key: '1_0',
                label: 'Left',
                icon: 'pi pi-fw pi-align-left',
            },
            {
                key: '1_1',
                label: 'Right',
                icon: 'pi pi-fw pi-align-right',
            },
            {
                key: '1_2',
                label: 'Center',
                icon: 'pi pi-fw pi-align-center',
            },
            {
                key: '1_3',
                label: 'Justify',
                icon: 'pi pi-fw pi-align-justify',
            },
        ],
    },
    {
        key: '2',
        label: 'Users',
        icon: 'pi pi-fw pi-user',
        items: [
            {
                key: '2_0',
                label: 'New',
                icon: 'pi pi-fw pi-user-plus',
            },
            {
                key: '2_1',
                label: 'Delete',
                icon: 'pi pi-fw pi-user-minus',
            },
            {
                key: '2_2',
                label: 'Search',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        key: '2_2_0',
                        label: 'Filter',
                        icon: 'pi pi-fw pi-filter',
                        items: [
                            {
                                key: '2_2_0_0',
                                label: 'Print',
                                icon: 'pi pi-fw pi-print',
                            },
                        ],
                    },
                    {
                        key: '2_2_1',
                        icon: 'pi pi-fw pi-bars',
                        label: 'List',
                    },
                ],
            },
        ],
    },
    {
        key: '3',
        label: 'Events',
        icon: 'pi pi-fw pi-calendar',
        items: [
            {
                key: '3_0',
                label: 'Edit',
                icon: 'pi pi-fw pi-pencil',
                items: [
                    {
                        key: '3_0_0',
                        label: 'Save',
                        icon: 'pi pi-fw pi-calendar-plus',
                    },
                    {
                        key: '3_0_0',
                        label: 'Delete',
                        icon: 'pi pi-fw pi-calendar-minus',
                    },
                ],
            },
            {
                key: '3_1',
                label: 'Archieve',
                icon: 'pi pi-fw pi-calendar-times',
                items: [
                    {
                        key: '3_1_0',
                        label: 'Remove',
                        icon: 'pi pi-fw pi-calendar-minus',
                    },
                ],
            },
        ],
    },
]);

const expandAll = () => {
    for (let node of items.value) {
        expandNode(node);
    }

    expandedKeys.value = { ...expandedKeys.value };
};
const onSettingsClick = () => {
    topbarMenuActive.value = false;
    router.push('/documentation');
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value,
    };
});

const collapseAll = () => {
    expandedKeys.value = {};
};

const expandNode = (node) => {
    if (node.items && node.items.length) {
        expandedKeys.value[node.key] = true;

        for (let child of node.items) {
            expandNode(child);
        }
    }
};
onMounted(async () => {
    if (!process.client) return;
});

const router = useRouter();
</script>

<style lang="less" scoped></style>
