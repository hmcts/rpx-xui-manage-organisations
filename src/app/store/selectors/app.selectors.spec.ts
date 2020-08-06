import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import * as fromRoot from '../../../app/store/';
import * as fromReducers from '../reducers';
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
});
