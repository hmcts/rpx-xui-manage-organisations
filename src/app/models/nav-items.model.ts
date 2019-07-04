export interface NavItemModel {
  text: string;
  href: string;
  active: boolean;
}

export interface NavItemsModel {
  users: NavItemModel;
  organisation: NavItemModel;
}
