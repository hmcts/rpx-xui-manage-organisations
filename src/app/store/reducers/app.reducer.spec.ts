import { AppConstants } from '../../../app/app.constants';
import * as fromAppActions from '../actions/app.actions';
import * as fromApp from './app.reducer';

describe('AppReducer', () => {
  it('undefined action should return the default state', () => {
    const { initialState } = fromApp;
    const action = {} as any;
    const state = fromApp.reducer(undefined, action);

    expect(state).toBe(initialState);
  });

  it('setTitle action should return correct state', () => {
    const { initialState } = fromApp;
    let action;
    let state;

    action = new fromAppActions.SetPageTitle('invite-user');
    state = fromApp.reducer(initialState, action);

    expect(state.pageTitle).toEqual('Manage organisation - Invite user - GOV.UK');

    action = new fromAppActions.SetPageTitle('organisation');
    state = fromApp.reducer(initialState, action);

    expect(state.pageTitle).toEqual('Manage organisation - Organisation details - GOV.UK');

    action = new fromAppActions.SetPageTitle('profile');
    state = fromApp.reducer(initialState, action);

    expect(state.pageTitle).toEqual('Manage organisation - Profile - GOV.UK');

    action = new fromAppActions.SetPageTitle('users');
    state = fromApp.reducer(initialState, action);

    expect(state.pageTitle).toEqual('Manage organisation - Users - GOV.UK');

    action = new fromAppActions.SetPageTitle('dummy');
    state = fromApp.reducer(initialState, action);

    expect(state.pageTitle).toEqual('Manage organisation - GOV.UK');
  });

  it('setTitleError action should return correct state', () => {
    const { initialState } = fromApp;

    const action = new fromAppActions.SetPageTitleErrors();
    const state = fromApp.reducer(initialState, action);

    expect(state.pageTitle).toEqual('Error: ');
  });

  it('should set correct user roles', () => {
    const { initialState } = fromApp;
    const payload = [
      'pui-case-manager',
      'pui-user-manager',
      'pui-finance-manager',
      'pui-organisation-manager',
      'pui-caa'
    ];
    const navItems = [
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
      {
        href: '/fee-accounts',
        text: 'Fee Accounts',
        active: false,
        orderId: 3,
        featureToggle: {
          featureName: AppConstants.FEATURE_NAMES.feeAccount
        }
      },
      {
        href: '/unassigned-cases',
        text: 'Unassigned cases',
        active: false,
        orderId: 4,
        featureToggle: {
          featureName: AppConstants.FEATURE_NAMES.caaMenuItems
        }
      },
      {
        href: '/assigned-cases',
        text: 'Assigned cases',
        active: false,
        orderId: 5,
        featureToggle: {
          featureName: AppConstants.FEATURE_NAMES.caaMenuItems
        }
      }
    ];
    const action = new fromAppActions.SetUserRoles(payload);
    const state = fromApp.reducer(initialState, action);
    expect(state.navItems).toEqual(navItems);
  });

  it('Jurisdictions action should return correct state', () => {
    const { initialState } = fromApp;

    const action = new fromAppActions.LoadJurisdictionsSuccess([{ id: 'Jurisdiction1' }]);
    const state = fromApp.reducer(initialState, action);

    expect(state.jurisdictions).toEqual([{ id: 'Jurisdiction1' }]);
  });
});
