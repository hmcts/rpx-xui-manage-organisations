
import {AppConstants} from '../app.constants';
import { AppFeatureFlag } from '../store/reducers/app.reducer';
import {AppUtils} from './app-utils';
import { propsExist } from '../../../api/lib/objectUtilities';
const router = {
  state: {
    url: 'register'
  }
};
describe('AppUtils', () => {

  it('should return only getFeatureEnabledNavItems', () => {
    const navItems = [{
      text: 'Organisation',
      href: '/organisation',
      active: false,
      orderId: 1
    },
    {
      text: 'Users',
      href: '/users',
      active: false,
      orderId: 2
    },
    {
      text: 'Fee Accounts',
      href: '/fee-accounts',
      active: false,
      orderId: 3,
      featureToggle: {
        featureName: AppConstants.FEATURE_NAMES.feeAccount
      }
    }];

    const featureFlag: AppFeatureFlag = {
      isEnabled: true,
      featureName: AppConstants.FEATURE_NAMES.feeAccount
    };

    let result = AppUtils.getFeatureEnabledNavItems(navItems, [featureFlag]);
    expect(result).toEqual(navItems);

    featureFlag.isEnabled = false;
    result = AppUtils.getFeatureEnabledNavItems(navItems, [featureFlag]);
    expect(result).toEqual([{
      text: 'Organisation',
      href: '/organisation',
      active: false,
      orderId: 1
    },
    {
      text: 'Users',
      href: '/users',
      active: false,
      orderId: 2
    }]);
  });

  it('should set active links values', () => {
    const array = AppUtils.setActiveLink(AppConstants.NAV_ITEMS_ARRAY, router);
    expect(array).toEqual(AppConstants.NAV_ITEMS_ARRAY);
  });

  it('should set user navigation as an empty array', () => {
    const array = AppUtils.setSetUserNavItems({}, router);
    expect(array).toEqual([]);
  });

  it('should change string from upper case to capitalized', () => {
    const upperCaseString = 'PENDING';
    const capitalizedString = AppUtils.capitalizeString(upperCaseString);
    expect(capitalizedString).toEqual('Pending');
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

  it('should switch title', () => {
    const routerObj = {
      state: {
        url: 'testurl'
      }
    };

    const titleObj = {
      regOrg: 'Register Organisation',
      manageOrg: 'Manage Organisation'
    };
    const switchedTitle = AppUtils.titleSwitcher(routerObj, titleObj);
    expect(switchedTitle).toEqual('Manage Organisation');
  });

  it('should return a nav item array', () => {
    const routerObj = {
      state: {
        url: 'testurl'
      }
    };

    const nav = 'Navigation item';
    const returnNavItems = AppUtils.returnNavs(routerObj, nav);

    expect(returnNavItems).toEqual({navItems: 'Navigation item'});
  });

  it('should return an undefined nav item array', () => {
    const routerObj = {
      state: {
        url: 'register'
      }
    };

    const nav = '';
    const returnNavItems = AppUtils.returnNavs(routerObj, nav);
    expect(returnNavItems).toEqual({navItems: []});
  });

  it('should return aat environment string', () => {
    let nav = 'http://localhost';
    let url = AppUtils.getEnvironment(nav);
    expect(url).toEqual(AppConstants.ENVIRONMENT_NAMES.aat);

    nav = 'http://aat/something';
    url = AppUtils.getEnvironment(nav);
    expect(url).toEqual(AppConstants.ENVIRONMENT_NAMES.aat);
  });

  it('should return demo or ithc  or perf-test environment string', () => {
    let nav = 'http://demo/something';
    let url = AppUtils.getEnvironment(nav);
    expect(url).toEqual(AppConstants.ENVIRONMENT_NAMES.demo);

    nav = 'http://ithc/something';
    url = AppUtils.getEnvironment(nav);
    expect(url).toEqual(AppConstants.ENVIRONMENT_NAMES.ithc);

    nav = 'http://perf-test/something';
    url = AppUtils.getEnvironment(nav);
    expect(url).toEqual(AppConstants.ENVIRONMENT_NAMES.perfTest);
  });

  it('should return prod as it does not match any', () => {
    const nav = 'http://notany/something';
    const url = AppUtils.getEnvironment(nav);
    expect(url).toEqual(AppConstants.ENVIRONMENT_NAMES.prod);
  });
  it('should format date with time in 12 hour format', () => {
    const dateTime = new Date(2020, 0, 1, 21, 12);
    const dateString = AppUtils.formatDateAtTime(dateTime, false);
    expect(dateString).toEqual('01 Jan 2020 at 9:12 pm');
  });
  it('should format date with time in 24 hour format', () => {
    const dateTime = new Date(2020, 0, 1, 21, 12);
    const dateString = AppUtils.formatDateAtTime(dateTime, true);
    expect(dateString).toEqual('01 Jan 2020 at 21:12');
  });

  describe('propsExist()', () => {

    it('Should return true if all the properties exist on an object.', () => {

      const object = {level1: {level2: {level3: 'level3'}}}

      expect(propsExist(object, ['level1', 'level2', 'level3'])).toEqual(true);
    })

    it('Should return false if a property does not exist on an object.', () => {

      const object = {level1: {level2: {level3: 'level3'}}}

      expect(propsExist(object, ['level1', 'breakingProperty', 'level3'])).toEqual(false);
    })

    it('Should return false if the object is undefined.', () => {

      const object = undefined

      expect(propsExist(object, ['level1', 'level2', 'level3'])).toEqual(false);
    })

    it('Should return false if the object is null.', () => {

      const object = null

      expect(propsExist(object, ['level1', 'level2', 'level3'])).toEqual(false);
    })
  })
});
