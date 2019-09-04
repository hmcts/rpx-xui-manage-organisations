/**
 * Contains static stateless utility methods for the App
 *
 */
import { AppConstants } from '../app.constants';
export class AppUtils {
  /**
   * it changes active property based on the url
   */
  static setActiveLink(items, router) {
    const nav = items.map((item: { href }) => {
      return {
        ...item,
        active: item.href === router.state.url
      };
    });
    return nav;
  }

  static titleSwitcher(router, title) {
    if (router && router.state) {
      return router.state.url.indexOf('register') !== -1 ? title.regOrg : title.manageOrg;
    }
  }

  static returnNavs(router, nav) {
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

  static setSetUserNavItems(state, routes) {
    /**
     * it manages user nav array based on the app that is running (register or otherwise)
     */
    if (state && state.userNav && routes && routes.state.url) {
      const isRegister = routes.state.url.indexOf('register') === -1;
      return isRegister ? state.userNav : [];
    }
    return [];
  }

  static capitalizeString(stringToCapitalize: string) {
    const stringLowercase = stringToCapitalize.toLowerCase();
    const stringCapitalised = stringLowercase.charAt(0).toUpperCase() + stringLowercase.slice(1);
    return stringCapitalised;
  }

  static setPageTitle(url): string {
    /**
     * it sets correct page titles based on the url.
     */
    if (url.indexOf('invite-user') !== -1) {
      return 'Invite user - Manage organisation';
    }
    if (url.indexOf('profile') !== -1) {
      return 'Profile - Manage organisation';
    }
    if (url.indexOf('users') !== -1) {
      return 'Users - Manage organisation';
    }
    if (url.indexOf('organisation-name') !== -1) {
      return 'Organisation name - Register organisation';
    }
    if (url.indexOf('organisation-address') !== -1) {
      return 'Organisation address - Register organisation';
    }
    if (url.indexOf('organisation-pba') !== -1) {
      return 'PBA - Register organisation';
    }
    if (url.indexOf('have-dx') !== -1) {
      return 'DX - Register organisation';
    }
    if (url.indexOf('organisation-dx') !== -1) {
      return 'DX reference - Register organisation';
    }
    if (url.indexOf('haveSra') !== -1) {
      return 'SRA - Register organisation';
    }
    if (url.indexOf('sraNumber') !== -1) {
      return 'SRA number - Register organisation';
    }
    if (url.indexOf('name') !== -1) {
      return 'Name - Register organisation';
    }
    if (url.indexOf('email-address') !== -1) {
      return 'Email - Register organisation';
    }
    if (url.indexOf('check') !== -1) {
      return 'Check answers - Register organisation';
    }
    if (url.indexOf('organisation') !== -1) {
      return 'Organisation details - Manage organisation';
    }
    if (url.indexOf('register-org/register') !== -1) {
      return 'Register - Register organisation';
    }
    if (url.indexOf('register-org/confirmation') !== -1) {
      return 'Confirmation - Register organisation';
    }
    return 'Manage organisation';
  }

  // 04-Sep-2019 - Author U Denduluri
  // Function which returns the environment name based on the Url
  // by looking at the pattern
  static getEnvironment(url: string): string {
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
}
