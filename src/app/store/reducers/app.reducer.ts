import { TCDocument } from '@hmcts/rpx-xui-common-lib';
import { AppConstants } from '../../app.constants';
import { AppTitlesModel } from '../../models/app-titles.model';
import { UserNavModel } from '../../models/user-nav.model';
import { AppUtils } from '../../utils/app-utils';
import * as fromAction from '../actions';

export interface AppState {
  allNavItems: {[id: string]: object};
  pageTitle: string;
  navItems;
  userNav: UserNavModel;
  headerTitle: {regOrg: AppTitlesModel; manageOrg: AppTitlesModel};
  jurisdictions: any[];
  termsAndConditions: TCDocument;
  globalError: GlobalError;
}

export interface ErrorMessage {
  bodyText: string;
  urlText: string;
  url: string;
  newTab?: boolean;
}

export interface GlobalError {
  header: string;
  errors: ErrorMessage [];
}

export const initialState: AppState = {
  allNavItems: AppConstants.ROLES_BASED_NAV,
  pageTitle: '',
  userNav: AppConstants.USER_NAV,
  navItems: [],
  headerTitle: {regOrg: AppConstants.REG_ORG_TITLE, manageOrg: AppConstants.MANAGE_ORG_TITLE},
  jurisdictions: [],
  termsAndConditions: null,
  globalError: null,
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
      navItems = navItems.sort((a, b) => (a.orderId > b.orderId) ? 1 : ((b.orderId > a.orderId) ? -1 : 0));
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

    case fromAction.LOAD_TERMS_CONDITIONS_SUCCESS:
      return {
        ...state,
        termsAndConditions: action.payload
      };

    case fromAction.APP_ADD_GLOBAL_ERROR: {
      return {
        ...state,
        globalError: action.payload
      };
    }

    case fromAction.APP_CLEAR_GLOBAL_ERROR: {
      return {
        ...state,
        globalError: null
      };
    }

    default: {
      return state;
    }
  }

  return state;
}

export const getPageTitle = (state: AppState) => state.pageTitle;
export const getNavItems = (state: AppState) => state.navItems;
export const getUserNavigation = (state: AppState) => state.userNav;
export const getHeaderTitles = (state: AppState) => state.headerTitle;
export const getUserJuridictions = (state: AppState) => state.jurisdictions;
export const getTermsConditions = (state: AppState) => state.termsAndConditions;
export const getGlobalError = (state: AppState) => state.globalError;
