export interface NavItemModel {
  text: string;
  href: string;
  active: boolean;
  orderId: number;
}

export interface NavItemsModel {
  users: NavItemModel;
  organisation: NavItemModel;
}
