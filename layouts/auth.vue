<template>
    <div class="flex w-screen h-screen flex-1 p-4 bg-gradient-to-t from-cyan-200 to-white">
        <div class="absolute top-0 left-0 m-3 flex items-center gap-2">
            <router-link to="/">
                <img src="../public/logo/logo-sgroup-black.png" class="h-12" />
            </router-link>
        </div>

        <div
            class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-3/5"
        >
            <div class="w-full flex flex-col">
                <router-view> </router-view>
            </div>
        </div>
        <div class="relative hidden w-0 flex-1 lg:block">
            <img
                class="absolute inset-0 h-full rounded-3xl rounded-bl-[100px] w-full object-cover"
                src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
            />
        </div>
    </div>
</template>
