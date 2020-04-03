import { BadgeColour, ContactDetailsDataModel } from '@hmcts/rpx-xui-common-lib';
import {AppTitlesModel} from './models/app-titles.model';
import {NavItemModel} from './models/nav-items.model';
import {UserNavModel} from './models/user-nav.model';

const navItemsArray: NavItemModel[] = [
  {
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
  // Hiding the Tab for the Fee And Accounts
  // {
  //   text: 'Fee Accounts',
  //   href: '/fee-accounts',
  //   active: false,
  //   orderId: 3
  // }
];

const roleBasedNav = {
  'pui-organisation-manager': navItemsArray[0],
  'pui-user-manager': navItemsArray[1],
  // Hiding the role
  // 'pui-finance-manager': navItemsArray[2],
};

const userNav: UserNavModel = {
  label: 'Account navigation',
  items: [{
    text: 'Sign out',
    emit: 'sign-out'
  }]
};

const regOrgTitle: AppTitlesModel = {
  name: 'Register to manage civil, family, and tribunal law cases',
  url: '/register-org/register/'
};

const manageOrgTitle: AppTitlesModel = {
  name: 'Manage organisation details for civil, family, and tribunal law cases',
  url: '/'
};

const footerData =  {
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

const footerDataNavigation = {
  items: [
    { text: 'Accessibility', href: 'accessibility', target: '_blank'},
    { text: 'Terms and conditions', href: 'legacy-terms-and-conditions', target: '_blank'},
    { text: 'Cookies', href: 'cookies', target: '_blank' },
    { text: 'Privacy policy', href: 'privacy-policy', target: '_blank'},
    { text: 'Get Help', href: 'get-help', target: '_blank' }
  ]
};


const getHelpDetailsData: ContactDetailsDataModel[] = [
  {
    title: 'Probate',
    badgeColour: BadgeColour.BADGE_BLUE,
    email: 'contactprobate@justice.gov.uk',
    phone: '0300 303 0648',
    openingTimes: 'Monday to Friday, 9:30am to 5pm (excluding public holidays)'
  },
  {
    title: 'Divorce',
    badgeColour: BadgeColour.BADGE_BLUE,
    email: 'divorcecase@justice.gov.uk',
    phone: '0300 303 0642',
    openingTimes: 'Monday to Friday, 9:30am to 5pm (excluding public holidays)'
  },
  {
    title: 'Financial Remedy',
    badgeColour: BadgeColour.BADGE_RED,
    email: 'contactfinancialremedy@justice.gov.uk',
    phone: '0300 303 0642',
    openingTimes: 'Monday to Friday, 9:30am to 5pm (excluding public holidays)'
  },
  {
    title: 'Immigration and Asylum',
    badgeColour: BadgeColour.BADGE_RED,
    email: 'customer.service@justice.gov.uk',
    phone: '0300 123 1711',
    openingTimes: 'Monday to Friday, 9am to 5pm (excluding public holidays)'
  },
  {
    title: 'Family Public Law and Adoption',
    badgeColour: BadgeColour.BADGE_RED,
    email: 'fpla@justice.gov.uk',
    phone: '0330 808 4424',
    openingTimes: 'Monday to Friday, 8:30am to 5pm (excluding public holidays)'
  }
];

const userRoles = [

    { role: 'pui-organisation-manager', roleType: 'manageOrganisations'},
    { role: 'pui-user-manager', roleType: 'manageUsers' },
    { role: 'pui-case-manager', roleType: 'manageCases'},
    { role: 'pui-finance-manager', roleType: 'managePayments'}
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
  'caseworker-ia',
  'caseworker-probate-solicitor',
  'caseworker-publiclaw',
  'caseworker-ia-legalrep-solicitor',
  'caseworker-publiclaw-solicitor'
];

const redirectUrl = {
  aat: 'https://idam-web-public.aat.platform.hmcts.net',
  demo: 'https://idam-web-public.demo.platform.hmcts.net',
  ithc: 'https://idam-web-public.ithc.platform.hmcts.net',
  prod: 'https://hmcts-access.service.gov.uk'
};

const environmentNames = {
  aat: 'aat',
  localhost: 'localhost',
  pr: 'pr-',
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
  public static ROLES_BASED_NAV = roleBasedNav;
  public static NAV_ITEMS_ARRAY = navItemsArray;
  public static USER_NAV = userNav;
  public static REG_ORG_TITLE = regOrgTitle;
  public static MANAGE_ORG_TITLE = manageOrgTitle;
  public static FOOTER_DATA = footerData;
  public static FOOTER_DATA_NAVIGATION = footerDataNavigation;
  public static USER_ROLES = userRoles;
  public static JURISDICTIONS = jurisdictions;
  public static CCD_ROLES = ccdRoles;
  public static REDIRECT_URL = redirectUrl;
  public static ENVIRONMENT_NAMES = environmentNames;
  public static GET_HELP_DETAILS_DATA = getHelpDetailsData;
}
