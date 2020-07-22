import { TestBed } from '@angular/core/testing';
import {combineReducers, select, Store, StoreModule} from '@ngrx/store';
import { AppConstants } from 'src/app/app.constants';
import * as fromRoot from '../../../app/store/';
import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import { AppFeatureFlag } from '../reducers/app.reducer';
import * as fromSelectors from '../selectors/app.selectors';

describe('App Selectors', () => {
  let store: Store<fromReducers.State>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          products: combineReducers(fromReducers.reducers),
        }),
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getPageTitle', () => {
    it('should return page title', () => {
      let result;

      store.pipe(select(fromSelectors.getPageTitle))
        .subscribe(value => (result = value));

      expect(result).toEqual('');

      store.dispatch(new fromActions.SetPageTitle('/organisation'));

      expect(result).toEqual('Organisation details - Manage organisation');
    });
  });

  describe('getHeaderTitles', () => {
    it('should return heading titles', () => {
      let result;

      store.pipe(select(fromSelectors.getHeaderTitle))
        .subscribe(value => (result = value));

      store.dispatch(new fromRoot.Go({path: ['/organisation']}));
      expect(result).toEqual(undefined);

    });
  });

  describe('getNavItems', () => {
    it('should return navigation items', () => {
      let result;

      store.pipe(select(fromSelectors.getNavItems))
        .subscribe(value => (result = value));

      expect(result).toEqual({navItems: []});
    });
  });

  describe('getUserItems', () => {
    it('should return user navigation items', () => {
      let result;

      store.pipe(select(fromSelectors.getUserNav))
        .subscribe(value => (result = value));

      expect(result).toEqual([]);

    });
  });

  describe('getFeatureFlag', () => {
    it('getFeeAndPayFeature', () => {
      const features = [
        {isEnabled: false, featureName: AppConstants.FEATURE_NAMES.feeAccount},
        {isEnabled: true, featureName: AppConstants.FEATURE_NAMES.editUserPermissions}
      ];
      const action = new fromActions.LoadFeatureToggleConfigSuccess(features);
      store.dispatch(action);
      let featureFlag: AppFeatureFlag;
      let featureEnabled: boolean;
      store.pipe(select(fromSelectors.getFeeAndPayFeature)).subscribe(value => (featureFlag = value));
      store.pipe(select(fromSelectors.getFeeAndPayFeatureIsEnabled)).subscribe(value => (featureEnabled = value));
      expect(featureFlag).toEqual({ featureName: AppConstants.FEATURE_NAMES.feeAccount, isEnabled: false});
      expect(featureEnabled).toBeFalsy();

      store.pipe(select(fromSelectors.getEditUserFeature)).subscribe(value => (featureFlag = value));
      store.pipe(select(fromSelectors.getEditUserFeatureIsEnabled)).subscribe(value => (featureEnabled = value));
      expect(featureFlag).toEqual({ featureName: AppConstants.FEATURE_NAMES.editUserPermissions, isEnabled: true});
      expect(featureEnabled).toBeTruthy();
    });
  });
});
