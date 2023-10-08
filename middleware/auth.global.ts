import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore();
  const isAuth = await auth.isAuth;
  if (
    !isAuth &&
    !to.fullPath.startsWith("/auth") &&
    !from.fullPath.startsWith("/auth")
  ) {
    return navigateTo("/auth/login");
  }
  if (isAuth && to.fullPath.startsWith("/auth")) {
    return navigateTo("/");
  }
});
