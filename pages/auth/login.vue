<script setup>
import { ref } from 'vue';
const rememberMe = ref(false);
const username = ref('');
const password = ref('');

const isEmailValid = ref(false);
const isPasswordValid = ref(false);



definePageMeta({
    layout: 'auth'
});

const login = () => {
    isEmailValid.value = username.value.includes('@');
    isPasswordValid.value = password.value.trim().length > 6;

    if (!isEmailValid.value || !isPasswordValid.value) {
        return;
    }
    // navigate to dashboard
    navigateTo('/')
};
</script>
<template>
    <div>
        <h2 class="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your
            account
        </h2>
    </div>

    <div class="mt-2 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form class="space-y-6 " method="POST" @submit.prevent="login">
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-user" />
                    <InputText v-model="email" type="text" placeholder="Username" class="w-full"
                        :class="{ 'p-invalid': isEmailValid }" />
                </span>
                <div>
                    <span class="p-input-icon-left w-full">
                        <i class="pi pi-eye" />
                        <InputText v-model="password" type="text" placeholder="Password" class="w-full" :class="{
                            'p-invalid': isPasswordValid
                        }" />
                    </span>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex align-items-center">
                        <Checkbox v-model="rememberMe" inputId="ingredient1" name="rememberMe" value="Cheese" />
                        <label for="ingredient1" class="ml-2"> Remember
                            me </label>
                    </div>

                    <div class="text-sm leading-6">
                        <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                    </div>
                </div>

                <div>
                    <Button type="submit" label="Sign in" class="w-full" />
                </div>
            </form>

        </div>

        <p class="mt-10 text-center text-sm text-gray-500">
            Not a member?
            {{ ' ' }}
            <a href="#" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Start a 14 day free
                trial</a>
        </p>
    </div>
</template>


<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
