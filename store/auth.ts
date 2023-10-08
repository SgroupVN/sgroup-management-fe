import { access } from "fs";
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
    async isAuth(state): Promise<boolean> {
      const refreshToken = await useCookie(TokenTitleToStorage.REFRESH_TOKEN)
        .value;
      const accessToken =
        (await (useLocalStorage(TokenTitleToStorage.ACCESS_TOKEN, "")
          .value as string)) || "";
      if (!refreshToken || !accessToken) return false;
      if (accessToken && !state.accessToken) {
        this.restoreUserDataUsingAccesstoken(accessToken);
      }
      return !!state.accessToken;
    },

    bearerToken(): string {
      if (!this.accessToken) {
        this.accessToken =
          (useLocalStorage(TokenTitleToStorage.ACCESS_TOKEN, "")
            .value as string) || "";
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

        window.localStorage.setItem(
          TokenTitleToStorage.ACCESS_TOKEN,
          responseData.token.accessToken
        );

        this.accessToken = responseData.token.accessToken;
        await this.loadUserData();

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
      if (!this.isAuth) return;
      await this.loadUserData();
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
        this.user = user.data;
        this.accessToken = access_token;
      }
    },

    async logout() {
      // currently logged out having same issues
      this.user = null;
      this.accessToken = "";

      useCookie(TokenTitleToStorage.REFRESH_TOKEN, {
        sameSite: "strict",
      }).value = null;

      await useLocalStorage(TokenTitleToStorage.ACCESS_TOKEN, null);
      useLocalStorage(TokenTitleToStorage.ACCESS_TOKEN, null).value = null;

      await navigateTo("/auth/login");
    },

    async loadUserData() {
      try {
        const res: any = await useApiGet<UserResponseModel>("/auth/me");
        if (res?.statusCode === 401) {
          this.logout();
        } else this.setUserInfo(res.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
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
