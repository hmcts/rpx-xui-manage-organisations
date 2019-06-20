import * as fromAction from '../actions';
import {NavItemsModel} from '../../models/nav-items.model';
import {AppConstants} from '../../app.constants';
import {UserNavModel} from '../../models/user-nav.model';
import {AppTitlesModel} from '../../models/app-titles.model';

/* function that returns page title base on page url indexOf */
export function setPageTitle(url): string {
  if (url.indexOf('invite-user') !== -1) {
    return 'Invite Users - Professional User Interface';
  } else if (url.indexOf('organisation') !== -1) {
    return 'Organisation - Professional User Interface';
  } else if (url.indexOf('profile') !== -1) {
    return 'Profile - Professional User Interface';
  } else if (url.indexOf('users') !== -1) {
    return 'Users - Professional User Interface';
  } else if (url.indexOf('login') !== -1) {
    return 'Login - Professional User Interface';
  }
  return 'Professional User Interface';
}

export interface AppState {
  pageTitle: string;
  navItems: NavItemsModel[];
  userNav: UserNavModel;
  headerTitle: {regOrg: AppTitlesModel; manageOrg: AppTitlesModel};
}

export const initialState: AppState = {
  pageTitle: '',
  navItems: AppConstants.NAV_ITEMS,
  userNav: AppConstants.USER_NAV,
  headerTitle: {regOrg: AppConstants.REG_ORG_TITLE, manageOrg: AppConstants.MANAGE_ORG_TITLE}
};

export function reducer(
  state = initialState,
  action: fromAction.appActions
): AppState {
  switch (action.type) {

    case fromAction.SET_PAGE_TITLE: {
      const pageTitle = setPageTitle(action.payload);
      return {
        ...state,
        pageTitle
      };
    }

    case fromAction.SET_PAGE_TITLE_ERRORS: {
      const EXISTS = -1;
      const pageTitle = (state.pageTitle.indexOf('Error') !== EXISTS ) ?
        state.pageTitle :  'Error: ' + state.pageTitle;
      return {
        ...state,
        pageTitle
      };
    }
  }

  return state;
}

export const getPageTitle = (state: AppState) => state.pageTitle;
export const getNavItems = (state: AppState) => state.navItems;
export const getUserNavigation = (state: AppState) => state.userNav;
export const getHeaderTitles = (state: AppState) => state.headerTitle;


