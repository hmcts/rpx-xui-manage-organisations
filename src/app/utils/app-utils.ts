/**
 * Contains static stateless utility methods for the App
 *
 */
import {formatDate} from '@angular/common';
import { AppConstants } from '../app.constants';
import { NavItemModel, NavItemsModel } from '../models/nav-items.model';
import { AppFeatureFlag } from '../store/reducers/app.reducer';

export class AppUtils {

  public static getFeatureEnabledNavItems(navItems: NavItemModel[],
                                          featureFlags: AppFeatureFlag[]): NavItemModel[] {
    let featureNavItems = new Array<NavItemModel>();
    navItems.forEach(navItem => {
      if (!navItem.featureToggle) {
        featureNavItems = [...featureNavItems, navItem];
      } else {
        const currentFeature = featureFlags.filter(flag => flag.featureName === navItem.featureToggle.featureName)[0];
        if (currentFeature && currentFeature.isEnabled) {
          featureNavItems = [...featureNavItems, navItem];
        }
      }
    });
    return featureNavItems;
  }

  /**
   * it changes active property based on the url
   */
  public static setActiveLink(items: NavItemModel[], router) {
    const nav = items.map((item: { href }) => {
      return {
        ...item,
        active: item.href === router.state.url
      };
    });
    return nav;
  }

  public static titleSwitcher(router, title) {
    if (router && router.state) {
      return router.state.url.indexOf('register') !== -1 ? title.regOrg : title.manageOrg;
    }
  }

  public static returnNavs(router, nav) {
    if (router && router.state && router.state.url.indexOf('register') === -1) {
      return {
        navItems: nav
      };
    } else {
      return {
        navItems: []
      };
    }
  }

  public static setSetUserNavItems(state, routes) {
    /**
     * it manages user nav array based on the app that is running (register or otherwise)
     */
    if (state && state.userNav && routes && routes.state.url) {
      const isRegister = routes.state.url.indexOf('register') === -1;
      return isRegister ? state.userNav : [];
    }
    return [];
  }

  public static capitalizeString(stringToCapitalize: string) {
    const stringLowercase = stringToCapitalize.toLowerCase();
    const stringCapitalised = stringLowercase.charAt(0).toUpperCase() + stringLowercase.slice(1);
    return stringCapitalised;
  }

  public static formatDateAtTime(date: Date, is24Hour: boolean): string {
    return `${formatDate(date, 'dd MMM yyyy', 'en-UK')} at ${AppUtils.formatTime(date, is24Hour)}`;
  }

  public static formatTime(date: Date, is24Hour: boolean): string {
    return is24Hour ? formatDate(date, 'HH:mm', 'en-UK') : formatDate(date, 'h:mm a', 'en-UK').toLowerCase();
  }

  // 04-Sep-2019 - Author U Denduluri
  // Function which returns the environment name based on the Url
  // by looking at the pattern
  public static getEnvironment(url: string): string {
    const regex = 'pr-|localhost|aat|demo|ithc|perf-test';
    const matched = url.match(regex);

    if (matched && matched[0]) {
        switch (matched[0]) {
          case AppConstants.ENVIRONMENT_NAMES.aat:
          case AppConstants.ENVIRONMENT_NAMES.localhost:
          case AppConstants.ENVIRONMENT_NAMES.pr:
             return AppConstants.ENVIRONMENT_NAMES.aat;
          case AppConstants.ENVIRONMENT_NAMES.demo:
              return AppConstants.ENVIRONMENT_NAMES.demo;
          case AppConstants.ENVIRONMENT_NAMES.ithc:
              return AppConstants.ENVIRONMENT_NAMES.ithc;
          case AppConstants.ENVIRONMENT_NAMES.perfTest:
              return AppConstants.ENVIRONMENT_NAMES.perfTest;
        }
      }
    return AppConstants.ENVIRONMENT_NAMES.prod;
  }
  public static showSubHeaderItems(isAuth: boolean, router: any) {
    return isAuth && router && router.state && router.state.url.indexOf('accept-terms-and-conditions') <= 0;
  }

  /**
   * Checks if nested properties exists on an object.
   *
   * Ref: https://stackoverflow.com/questions/2631001/test-for-existence-of-nested-javascript-object-key
   *
   * @see unit tests
   */
  public static propsExist(object, nestedProps) {

    for (const nestedProperty of nestedProps) {
      if (!object || !object.hasOwnProperty(nestedProperty)) {
        return false;
      }
      object = object[nestedProperty];
    }

    return true;
  }

  public static atleastOneCase(currentSelection: any) {
    let anyItem = false;
    for (const key in currentSelection) {
      if (currentSelection[key] && currentSelection[key].length > 0) {
        anyItem = true;
        break;
      }
    }
    return anyItem;
  }

  public static getSelectedItemsList(currentSelection: any): any {
    let items = new Array<any>();
    for (const key in currentSelection) {
      if (currentSelection[key] && currentSelection[key].length > 0) {
        items = [...items, ...currentSelection[key]];
      }
    }
    return items;
  }
}
