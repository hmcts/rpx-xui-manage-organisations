import * as fromAction from '../actions';
import {AppConstants} from '../../app.constants';
import {UserNavModel} from '../../models/user-nav.model';
import {AppTitlesModel} from '../../models/app-titles.model';
import {AppUtils} from '../../utils/app-utils';

export interface AppState {
  allNavItems: {[id: string]: object};
  pageTitle: string;
  navItems;
  userNav: UserNavModel;
  headerTitle: {regOrg: AppTitlesModel; manageOrg: AppTitlesModel};
  jurisdictions: any[];
}

export const initialState: AppState = {
  allNavItems: AppConstants.ROLES_BASED_NAV,
  pageTitle: '',
  userNav: AppConstants.USER_NAV,
  navItems: [],
  headerTitle: {regOrg: AppConstants.REG_ORG_TITLE, manageOrg: AppConstants.MANAGE_ORG_TITLE},
  jurisdictions: []
};

export function reducer(
  state = initialState,
  action: fromAction.appActions
): AppState {
  switch (action.type) {
    case fromAction.LOAD_JURISDICTIONS_GLOBAL_SUCCESS:
        const jurisdictions = action.payload;
        return {
          ...state,
          jurisdictions
        };

    case fromAction.SET_PAGE_TITLE: {
      const pageTitle = AppUtils.setPageTitle(action.payload);
      return {
        ...state,
        pageTitle
      };
    }

    case fromAction.SET_PAGE_TITLE_ERRORS: {
      const EXISTS = -1;
      const pageTitle = (state.pageTitle.indexOf('Error') !== EXISTS) ?
        state.pageTitle : 'Error: ' + state.pageTitle;
      return {
        ...state,
        pageTitle
      };
    }

    case fromAction.SET_USER_ROLES: {
      // TODO perhaps find better sorting solution for rendering sequence of nav tabs. It will not work Fees Acc
      const roles = [...action.payload];
      let navItems = [];
      roles.forEach(role => {
        if (state.allNavItems.hasOwnProperty(role)) {
          navItems = [
            ...navItems,
            state.allNavItems[role]
          ];
        }
      });
      return {
        ...state,
        navItems
      };
    }

    case fromAction.LOGOUT: {
      return {
        ...state,
        ...initialState
      };
    }
  }

  return state;
}

export const getPageTitle = (state: AppState) => state.pageTitle;
export const getNavItems = (state: AppState) => state.navItems;
export const getUserNavigation = (state: AppState) => state.userNav;
export const getHeaderTitles = (state: AppState) => state.headerTitle;
export const getUserJuridictions = (state: AppState) => state.jurisdictions;


