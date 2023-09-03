<template>
  <div class="mt-2 sm:mx-auto sm:w-full sm:max-w-[580px] px-6 sm:px-12">
    <h2
      class="text-left text-4xl font-bold leading-9 tracking-tight text-gray-900"
    >
      Welcome back! 👋
    </h2>
    <span> Please enter log in details below </span>

    <!-- Login form data -->
    <div class="mt-12 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div>
        <form class="space-y-6" method="POST" @submit.prevent="onLogin">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-user" />
            <InputText
              v-model="email"
              type="text"
              placeholder="Username"
              class="w-full"
              :class="{ 'p-invalid': !isEmailValid }"
              :onChange="onDataChange"
            />
            <small
              v-if="!isEmailValid && !!email"
              class="p-error"
              id="mask-error"
              >{{ "This email is invalid" || "&nbsp;" }}</small
            >
          </span>
          <div>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-eye" />
              <InputText
                v-model="password"
                type="text"
                placeholder="Password"
                class="w-full"
                :class="{
                  'p-invalid': !isPasswordValid,
                }"
                :onChange="onDataChange"
              />
            </span>
            <small
              v-if="!isPasswordValid && !!password"
              class="p-error"
              id="mask-error"
              >{{ "Password must be at least 6 characters" || "&nbsp;" }}</small
            >
          </div>

          <div class="flex items-center justify-between">
            <div class="flex align-items-center">
              <Checkbox
                v-model="rememberMe"
                inputId="ingredient1"
                name="rememberMe"
                value="Cheese"
              />
              <label for="ingredient1" class="ml-2"> Remember me </label>
            </div>

            <div class="text-sm leading-6">
              <a
                href="#"
                class="font-semibold text-indigo-600 hover:text-indigo-500"
                >Forgot password?</a
              >
            </div>
          </div>

          <div>
            <Button type="submit" label="Sign in" class="w-full" />
          </div>
        </form>
      </div>

      <p class="mt-10 text-center text-sm text-gray-500">
        Dont' have an account yet?
        {{ " " }}
        <a
          href="/register"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >Sign up</a
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";
import { ref } from "vue";

const { login } = useAuthStore();

const rememberMe = ref(false);
const email = ref("");
const password = ref("");

const isEmailValid = ref(false);
const isPasswordValid = ref(false);

definePageMeta({
  layout: "auth",
});

const onLogin = async () => {
  const isDataValid = checkIsDataValid();
  if (!isDataValid) {
    return;
  }
  const isSuccess = await login({
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value,
  });

  if (isSuccess) {
    navigateTo("/");
  }
};

const onDataChange = () => {
  checkIsDataValid();
};

const checkIsDataValid = () => {
  isEmailValid.value = email.value.includes("@");
  isPasswordValid.value = password.value.trim().length > 6;
  return isEmailValid.value && isPasswordValid.value;
};
</script>

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
