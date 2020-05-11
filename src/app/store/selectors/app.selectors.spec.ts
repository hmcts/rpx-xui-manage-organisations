import { TestBed } from '@angular/core/testing';
import {StoreModule, Store, combineReducers, select} from '@ngrx/store';

import * as fromRoot from '../../../app/store/';
import * as fromReducers from '../reducers';
import * as fromActions from '../actions';
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

    it('should return user navigation items', () => {
      let result;

      store.pipe(select(fromSelectors.getUserNav))
        .subscribe(value => (result = value));

      expect(result).toEqual([]);

    });
  });
});
