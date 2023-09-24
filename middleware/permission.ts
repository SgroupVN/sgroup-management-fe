import { RouteLocationNormalized } from ".nuxt/vue-router";
import { AppPermission } from "types/enums/permission.enum";
import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware(
  async (routerTo: RouteLocationNormalized) => {
    const auth = useAuthStore();
    if (!auth.isAuth && !routerTo.fullPath.startsWith("/auth")) {
      return navigateTo("/auth/login");
    }
    const metaData = routerTo.meta?.meta as {
      permissions: AppPermission[];
    };
    const permissions: AppPermission[] = metaData.permissions ?? [];
    const hasPermission = await permissions.every((permission) =>
      auth.hasPermission(permission)
    );
    if (!hasPermission) {
      return navigateTo("/forbidden");
    }
  }
);
