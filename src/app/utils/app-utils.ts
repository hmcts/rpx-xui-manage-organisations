/**
 * Contains static stateless utility methods for the App
 *
 */
export class AppUtils {
  static setActiveLink(items, router) {
    const nav = items.map((item: {href}) => {
      return {
        ...item,
        active: item.href === router.state.url
      };
    });
    return nav;
  }
}
