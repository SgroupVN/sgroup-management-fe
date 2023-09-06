import jwtDecode from "jwt-decode";
import { defineStore } from "pinia";
import { AppPermission } from "@/types/enums/permission.enum";
import { DEFAULT_PERMISSIONS } from "@/types/constants/permission.const";
import {
  AuthUser,
  LoginRequestDto,
  LoginResponse,
  RegisterRequestDto,
  RegisterResponse,
  UserResponseModel,
} from "@/types/models/auth.model";

export enum TokenTitleToStorage {
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
}

export interface AuthData {
  accessToken: string;
  user: AuthUser | null;
  loading: boolean;
}

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
      // TODO: change to check in local storage
      return this.accessToken !== "";
    },

    bearerToken(): string {
      if (!this.accessToken) {
        this.accessToken =
          window?.localStorage.getItem(TokenTitleToStorage.ACCESS_TOKEN) ?? "";
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
        this.setUserInfo(responseData.user);

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

      useLocalStorage(TokenTitleToStorage.ACCESS_TOKEN, null);

      navigateTo("/auth/login");
    },

    async loadUserData() {
      const res = await useApiGet<UserResponseModel>("/auth/me");
      this.setUserInfo(res.data);
    },

    setUserInfo(auth: UserResponseModel) {
      this.user = auth;
      this.user.role.permissions = this.user.role.permissions
        ? this.user.role.permissions.map((item) => item.name as AppPermission)
        : DEFAULT_PERMISSIONS;
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
