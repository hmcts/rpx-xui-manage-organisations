/**
 * Contains static stateless utility methods for the App
 */
import { formatDate } from '@angular/common';
import { LovRefDataModel } from '../../shared/models/lovRefData.model';
import { AppConstants } from '../app.constants';
import { NavItemModel } from '../models/nav-items.model';
import { AppFeatureFlag } from '../store/reducers/app.reducer';

export class AppUtils {
  public static getFeatureEnabledNavItems(navItems: NavItemModel[],
    featureFlags: AppFeatureFlag[]): NavItemModel[] {
    let featureNavItems = new Array<NavItemModel>();
    navItems.forEach((navItem) => {
      if (!navItem.featureToggle) {
        featureNavItems = [...featureNavItems, navItem];
      } else {
        const currentFeature = featureFlags.filter((flag) => flag.featureName === navItem.featureToggle.featureName)[0];
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
    return items.map((item: { href }) => {
      return {
        ...item,
        active: item.href === router.state.url
      };
    });
  }

  public static titleSwitcher(router, title) {
    if (router && router.state) {
      return router.state.url.indexOf('register') !== -1 ? title.regOrg : title.manageOrg;
    }
  }

  public static returnNavs(router, nav) {
    if (router && router.state && router.state.url) {
      const url = router.state.url;
      const isRegisterJourney = url.includes('register-org') || url.includes('register-org-new');
      return {
        navItems: isRegisterJourney ? [] : nav
      };
    }
    return { navItems: [] };
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
    return stringLowercase.charAt(0).toUpperCase() + stringLowercase.slice(1);
  }

  public static formatDateAtTime(date: Date, is24Hour: boolean): string {
    return `${formatDate(date, 'dd MMM yyyy', 'en-UK')} at ${AppUtils.formatTime(date, is24Hour)}`;
  }

  public static formatTime(date: Date, is24Hour: boolean): string {
    return is24Hour ? formatDate(date, 'HH:mm', 'en-UK') : formatDate(date, 'h:mm a', 'en-UK').toLowerCase();
  }

  public static setPageTitle(url: string): string {
    /**
     * it sets correct page titles based on the url.
     */
    if (url.indexOf('register-org') !== -1 || url.indexOf('register-org-new') !== -1) {
      return AppUtils.getPageTitleForRegisterOrganisation(url);
    }
    if (url.indexOf('invite-user') !== -1) {
      return 'Manage organisation - Invite user - GOV.UK';
    }
    if (url.indexOf('profile') !== -1) {
      return 'Manage organisation - Profile - GOV.UK';
    }
    if (url.indexOf('organisation') !== -1) {
      return 'Manage organisation - Organisation details - GOV.UK';
    }
    if (url.indexOf('users') !== -1) {
      return 'Manage organisation - Users - GOV.UK';
    }
    if (url.indexOf('unassigned-cases') !== -1) {
      return 'Manage organisation - Unassigned cases - GOV.UK';
    }
    if (url.indexOf('assigned-cases') !== -1) {
      return 'Manage organisation - Assigned cases - GOV.UK';
    }
    return 'Manage organisation - GOV.UK';
  }

  public static getPageTitleForRegisterOrganisation(url: string): string {
    if (url.indexOf('register-org-new/register') !== -1) {
      return 'Register organisation - Register - GOV.UK';
    }
    if (url.indexOf('register-org-new/organisation-type') !== -1) {
      return 'Register organisation - Organisation type - GOV.UK';
    }
    if (url.indexOf('register-org-new/company-house-details') !== -1) {
      return 'Register organisation - Company house details - GOV.UK';
    }
    if (url.indexOf('register-org-new/registered-address') !== -1) {
      return 'Register organisation - Registered address - GOV.UK';
    }
    if (url.indexOf('register-org-new/document-exchange-reference') !== -1) {
      return 'Register organisation - Document exchange reference - GOV.UK';
    }
    if (url.indexOf('register-org-new/regulatory-organisation-type') !== -1) {
      return 'Register organisation - Organisation regulators - GOV.UK';
    }
    if (url.indexOf('register-org-new/organisation-services-access') !== -1) {
      return 'Register organisation - Services to access - GOV.UK';
    }
    if (url.indexOf('register-org-new/payment-by-account') !== -1) {
      return 'Register organisation - Payment by account - GOV.UK';
    }
    if (url.indexOf('register-org-new/contact-details') !== -1) {
      return 'Register organisation - Contact details - GOV.UK';
    }
    if (url.indexOf('register-org-new/individual-registered-with-regulator') !== -1) {
      return 'Register organisation - Individual regulators - GOV.UK';
    }
    if (url.indexOf('register-org-new/check-your-answers') !== -1) {
      return 'Register organisation - Check your answers - GOV.UK';
    }
    if (url.indexOf('register-org/register/organisation-name') !== -1) {
      return 'Register organisation - Organisation name - GOV.UK';
    }
    if (url.indexOf('register-org/register/organisation-address') !== -1) {
      return 'Register organisation - Organisation address - GOV.UK';
    }
    if (url.indexOf('register-org/register/organisation-pba') !== -1) {
      return 'Register organisation - PBA - GOV.UK';
    }
    if (url.indexOf('register-org/register/organisation-have-dx') !== -1) {
      return 'Register organisation - DX - GOV.UK';
    }
    if (url.indexOf('register-org/register/organisation-dx') !== -1) {
      return 'Register organisation - DX reference - GOV.UK';
    }
    if (url.indexOf('register-org/register/haveSra') !== -1) {
      return 'Register organisation - SRA - GOV.UK';
    }
    if (url.indexOf('register-org/register/sraNumber') !== -1) {
      return 'Register organisation - SRA number - GOV.UK';
    }
    if (url.indexOf('register-org/register/name') !== -1) {
      return 'Register organisation - Name - GOV.UK';
    }
    if (url.indexOf('register-org/register/email-address') !== -1) {
      return 'Register organisation - Email - GOV.UK';
    }
    if (url.indexOf('register-org/register/check') !== -1) {
      return 'Register organisation - Check answers - GOV.UK';
    }
    if (url.indexOf('register-org/register/confirmation') !== -1) {
      return 'Register organisation - Confirmation - GOV.UK';
    }
    return 'Register organisation - Register - GOV.UK';
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

  public static atLeastOneCase(currentSelection: any) {
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

  /**
   * Returns the index of the last element in the array where predicate is true, and -1
   * otherwise.
   *
   * @param array The source array to search in
   * @param predicate find calls predicate once for each element of the array, in descending
   * order, until it finds one where predicate returns true. If such an element is found,
   * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
   */
  public static findLastIndex<T>(array: T[], predicate: (value: T, index: number, obj: T[]) => boolean): number {
    let l = array.length;
    while (l--) {
      if (predicate(array[l], l, array)) {
        return l;
      }
    }
    return -1;
  }

  public static setOtherAsLastOption(items: LovRefDataModel[], other: LovRefDataModel = null): LovRefDataModel[] {
    // To set Other option as the last option
    const index = items.findIndex((o) => o.key.toUpperCase() === 'OTHER');
    if (index > 0) {
      items.push(items.splice(index, 1)[0]);
    } else {
      if (!other) {
        other = {
          active_flag: '',
          category_key: '',
          hint_text_cy: '',
          hint_text_en: '',
          key: 'OTHER',
          lov_order: null,
          parent_category: '',
          parent_key: '',
          value_cy: '',
          value_en: 'Other',
          child_nodes: null
        };
      }
      items.push(other);
    }

    return items;
  }
}
