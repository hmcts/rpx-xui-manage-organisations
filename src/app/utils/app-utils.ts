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

  static setPageTitle(url): string {
    /**
     * it sets correct page titles
     */
    if (url.indexOf('invite-user') !== -1) {
      return 'Invite Users - Manage organisation';
    } else if (url.indexOf('organisation') !== -1) {
      return 'Organisation - Manage organisation';
    } else if (url.indexOf('profile') !== -1) {
      return 'Profile - Manage organisation';
    } else if (url.indexOf('users') !== -1) {
      return 'Users - Manage organisation';
    }

    return 'Manage organisation';
  }
}
