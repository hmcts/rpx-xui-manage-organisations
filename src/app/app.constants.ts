import {NavItemModel} from './models/nav-items.model';
import {UserNavModel} from './models/user-nav.model';
import {AppTitlesModel} from './models/app-titles.model';

const navItemsArray: NavItemModel[] = [
  {
    text: 'Organisation',
    href: '/organisation',
    active: false
  },
  {
    text: 'Users',
    href: '/users',
    active: false
  }
];

const roleBasedNav = {
  'pui-user-manager': navItemsArray[1],
  'pui-organisation-manager': navItemsArray[0]
};

const userNav: UserNavModel = {
  label: 'Account navigation',
  items: [{
    text: 'Sign out',
    emit: 'sign-out'
  }]
};

const regOrgTitle: AppTitlesModel = {
  name: 'Register to manage civil and family law cases',
  url: '/register-org/register/'
};

const manageOrgTitle: AppTitlesModel = {
  name: 'Manage organisation details for civil and family law cases',
  url: '/'
};

const FooterData =  {
  heading: 'Help',
  email: {
    address: 'service-desk@hmcts.gov.uk',
    text: 'service-desk@hmcts.gov.uk'
  },
  phone: {
    text: '0207 633 4140'
  },
  opening: {
    text: 'Monday to Friday, 8am to 6pm (excluding public holidays)'
  }
};

const FooterDataNavigation = {
  items: [
    { text: 'Terms and conditions', href: 'terms-and-conditions', target: '_blank'},
    { text: 'Cookies', href: 'cookies', target: '_blank' },
    { text: 'Privacy policy', href: 'privacy-policy', target: '_blank'}
  ]
};

const userRoles = [

    { role: 'pui-organisation-manager', roleType: 'manageOrganisations'},
    { role: 'pui-user-manager', roleType: 'manageUsers' },
    { role: 'pui-case-manager', roleType: 'manageCases'}
];

const jurisdictions = [
    {id: 'SSCS'},
    {id: 'AUTOTEST1'},
    {id: 'DIVORCE'},
    {id: 'PROBATE'},
    {id: 'PUBLICLAW'},
    {id: 'bulkscan'},
    {id: 'BULKSCAN'},
    {id: 'IA'},
    {id: 'EMPLOYMENT'},
    {id: 'CMC'}
  ];

const ccdRoles = [
  'caseworker',
  'caseworker-divorce',
  'caseworker-divorce-solicitor',
  'caseworker-divorce-financialremedy',
  'caseworker-divorce-financialremedy-solicitor',
  'caseworker-probate',
  'caseworker-probate-solicitor'
];

const redirectUrl = {
  aat: 'https://idam-web-public.aat.platform.hmcts.net',
  demo: 'https://idam-web-public.demo.platform.hmcts.net',
  ithc: 'https://idam-web-public.ithc.platform.hmcts.net',
  prod: 'https://hmcts-access.service.gov.uk',
  pr: 'https://idam-web-public.aat.platform.hmcts.net'
};

const environmentNames = {
  aat: 'aat',
  localhost: 'localhost',
  pr: 'pr',
  demo: 'demo',
  ithc: 'ithc',
  perfTest: 'perf-test',
  prod: 'prod'
};

/**
 * Place to keep app constants.
 * Nice to have: The constants should also be injected into state to have single source of truth.
 */

export class AppConstants {
  static ROLES_BASED_NAV = roleBasedNav;
  static NAV_ITEMS_ARRAY = navItemsArray;
  static USER_NAV = userNav;
  static REG_ORG_TITLE = regOrgTitle;
  static MANAGE_ORG_TITLE = manageOrgTitle;
  static FOOTER_DATA = FooterData;
  static FOOTER_DATA_NAVIGATION = FooterDataNavigation;
  static USER_ROLES = userRoles;
  static JURISDICTIONS = jurisdictions;
  static CCD_ROLES = ccdRoles;
  static REDIRECT_URL = redirectUrl;
  static ENVIRONMENT_NAMES = environmentNames;
}
