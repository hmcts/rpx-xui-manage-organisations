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

  describe('LoadFeatureToggleConfig', () => {
    it('should create an action', () => {
      const action = new fromAppActions.LoadFeatureToggleConfig([{featureName: 'feature1', isEnabled: true}]);
      const payload = [{featureName: 'feature1', isEnabled: true}];
      expect({ ...action }).toEqual({
        type: fromAppActions.LOAD_FEATURE_TOGGLE_CONFIG,
        payload
      });
    });
  });

  describe('LoadFeatureToggleConfigSuccess', () => {
    it('should create an action', () => {
      const action = new fromAppActions.LoadFeatureToggleConfigSuccess([{featureName: 'feature1', isEnabled: true}]);
      const payload = [{featureName: 'feature1', isEnabled: true}];
      expect({ ...action }).toEqual({
        type: fromAppActions.LOAD_FEATURE_TOGGLE_CONFIG_SUCCESS,
        payload
      });
    });
  });

  describe('LoadFeatureToggleConfigFail', () => {
    it('should create an action', () => {
      const action = new fromAppActions.LoadFeatureToggleConfigFail({errorMessage: 'some error'});
      const payload = {errorMessage: 'some error'};
      expect({ ...action }).toEqual({
        type: fromAppActions.LOAD_FEATURE_TOGGLE_CONFIG_FAIL,
        payload
      });
    });
  });

  describe('StartAppInitilizer', () => {
    it('should create an action', () => {
      const action = new fromAppActions.StartAppInitilizer();
      expect({ ...action }).toEqual({
        type: fromAppActions.START_APP_INITIALIZER
      });
    });
  });

  describe('FinishAppInitilizer', () => {
    it('should create an action', () => {
      const action = new fromAppActions.FinishAppInitilizer();
      expect({ ...action }).toEqual({
        type: fromAppActions.FINISH_APP_INITIALIZER
      });
    });
  });
});
