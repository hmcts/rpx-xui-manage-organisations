import { AppConstants } from 'src/app/app.constants';
import * as fromAppActions from '../actions/app.actions';
import * as fromApp from './app.reducer';


describe('AppReducer', () => {
    it('undefined action should return the default state', () => {
      const { initialState } = fromApp;
      const action = {} as any;
      const state = fromApp.reducer(undefined, action);

      expect(state).toBe(initialState);
    });

    it('should set correct user roles', () => {
      const { initialState } = fromApp;
      const payload = [
        'pui-case-manager',
        'pui-user-manager',
        'pui-finance-manager',
        'pui-organisation-manager'
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
        }
      ];
      const action = new fromAppActions.SetUserRoles(payload);
      const state = fromApp.reducer(initialState, action);
      expect(state.navItems).toEqual(navItems);
    });

    it('Jurisdictions action should return correct state', () => {
      const { initialState } = fromApp;

      const action = new fromAppActions.LoadJurisdictionsSuccess([{id: 'Jurisdiction1'}]);
      const state = fromApp.reducer(initialState, action);

      expect(state.jurisdictions).toEqual([{id: 'Jurisdiction1'}]);
    });
});
