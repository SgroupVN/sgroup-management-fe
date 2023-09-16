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
    async isAuth(): Promise<boolean> {
      const refreshToken = useCookie(TokenTitleToStorage.REFRESH_TOKEN).value;
      const accessToken =
        (useLocalStorage(TokenTitleToStorage.ACCESS_TOKEN, "")
          .value as string) || "";
      if (!refreshToken || !accessToken) return false;
      if (accessToken && !this.access_token) {
        this.restoreUserDataUsingAccesstoken(accessToken);
      }
      return !!this.access_token;
    },

    bearerToken(): string {
      if (!this.accessToken && process?.client) {
        this.accessToken =
          window?.localStorage.getItem(TokenTitleToStorage.ACCESS_TOKEN) ?? "";
      }
      return `Bearer ${this.accessToken}`;
    },

    getCurrentUser(): AuthUser | null {
      return this.user;
    },
  },

  actions: {
    async login(formData: LoginRequestDto) {
      const LOGIN_API_URL = "/auth/login";
      try {
        const requestLoginToServer: LoginResponse =
          await useApiPost<LoginResponse>(LOGIN_API_URL, {
            body: formData,
          });
        const responseData = requestLoginToServer.data;

        useCookie(TokenTitleToStorage.REFRESH_TOKEN, {
          sameSite: "strict",
        }).value = responseData.token.refreshToken;

        await useLocalStorage(
          TokenTitleToStorage.ACCESS_TOKEN,
          responseData.token.accessToken,
        );

        this.accessToken = responseData.token.accessToken;
        this.loadUserData();

        return true;
      } catch (error) {
        return false;
      }
    },
    async refreshToken() {
      try {
        const refreshToken = useCookie(TokenTitleToStorage.REFRESH_TOKEN).value;

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

    async authMe(access_token: string) {
      try {
        const data = await useApiGet<AuthUser>("/auth/me", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        return data;
      } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
      }
    },

    async restoreUserDataUsingAccesstoken(access_token: string) {
      if (access_token) {
        const user = await this.authMe(access_token);
        this.user = user;
        this.accessToken = access_token;
      }
    },

    logout() {
      // currently logged out having same issues
      this.user = null;
      this.accessToken = "";

      useCookie(TokenTitleToStorage.REFRESH_TOKEN, {
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

    hasPermission(permission: AppPermission) {
      return this.user?.role?.permissions?.includes(permission) ?? false;
    },
  },
});
