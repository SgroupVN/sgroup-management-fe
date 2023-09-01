import { useAuthStore } from '~/store/auth';

export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuthStore();

    if (!auth.isAuth && !to.fullPath.startsWith('/auth')) {
        navigateTo('/auth/login');
    }

    if (auth.isAuth && to.fullPath.startsWith('/auth')) {
        return navigateTo('/');
    }
});
