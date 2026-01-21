import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import * as fromRoot from '../../../app/store/';
import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import { AppFeatureFlag } from '../reducers/app.reducer';
import * as fromSelectors from '../selectors/app.selectors';
import { take } from 'rxjs';

describe('App Selectors', () => {
  let store: Store<fromReducers.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          products: combineReducers(fromReducers.reducers)
        })
      ]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getPageTitle', () => {
    it('should return page title', () => {
      let result;

      store.pipe(select(fromSelectors.getPageTitle))
        .subscribe((value) => (result = value));

      expect(result).toEqual('');

      store.dispatch(new fromActions.SetPageTitle('/organisation'));

      expect(result).toEqual('Manage organisation - Organisation details - GOV.UK');
    });
  });

  describe('getHeaderTitles', () => {
    it('should return heading titles', () => {
      let result;

      store.pipe(select(fromSelectors.getHeaderTitle))
        .subscribe((value) => (result = value));

      store.dispatch(new fromRoot.Go({ path: ['/organisation'] }));
      expect(result).toEqual(undefined);
    });
  });

  describe('getNavItems', () => {
    it('should return navigation items', () => {
      let result;

      store.pipe(select(fromSelectors.getNavItems))
        .subscribe((value) => (result = value));

      expect(result).toEqual({ navItems: [] });
    });
  });

  describe('getUserItems', () => {
    it('should return user navigation items', () => {
      let result;

      store.pipe(select(fromSelectors.getUserNav))
        .subscribe((value) => (result = value));

      expect(result).toEqual([]);
    });
  });

  describe('getFeeAndPayFeature', () => {
    it('should get fee and pay feature', (done) => {
      const featureFlags: AppFeatureFlag[] = [
        { featureName: 'fee-and-accounts', isEnabled: true },
        { featureName: 'some-other-flag', isEnabled: false }
      ];

      store.dispatch(new fromActions.LoadFeatureToggleConfigSuccess(featureFlags));

      store.pipe(
        select(fromSelectors.getFeeAndPayFeature),
        take(1)
      ).subscribe((value) => {
        expect(value).toEqual({ featureName: 'fee-and-accounts', isEnabled: true });
        done();
      });
    });

    it('should get fee and pay is enabled to be true', (done) => {
      const featureFlags: AppFeatureFlag[] = [
        { featureName: 'fee-and-accounts', isEnabled: true }
      ];

      store.dispatch(new fromActions.LoadFeatureToggleConfigSuccess(featureFlags));

      store.pipe(
        select(fromSelectors.getFeeAndPayFeatureIsEnabled),
        take(1)
      ).subscribe((value) => {
        expect(value).toBe(true);
        done();
      });
    });

    it('should get CAA assigned/unassigned cases feature', (done) => {
      const featureFlags: AppFeatureFlag[] = [
        { featureName: 'mo-caa-menu-items', isEnabled: true },
        { featureName: 'some-other-flag', isEnabled: false }
      ];

      store.dispatch(new fromActions.LoadFeatureToggleConfigSuccess(featureFlags));

      store.pipe(
        select(fromSelectors.getCaaMenuItemsFeature),
        take(1)
      ).subscribe((value) => {
        expect(value).toEqual({ featureName: 'mo-caa-menu-items', isEnabled: true });
        done();
      });
    });

    it('should get CAA assigned/unassigned cases feature is enabled', (done) => {
      const featureFlags: AppFeatureFlag[] = [
        { featureName: 'mo-caa-menu-items', isEnabled: true }
      ];

      store.dispatch(new fromActions.LoadFeatureToggleConfigSuccess(featureFlags));

      store.pipe(
        select(fromSelectors.getCaaMenuItemsFeatureIsEnabled),
        take(1)
      ).subscribe((value) => {
        expect(value).toBe(true); // if your selector returns boolean
        done();
      });
    });

    it('should get edit user feature', () => {
      const featureFlags: AppFeatureFlag[] = [
        { featureName: 'edit-permissions', isEnabled: true },
        { featureName: 'edit-permissions', isEnabled: false }
      ];
      let result;
      store.dispatch(new fromActions.LoadFeatureToggleConfigSuccess(featureFlags));
      store.pipe(select(fromSelectors.getEditUserFeature)).subscribe((value) => (result = value));
      expect(result.featureName).toBe('edit-permissions');
    });

    it('should get edit user feature is enabled', () => {
      const featureFlag: AppFeatureFlag = { featureName: 'edit-permissions', isEnabled: true };
      let result;
      store.dispatch(new fromActions.LoadFeatureToggleConfig(featureFlag));
      store.pipe(select(fromSelectors.getEditUserFeatureIsEnabled)).subscribe((value) => (result = value));
      expect(result).toBeUndefined();
    });
  });
});
