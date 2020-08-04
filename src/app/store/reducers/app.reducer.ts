import { TCDocument } from '@hmcts/rpx-xui-common-lib';
import { AppConstants } from '../../app.constants';
import { AppTitlesModel } from '../../models/app-titles.model';
import {NavItemModel} from '../../models/nav-items.model';
import { UserNavModel } from '../../models/user-nav.model';
import { AppUtils } from '../../utils/app-utils';
import * as fromAction from '../actions';

export interface AppFeatureFlag {
 featureName: string;
 isEnabled: boolean;
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

export interface AppState {
  allNavItems: {[id: string]: object};
  navItems: NavItemModel[];
  userNav: UserNavModel;
  headerTitle: {regOrg: AppTitlesModel; manageOrg: AppTitlesModel};
  jurisdictions: any[];
  termsAndConditions: TCDocument;
  featureFlags: AppFeatureFlag[];
  globalError: GlobalError;
  modal: {[id: string]: {isVisible?: boolean; countdown?: string}};
}

export const initialState: AppState = {
  allNavItems: AppConstants.ROLES_BASED_NAV,
  userNav: AppConstants.USER_NAV,
  navItems: [],
  headerTitle: {regOrg: AppConstants.REG_ORG_TITLE, manageOrg: AppConstants.MANAGE_ORG_TITLE},
  jurisdictions: [],
  termsAndConditions: null,
  featureFlags: [],
  globalError: null,
  modal: {
    session: {
      isVisible: false,
      countdown: ''
    }
  },
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
    case fromAction.LOAD_FEATURE_TOGGLE_CONFIG_SUCCESS:
      return {
        ...state,
        featureFlags: action.payload
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

    case fromAction.SET_MODAL: {
      return {
        ...state,
        modal: {...action.payload}
      };
    }

    default: {
      return state;
    }
  }
}

export const getNavItems = (state: AppState) => state.navItems;
export const getUserNavigation = (state: AppState) => state.userNav;
export const getHeaderTitles = (state: AppState) => state.headerTitle;
export const getUserJuridictions = (state: AppState) => state.jurisdictions;
export const getTermsConditions = (state: AppState) => state.termsAndConditions;
export const getFeatureFlag = (state: AppState) => state.featureFlags;
export const getGlobalError = (state: AppState) => state.globalError;
export const getModal = (state: AppState) => state.modal;
