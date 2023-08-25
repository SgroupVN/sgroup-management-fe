<script setup lang="ts">
import { useAuthStore, LoginRequestDto } from '~/store/auth';

definePageMeta({
    layout: 'default',
});
useHead({
    title: 'Login',
});

const form = reactive<LoginRequestDto>({
    username: '',
    password: '',
});
const pending = ref<boolean>(false);

const { login } = useAuthStore();

async function handleLoginRequest() {
    try {
        pending.value = true;
        await login({
            ...form,
        });
    } catch (error: any) {
    } finally {
        pending.value = false;
    }
}

function submitForm(e: Event) {
    e.preventDefault();
}

onMounted(() => {
    if (!process.client) return;
});
</script>

<template>
    <div>
        <div class="mb-6 text-2xl font-bold lg:text-3xl">
            Welcome back, <span class="text-bitter-sweet"> Mate! </span>
        </div>
    </div>

    <div class="mt-6 flex flex-col items-center gap-1 md:mt-12">
        <div class="flex justify-end text-base">
            <NuxtLink to="/auth/request-reset-password" class="link-underline"
                >Forgot password?</NuxtLink
            >
        </div>
        <span class="text-base"> Don't have an account yet? </span>
        <button @click="$router.push('/auth/register')">Register now</button>
        <Button icon="pi pi-check" aria-label="Submit" />
        <Button label="Submit" icon="pi pi-check" />
        <Button label="Submit" icon="pi pi-check" iconPos="right" />
    </div>
</template>

<style lang="less" scoped></style>
