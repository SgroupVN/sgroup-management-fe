import { AppPermission } from "@/types/enums/permission.enum";

export interface AuthUser {
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
}

export class UserResponseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  phone: string;
  role: {
    id: string;
    name: string;
    permissions: {
      id: string;
      name: AppPermission;
    }[];
  };
}

export interface Role {
  id: string;
  name: string;
  permissions: AppPermission[];
}

// #region Request Model
export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  name: string;
  username: string;
  password: string;
}

// #endregion

// #region Response Model
export type LoginResponse = {
  data: {
    user: UserResponseModel;
    token: {
      accessToken: string;
      refreshToken: string;
    };
  };
  success: boolean;
};

export type RegisterResponse = {
  accessToken: string;
  refreshToken: string;
};
