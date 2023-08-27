
<template>
    <div class="flex w-screen h-screen flex-1">
        <div class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-2/5">
            <div class="w-full flex flex-col items-center">
                <router-link to="/">
                    <img src="../public/logo-sgroup.png" class="h-16 w-16 mx-auto" />
                </router-link>
                <router-view> </router-view>
            </div>
        </div>
        <div class="relative hidden w-0 flex-1 lg:block">
            <img class="absolute inset-0 h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
                alt="" />
        </div>
    </div>
</template>
  