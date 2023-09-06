import jwtDecode from "jwt-decode";
import { defineStore } from "pinia";
import { AppPermission } from "@/types/enums/permission.enum";
import { DEFAULT_PERMISSIONS } from "@/types/constants/permission.const";

export type LoginRequestDto = {
  username: string;
  password: string;
};

export type LoginResponse = {
  data: {
    user: {
      id: string;
      createdAt: string;
      updatedAt: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar: string;
      phone: string;
    };
    token: {
      accessToken: string;
      refreshToken: string;
    };
  };
  success: boolean;
};

export type AuthUser = {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string;
  phone: string;
  isActive?: boolean;
  avatarUrl: string;
  role: Role;
};

export type Role = {
  id: string;
  name: string;
  permissions: AppPermission[];
};

export type RegisterRequestDto = {
  email: string;
  name: string;
  username: string;
  password: string;
};

export type RegisterResponse = {
  accessToken: string;
  refreshToken: string;
};

export enum TokenTitleToStorage {
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
}

type AuthData = {
  accessToken: string;
  user: AuthUser | null;
  loading: boolean;
};

export const useAuthStore = defineStore({
  id: "auth",
  state: () =>
    ({
      user: {},
      accessToken: "",
    }) as AuthData,
  getters: {
    isAuth(): boolean {
      const refreshToken = useCookie("refresh_token").value;
      if (!refreshToken) return false;
      return this.accessToken !== "";
    },

    bearerToken(): string {
      if (!this.accessToken) {
        this.accessToken =
          window.localStorage.getItem(TokenTitleToStorage.ACCESS_TOKEN) ?? "";
      }
      return `Bearer ${this.accessToken}`;
    },
  },

  actions: {
    async login(formData: LoginRequestDto) {
      const LOGIN_API_URL = "/auth/login";
      try {
        const requestLoginToServer: LoginResponse | any =
          await useApiPost<LoginResponse>(LOGIN_API_URL, {
            body: formData,
          });
        const responseData = requestLoginToServer.data;

        useCookie(TokenTitleToStorage.REFRESH_TOKEN, {
          sameSite: "strict",
        }).value = responseData.token.refreshToken;

        useLocalStorage(
          TokenTitleToStorage.ACCESS_TOKEN,
          responseData.token.accessToken,
        );

        this.accessToken = responseData.token.accessToken;
        this.user = responseData.user;

        return true;
      } catch (error) {
        return false;
      }
    },

    async refreshToken() {
      try {
        const refreshToken = useCookie("refresh_token").value;

        if (!refreshToken) return;

        const refreshTokenPayload = jwtDecode<AuthUser>(refreshToken);

        if (!refreshTokenPayload) {
          this.logout();
          return;
        }

        const data = await useApiPost<{
          accessToken: string;
        }>("/auth/refresh", {
          method: "POST",
          body: {
            refreshToken,
          },
        });

        this.accessToken = data.accessToken;
        const payload = jwtDecode<AuthUser>(data.accessToken);

        this.accessToken = data.accessToken;
        this.user = payload;
      } catch (error) {
        this.logout();
      }
    },

    async initAuth() {
      this.loading = true;
      try {
        await this.refreshToken();
      } catch (err) {
        this.logout();
      }
      this.loading = false;
    },

    async register(formData: RegisterRequestDto) {
      const data = await useApiPost<RegisterResponse>("/auth/register", {
        body: formData,
      });

      this.accessToken = data.accessToken;
      const payload = jwtDecode<AuthUser>(data.accessToken);
      this.user = payload;
      location.reload();
    },

    async sendRequestResetPassword(dto: { email: string }) {
      await useApiPost("/auth/request-reset-password", {
        body: dto,
      });
    },

    async resetPassword(dto: { token: string; password: string }) {
      await useApiPost("/auth/reset-password", {
        body: dto,
      });
    },

    logout() {
      this.user = null;
      this.accessToken = "";

      useCookie("refresh_token", {
        sameSite: "strict",
      }).value = null;

      navigateTo("/auth/login");
    },

    async loadUserData() {
      const res = await useApiGet<AuthUser>("/auth/me");
      if (!res.data.role?.permissions) {
        res.data.role.permissions = DEFAULT_PERMISSIONS;
      } else {
        res.data.role.permissions = res.data.role.permissions.map(
          (item) => item as AppPermission,
        );
      }
      this.user = res.data;
    },

    async hasPermission(permission: AppPermission) {
      // remove when handle save data after login
      if (!this.user || !this.user?.role?.id) {
        await this.loadUserData();
      }
      return this.user?.role?.permissions?.includes(permission);
    },
  },
});
