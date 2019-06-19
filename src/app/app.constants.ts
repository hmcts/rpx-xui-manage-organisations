import {NavItemsModel} from './models/nav-items.model';
import {UserNavModel} from './models/user-nav.model';
import {AppTitlesModel} from './models/app-titles.model';

const navItems: NavItemsModel[] = [
  {
    text: 'Organisation',
    href: '/organisation',
    active: true
  },
  {
    text: 'Users',
    href: '/users',
    active: false
  }
];

const userNav: UserNavModel = {
  label: 'Account navigation',
  items: [{
    text: 'Profile',
    href: '/profile'
  }, {
    text: 'Sign out',
    href: '/api/logout'
  }]
};

const regOrgTitle: AppTitlesModel = {
  name: 'Register to manage civil and family law cases',
  url: '/'
};

const manageOrgTitle: AppTitlesModel = {
  name: 'Manage Organisation',
  url: '/'
};

export class AppConstants {
  static NAV_ITEMS = navItems;
  static USER_NAV = userNav;
  static REG_ORG_TITLE = regOrgTitle;
  static MANAGE_ORG_TITLE = manageOrgTitle;
}
