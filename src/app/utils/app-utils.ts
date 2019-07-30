/**
 * Contains static stateless utility methods for the App
 *
 */
export class AppUtils {
  /**
   * it changes active property based on the url
   */
  static setActiveLink(items, router) {
    const nav = items.map((item: {href}) => {
      return {
        ...item,
        active: item.href === router.state.url
      };
    });
    return nav;
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
    return stringCapitalised
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
    return 'Manage organisation';
  }
}
