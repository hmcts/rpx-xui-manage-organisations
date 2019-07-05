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
});
