import { AppPermission } from "@/types/enums/permission.enum";

export const DEFAULT_PERMISSIONS = [
  AppPermission.CanManageUser,
  AppPermission.CanCreateUser,
  AppPermission.CanUpdateUser,
  AppPermission.CanDeleteUser,
  //
  AppPermission.CanViewListRoles,
  AppPermission.CanCreateRole,
  AppPermission.CanUpdateRole,
  AppPermission.CanDeleteRole,
  //
  AppPermission.CanViewListPermissions,
  AppPermission.CanCreatePermission,
  AppPermission.CanUpdatePermission,
  AppPermission.CanDeletePermission,
];
