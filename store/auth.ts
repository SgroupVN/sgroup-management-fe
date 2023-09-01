import jwtDecode from 'jwt-decode';
import { defineStore } from 'pinia';
//
import { Role } from '~/types/enums/Role';

export type LoginRequestDto = {
    username: string;
    password: string;
    rememberMe: boolean;
};

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
};

export type AuthUser = {
    id: number;
    email: string;
    name: string;
    role: Role;
    username: string;
    avatarUrl: string;
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

type AuthData = {
    accessToken: string;
    user: AuthUser | null;
    loading: boolean;
};

export const useAuthStore = defineStore({
    id: 'auth',
    state: () =>
        ({
            user: {},
            accessToken: '',
        }) as AuthData,
    getters: {
        isAuth(): Boolean {
            const refreshToken = useCookie('refresh_token').value;
            if (!refreshToken) return false;
            return this.accessToken !== '';
        },

        bearerToken(): string {
            if (!this.accessToken) return '';
            return `Bearer ${this.accessToken}`;
        },
    },

    actions: {
        async login(formData: LoginRequestDto) {
            // const data = await useApiPost<LoginResponse>('/auth/login', {
            //     body: formData,
            // });
            const data = {
                refreshToken: 'refreshToken',
                accessToken: 'accessToken',
                user: {
                    id: 1,
                    email: 'p@gmail.com',
                    name: 'name',
                    role: Role.Admin,
                    username: 'username',
                    avatarUrl: 'avatarUrl',
                },
            };
            useCookie('refresh_token', {
                sameSite: 'strict',
            }).value = data.refreshToken;

            this.accessToken = data.accessToken;
            // this.user = jwtDecode<AuthUser>(data.accessToken);
            this.user = data.user;
            return true;
        },

        async refreshToken() {
            try {
                const refreshToken = useCookie('refresh_token').value;

                if (!refreshToken) return;

                const refreshTokenPayload = jwtDecode<AuthUser>(refreshToken);

                if (!refreshTokenPayload) {
                    this.logout();
                    return;
                }

                const data = await useApiPost<{
                    accessToken: string;
                }>('/auth/refresh', {
                    method: 'POST',
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
            const data = await useApiPost<RegisterResponse>('/auth/register', {
                body: formData,
            });

            this.accessToken = data.accessToken;
            const payload = jwtDecode<AuthUser>(data.accessToken);
            this.user = payload;
            location.reload();
        },

        async sendRequestResetPassword(dto: { email: string }) {
            await useApiPost('/auth/request-reset-password', {
                body: dto,
            });
        },

        async resetPassword(dto: { token: string; password: string }) {
            await useApiPost('/auth/reset-password', {
                body: dto,
            });
        },

        logout() {
            this.user = null;
            this.accessToken = '';

            useCookie('refresh_token', {
                sameSite: 'strict',
            }).value = null;

            navigateTo('/auth/login');
        },
    },
});
