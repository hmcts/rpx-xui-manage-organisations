
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

  it('should set correct page titles', () => {
    const array = AppUtils.setPageTitle('invite-users');
    expect(array).toEqual('Invite user - Manage organisation');
  });
  it('should set correct page titles', () => {
    const array = AppUtils.setPageTitle('organisation-name');
    expect(array).toEqual('Organisation name - Register organisation');
  });
  it('should set correct page titles', () => {
    const array = AppUtils.setPageTitle('organisation-address');
    expect(array).toEqual('Organisation address - Register organisation');
  });
  it('should set correct page titles', () => {
    const array = AppUtils.setPageTitle('organisation-pba');
    expect(array).toEqual('PBA - Register organisation');
  });
  it('should set correct page titles', () => {
    const array = AppUtils.setPageTitle('have-dx');
    expect(array).toEqual('DX - Register organisation');
  });
  it('should set correct page titles', () => {
    const array = AppUtils.setPageTitle('organisation-dx');
    expect(array).toEqual('DX reference - Register organisation');
  });
  it('should set correct page titles', () => {
    const array = AppUtils.setPageTitle('haveSra');
    expect(array).toEqual('SRA - Register organisation');
  });
  it('should set correct page titles', () => {
    const array = AppUtils.setPageTitle('sraNumber');
    expect(array).toEqual('SRA number - Register organisation');
  });
  it('should set correct page titles', () => {
    const array = AppUtils.setPageTitle('name');
    expect(array).toEqual('Name - Register organisation');
  });
  it('should set correct page titles', () => {
    const array = AppUtils.setPageTitle('email-address');
    expect(array).toEqual('Email - Register organisation');
  });
  it('should set correct page titles', () => {
    const array = AppUtils.setPageTitle('check');
    expect(array).toEqual('Check answers - Register organisation');
  });
  it('should set correct page titles', () => {
    const array = AppUtils.setPageTitle('register-org/register');
    expect(array).toEqual('Register - Register organisation');
  });

});
