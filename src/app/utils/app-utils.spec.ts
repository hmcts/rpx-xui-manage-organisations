import { LovRefDataModel } from '../../shared/models/lovRefData.model';
import { propsExist } from '../../../api/lib/objectUtilities';
import { AppConstants } from '../app.constants';
import { AppFeatureFlag } from '../store/reducers/app.reducer';
import { AppUtils } from './app-utils';

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
        items: [{ text: 'Sign out', emit: 'sign-out' }]
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

  describe('Page title', () => {
    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org-new/register');
      expect(array).toEqual('Register organisation - Register - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org-new/organisation-type');
      expect(array).toEqual('Register organisation - Organisation type - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org-new/company-house-details');
      expect(array).toEqual('Register organisation - Company house details - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org-new/document-exchange-reference');
      expect(array).toEqual('Register organisation - Document exchange reference - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org-new/regulatory-organisation-type');
      expect(array).toEqual('Register organisation - Organisation regulators - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org-new/organisation-services-access');
      expect(array).toEqual('Register organisation - Services to access - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org-new/payment-by-account');
      expect(array).toEqual('Register organisation - Payment by account - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org-new/individual-registered-with-regulator');
      expect(array).toEqual('Register organisation - Individual regulators - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org-new/check-your-answers');
      expect(array).toEqual('Register organisation - Check your answers - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org/register/organisation-name');
      expect(array).toEqual('Register organisation - Organisation name - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org/register/organisation-address');
      expect(array).toEqual('Register organisation - Organisation address - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org/register/organisation-pba');
      expect(array).toEqual('Register organisation - PBA - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org/register/organisation-have-dx');
      expect(array).toEqual('Register organisation - DX - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org/register/organisation-dx');
      expect(array).toEqual('Register organisation - DX reference - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org/register/haveSra');
      expect(array).toEqual('Register organisation - SRA - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org/register/sraNumber');
      expect(array).toEqual('Register organisation - SRA number - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org/register/name');
      expect(array).toEqual('Register organisation - Name - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org/register/email-address');
      expect(array).toEqual('Register organisation - Email - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org/register/check');
      expect(array).toEqual('Register organisation - Check answers - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('register-org/register');
      expect(array).toEqual('Register organisation - Register - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('invite-users');
      expect(array).toEqual('Manage organisation - Invite user - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('organisation');
      expect(array).toEqual('Manage organisation - Organisation details - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('users');
      expect(array).toEqual('Manage organisation - Users - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('unassigned-cases');
      expect(array).toEqual('Manage organisation - Unassigned cases - GOV.UK');
    });

    it('should set correct page title', () => {
      const array = AppUtils.setPageTitle('assigned-cases');
      expect(array).toEqual('Manage organisation - Assigned cases - GOV.UK');
    });
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

    expect(returnNavItems).toEqual({ navItems: 'Navigation item' });
  });

  it('should hide nav items for register journeys', () => {
    const routerObj = {
      state: {
        url: 'register-org/register'
      }
    };

    const nav = '';
    const returnNavItems = AppUtils.returnNavs(routerObj, nav);
    expect(returnNavItems).toEqual({ navItems: [] });
  });

  it('should show nav items for terms-and-conditions-register-other-org', () => {
    const routerObj = {
      state: {
        url: 'terms-and-conditions-register-other-org'
      }
    };
    const nav = 'Navigation item';
    const returnNavItems = AppUtils.returnNavs(routerObj, nav);
    expect(returnNavItems).toEqual({ navItems: 'Navigation item' });
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
      const object = { level1: { level2: { level3: 'level3' } } };

      expect(propsExist(object, ['level1', 'level2', 'level3'])).toEqual(true);
    });

    it('Should return false if a property does not exist on an object.', () => {
      const object = { level1: { level2: { level3: 'level3' } } };

      expect(propsExist(object, ['level1', 'breakingProperty', 'level3'])).toEqual(false);
    });

    it('Should return false if the object is undefined.', () => {
      const object = undefined;

      expect(propsExist(object, ['level1', 'level2', 'level3'])).toEqual(false);
    });

    it('Should return false if the object is null.', () => {
      const object = null;

      expect(propsExist(object, ['level1', 'level2', 'level3'])).toEqual(false);
    });
  });

  it('should return index of the last element in the array where predicate is true', () => {
    const htmlComponentArray = [
      {
        input: {
          label: {
            text: 'PBA number(optional)',
            classes: 'govuk-label--m'
          },
          control: 'PBAnumber1',
          validators: [
            'pbaNumberPattern',
            'pbaNumberMaxLength',
            'pbaNumberMinLength'
          ],
          validationError: {
            value: 'Enter a valid PBA number',
            controlId: 'PBAnumber1'
          },
          classes: 'govuk-!-width-two-thirds'
        }
      },
      {
        input: {
          label: {
            text: 'PBA number(optional)',
            classes: 'govuk-label--m'
          },
          control: 'PBAnumber2',
          validators: [
            'pbaNumberPattern',
            'pbaNumberMaxLength',
            'pbaNumberMinLength'
          ],
          validationError: {
            value: 'Enter a valid PBA number',
            controlId: 'PBAnumber2'
          },
          classes: 'govuk-!-width-two-thirds'
        }
      },
      {
        button: {
          control: 'addAnotherPBANumber',
          value: 'Add another PBA number',
          type: 'button',
          classes: 'hmcts-button--secondary  hmcts-add-another__add-button',
          onEvent: 'addAnotherPBANumber'
        }
      },
      {
        button: {
          control: 'createButton',
          value: 'Continue',
          type: 'submit',
          classes: '',
          onEvent: 'continue'
        }
      }
    ];

    const predicate = (element: any) => element.hasOwnProperty('input');
    const result = AppUtils.findLastIndex(htmlComponentArray, predicate);
    expect(result).toEqual(1);
  });

  it('should return -1 if index of last element in the array where predicate is true', () => {
    const htmlComponentArray2 = [
      {
        control: 'PBAnumber1',
        validators: [
          'pbaNumberPattern',
          'pbaNumberMaxLength',
          'pbaNumberMinLength'
        ],
        validationError: {
          value: 'Enter a valid PBA number',
          controlId: 'PBAnumber1'
        },
        classes: 'govuk-!-width-two-thirds'
      },
      {
        button: {
          control: 'addAnotherPBANumber',
          value: 'Add another PBA number',
          type: 'button',
          classes: 'hmcts-button--secondary  hmcts-add-another__add-button',
          onEvent: 'addAnotherPBANumber'
        }
      },
      {
        button: {
          control: 'createButton',
          value: 'Continue',
          type: 'submit',
          classes: '',
          onEvent: 'continue'
        }
      }
    ];
    const predicate = (element: any) => element.hasOwnProperty('input');
    const result = AppUtils.findLastIndex(htmlComponentArray2, predicate);
    expect(result).toEqual(-1);
  });

  describe('setOtherAsLastOption', () => {
    let itmes: LovRefDataModel[];
    let other: LovRefDataModel;

    beforeEach(() => {
      itmes = [
        {
          active_flag: 'Y',
          category_key: 'Org',
          child_nodes: null,
          hint_text_cy: '',
          hint_text_en: '',
          key: 'DEFENCE',
          lov_order: null,
          parent_category: '',
          parent_key: '',
          value_cy: '',
          value_en: 'Defence'
        },
        {
          active_flag: 'Y',
          category_key: 'Org',
          child_nodes: null,
          hint_text_cy: '',
          hint_text_en: '',
          key: 'CHARITY',
          lov_order: null,
          parent_category: '',
          parent_key: '',
          value_cy: '',
          value_en: 'Charity'
        }
      ];

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
    });

    it('should set Other as last option if not available in the input list', () => {
      const itemsWithOther = AppUtils.setOtherAsLastOption(itmes);
      itmes.push(other);
      expect(itemsWithOther).toEqual(itmes);
      expect(itemsWithOther[itemsWithOther.length - 1]).toEqual(other);
    });

    it('should move other to the last position if it is available in the input list', () => {
      itmes.splice(1, 0, other);
      const itemsWithOther = AppUtils.setOtherAsLastOption(itmes);
      expect(itemsWithOther).toBe(itmes);
      expect(itemsWithOther[itemsWithOther.length - 1]).toEqual(other);
    });
  });
});
