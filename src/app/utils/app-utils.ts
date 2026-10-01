/**
 * Contains static stateless utility methods for the App
 */
import { formatDate } from '@angular/common';
import { LovRefDataModel } from '../../shared/models/lovRefData.model';
import { AppConstants } from '../app.constants';
import { NavItemModel } from '../models/nav-items.model';
import { AppFeatureFlag } from '../store/reducers/app.reducer';

export class AppUtils {
  private static readonly EXCLUDED_NAV_HREFS = ['/unassigned-cases', '/assigned-cases'];

  public static getFeatureEnabledNavItems(navItems: NavItemModel[],
    featureFlags: AppFeatureFlag[]): NavItemModel[] {
    let featureNavItems = new Array<NavItemModel>();
    navItems.forEach((navItem) => {
      if (AppUtils.EXCLUDED_NAV_HREFS.includes(navItem.href)) {
        return;
      }
      if (!navItem.featureToggle) {
        featureNavItems = [...featureNavItems, navItem];
      } else {
        const currentFeature = featureFlags.filter((flag) => flag.featureName === navItem.featureToggle.featureName)[0];
        if (currentFeature?.isEnabled) {
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
    if (router?.state) {
      return router.state.url.indexOf('register') !== -1 ? title.regOrg : title.manageOrg;
    }
  }

  public static returnNavs(router, nav) {
    if (router?.state?.url) {
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
    if (state?.userNav && routes?.state.url) {
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

  public static readonly DEFAULT_PAGE_TITLE = 'Manage Organisation - HM Courts & Tribunals Service - GOV.UK';

  public static setPageTitle(url: string): string {
    // Match path segments only: query parameters and fragments are not page identities.
    const path = url.split(/[?#]/)[0].replace(/^\/+|\/+$/g, '');
    if (/^register-org(?:-new)?(?:\/|$)/.test(path)) {
      return AppUtils.getPageTitleForRegisterOrganisation(path);
    }
    const titles: Record<string, string> = {
      organisation: 'Organisation details',
      'organisation/update-pba-numbers': 'Update PBA accounts',
      'organisation/update-pba-numbers-check': 'Check your PBA accounts',
      users: 'Users',
      'users/invite-user': 'Invite user',
      'users/invite-user-success': 'User invitation sent',
      'users/updated-user-success': 'User updated',
      'users/manage': 'Manage user',
      'fee-accounts': 'Payment by account',
      'fee-accounts/account': 'Account overview',
      cases: 'Cases',
      'assigned-cases': 'Assigned cases',
      'unassigned-cases': 'Unassigned cases',
      'accept-terms-and-conditions': 'Accept terms and conditions',
      'service-down': 'Sorry, there is a problem with the service',
      'access-denied': 'You cannot use Manage Organisations with this account',
      cookies: 'Cookies',
      'privacy-policy': 'Privacy policy',
      'terms-and-conditions': 'Terms and conditions',
      'terms-and-conditions-register-other-org': 'Terms and conditions for registering an organisation',
      accessibility: 'Accessibility statement',
      'get-help': 'Get help',
      'idle-sign-out': 'We have signed you out',
      'style-guide': 'Style guide',
      profile: 'Profile'
    };
    let title = titles[path];
    if (/^users\/user\/[^/]+$/.test(path)) {
      title = 'User details';
    } else if (/^users\/user\/[^/]+\/editpermission$/.test(path)) {
      title = 'Edit user permissions';
    } else if (/^users\/user\/[^/]+\/manage$/.test(path)) {
      title = 'Manage user';
    } else if (/^users\/user\/[^/]+\/(editpermission-failure|manage-user-failure)$/.test(path)) {
      title = 'Sorry, there is a problem with the service';
    } else if (/^fee-accounts\/account\/[^/]+$/.test(path)) {
      title = 'Account summary';
    } else if (/^fee-accounts\/account\/[^/]+\/transactions$/.test(path)) {
      title = 'Account transactions';
    } else if (/^(cases|assigned-cases|unassigned-cases)\//.test(path)) {
      const step = path.split('/')[1];
      const caseTitles: Record<string, string> = {
        'case-share': 'Share cases',
        'case-share-confirm': 'Check and confirm your case selection',
        'case-share-complete': 'Case update results',
        'accept-cases': 'Accept cases'
      };
      title = caseTitles[step];
    }
    return AppUtils.formatPageTitle(title);
  }

  public static getPageTitleForRegisterOrganisation(url: string): string {
    const segments = url.split(/[?#]/)[0].replace(/^\/+|\/+$/g, '').split('/');
    const step = segments[0] === 'register-org' && segments[1] === 'register'
      ? segments[2] || 'register' : segments[1] || 'register';
    const titles: Record<string, string> = {
      register: 'Register organisation',
      'organisation-type': 'Organisation type',
      'company-house-details': 'Company house details',
      'registered-address': 'Registered address',
      'document-exchange-reference': 'Do you have a document exchange reference?',
      'document-exchange-reference-details': 'Document exchange reference details',
      'regulatory-organisation-type': 'Organisation regulators',
      'organisation-services-access': 'Services to access',
      'payment-by-account': 'Do you have payment by account numbers?',
      'payment-by-account-details': 'Payment by account details',
      'contact-details': 'Contact details',
      'individual-registered-with-regulator': 'Are you registered with a regulator?',
      'individual-registered-with-regulator-details': 'Individual regulator details',
      'check-your-answers': 'Check your answers',
      'registration-submitted': 'Registration submitted',
      'service-down': 'Sorry, there is a problem with the service',
      'organisation-name': 'Organisation name',
      'organisation-address': 'Organisation address',
      'organisation-pba': 'PBA',
      'organisation-have-dx': 'DX',
      'organisation-dx': 'DX reference',
      haveSra: 'SRA',
      sraNumber: 'SRA number',
      name: 'Name',
      'email-address': 'Email',
      check: 'Check answers',
      confirmation: 'Registration submitted'
    };
    return AppUtils.formatPageTitle(titles[step] || 'Register organisation');
  }

  private static formatPageTitle(title?: string): string {
    return title ? `${title} - ${AppUtils.DEFAULT_PAGE_TITLE}` : AppUtils.DEFAULT_PAGE_TITLE;
  }

  // 04-Sep-2019 - Author U Denduluri
  // Function which returns the environment name based on the Url
  // by looking at the pattern
  public static getEnvironment(url: string): string {
    const regex = 'pr-|localhost|aat|demo|ithc|perf-test';
    const matched = url.match(regex);

    if (matched?.[0]) {
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
    return isAuth && router?.state && router.state.url.indexOf('accept-terms-and-conditions') <= 0;
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
      if (!object?.hasOwnProperty(nestedProperty)) {
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
