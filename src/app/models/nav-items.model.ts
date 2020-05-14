export interface NavItemModel {
  text: string;
  href: string;
  active: boolean;
  orderId: number;
  featureToggle?: FeatureToggleModel;
}

export interface NavItemsModel {
  users: NavItemModel;
  organisation: NavItemModel;
}

export interface FeatureToggleModel {
  featureName?: string;
}
