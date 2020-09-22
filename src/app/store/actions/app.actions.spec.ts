import * as fromAppActions from './app.actions';

describe('App actions', () => {
  describe('user roles', () => {
    describe('set user roles', () => {
      it('should create an action', () => {
        const payload = [
          'pui-case-manager',
          'pui-user-manager',
          'pui-finance-manager',
          'pui-organisation-manager'
        ];
        const action = new fromAppActions.SetUserRoles(payload);
        expect({ ...action }).toEqual({
          type: fromAppActions.SET_USER_ROLES,
          payload
        });
      });
    });

  });

  describe('LoadJurisdictionsSuccess', () => {
    it('should create an action', () => {
      const action = new fromAppActions.LoadJurisdictionsSuccess([{id: 'Juridiction1'}]);
      const payload = [{id: 'Juridiction1'}];
      expect({ ...action }).toEqual({
        type: fromAppActions.LOAD_JURISDICTIONS_GLOBAL_SUCCESS,
        payload
      });
    });
  });

  describe('LoadJurisdictions', () => {
    it('should create an action', () => {
      const action = new fromAppActions.LoadJurisdictions();
      expect({ ...action }).toEqual({
        type: fromAppActions.LOAD_JURISDICTIONS_GLOBAL
      });
    });
  });
});
