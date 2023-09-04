import { AppPermission } from "@/types/enums/permission.enum";

export const DEFAULT_PERMISSIONS = [
  AppPermission.CanViewListMembers,
  AppPermission.CanCreateMember,
  AppPermission.CanUpdateMember,
  AppPermission.CanDeleteMember,
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
