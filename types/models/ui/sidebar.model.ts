import { AppPermission } from "@/types/enums/permission.enum";

export class SidebarMenuItemModel {
  label: string = "";
  to?: string;
  items?: SidebarMenuItemModel[];
  permission?: AppPermission;
  icon?: string;
  class?: string;

  public constructor(init?: Partial<SidebarMenuItemModel>) {
    Object.assign(this, init);
  }
}
