
import {AppUtils} from './app-utils';
import {AppConstants} from '../app.constants';
const router = {
  state: {
    url: 'register'
  }
};
describe('AppUtils', () => {
  it('should set active links values', () => {
    const array = AppUtils.setActiveLink(AppConstants.NAV_ITEMS_ARRAY, router);
    expect(array).toEqual(AppConstants.NAV_ITEMS_ARRAY);
  });

  it('should set user navigation as an empty array', () => {
    const array = AppUtils.setSetUserNavItems({}, router);
    expect(array).toEqual([]);
  });

  it('should set user navigation as an array of items', () => {
    const state = {
      userNav: {
        label: 'Account navigation',
        items: [{text: 'Sign out', emit: 'sign-out'}]
      }
    };
    const routerOrg = {
      state: {
        url: 'organisation'
      }
    };
    const array = AppUtils.setSetUserNavItems(state, routerOrg);
    expect(array).toEqual(state.userNav);
  });

  it('should set correct page title', () => {
    const array = AppUtils.setPageTitle('invite-users');
    expect(array).toEqual('Invite user - Manage organisation');
  });
});
