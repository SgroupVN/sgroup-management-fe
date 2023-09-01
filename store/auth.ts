import jwtDecode from 'jwt-decode';
import { defineStore } from 'pinia';
import { Role } from '~/types/enums/Role';

export type LoginRequestDto = {
    username: string;
    password: string;
};

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
};

export type AuthPayload = {
    id: number;
    email: string;
    name: string;
    role: Role;
    username: string;
    avatarUrl: string;
};

export type AuthUser = Omit<AuthPayload, 'iat' | 'exp'>;

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
    user: AuthUser;
    loading: boolean;
};

export type RequestResetPasswordDto = {
    email: string;
};

export type ResetPasswordDto = {
    token: string;
    password: string;
};

export const useAuthStore = defineStore({
    id: 'auth',
    state: () =>
        ({
            accessToken: '',
            user: {},
        }) as AuthData,
    getters: {
        isAuth(): Boolean {
            const refreshToken = useCookie('refresh_token').value;
            if (!refreshToken) return false;

            try {
                const refreshTokenPayload =
                    jwtDecode<AuthPayload>(refreshToken);

                if (!refreshTokenPayload) return false;
            } catch (error) {
                return false;
            }
            console.log('isAuth');
            console.log(this.user);
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
            // useCookie('refresh_token', {
            //     sameSite: 'strict',
            // }).value = data.refreshToken;

            // this.accessToken = data.accessToken;
            // const payload = jwtDecode<AuthPayload>(data.accessToken);
            // this.user = payload;
            // location.reload();

            const data = {
                refreshToken: 'refreshToken',
                accessToken: 'accessToken',
            };
            useCookie('accessToken', {
                sameSite: 'strict',
            }).value = data.refreshToken;

            const payload = {
                id: 1,
                email: 'p@gmail.com',
                name: 'name',
                role: Role.Admin,
                username: 'username',
                avatarUrl: 'avatarUrl',
            };
            this.accessToken = data.accessToken;
            this.user = payload;
        },

        async refreshToken() {
            try {
                const refreshToken = useCookie('refresh_token').value;

                if (!refreshToken) return;

                const refreshTokenPayload =
                    jwtDecode<AuthPayload>(refreshToken);

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
                const payload = jwtDecode<AuthPayload>(data.accessToken);

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

            useCookie('accessToken', {
                sameSite: 'strict',
            }).value = data.accessToken;
            useCookie('refresh_token', {
                sameSite: 'strict',
            }).value = data.refreshToken;

            this.accessToken = data.accessToken;
            const payload = jwtDecode<AuthPayload>(data.accessToken);
            this.user = payload;
            location.reload();
        },

        async sendRequestResetPassword(dto: RequestResetPasswordDto) {
            await useApiPost('/auth/request-reset-password', {
                body: dto,
            });
        },

        async resetPassword(dto: ResetPasswordDto) {
            await useApiPost('/auth/reset-password', {
                body: dto,
            });
        },

        logout() {
            useCookie('refresh_token', {
                sameSite: 'strict',
            }).value = null;
            if (process.client) {
                location.replace('/auth/login');
            }
        },
    },
});
