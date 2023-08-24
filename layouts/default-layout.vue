<template>
    <div class="flex h-full w-screen flex-col bg-[#F8FAFF]">
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/store/auth';

const auth = useAuthStore();

onMounted(async () => {
    if (!process.client) return;
});

const router = useRouter();
</script>

<style lang="less" scoped></style>
