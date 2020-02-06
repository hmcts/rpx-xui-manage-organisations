import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { FeeAccountsState } from '../reducers/fee-accounts.reducer';
import { getFeeAccountsState, feeAccounts } from './fee-accounts.selectors';
import { reducers } from '../index';
import { LoadFeeAccountsSuccess } from '../actions';

describe('Fee accounts selectors', () => {
  let store: Store<FeeAccountsState>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('feeAccounts', reducers),
      ],
    });
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getFeeAccountsState', () => {
    it('should return fee accounts state', () => {
      let result;
      store.pipe(select(getFeeAccountsState)).subscribe(value => {
        result = value;

      });
      expect(result).toEqual({ feeAccounts: null, loaded: false, loading: false, oneOrMoreAccountMissing: false, errorMessages: null });
    });
  });


  describe('getFeeAccountsArray', () => {
    it('should return fee accounts array', () => {
      let result;
      store.pipe(select(feeAccounts)).subscribe(value => {
        result = value;

      });
      expect(result).toEqual(null);
      store.dispatch(new LoadFeeAccountsSuccess([{ payload: 'something' }]));
      expect(result).toEqual([
        {
          payload: 'something',
          routerLink: '/fee-accounts/account/undefined/',
          isAccountInfoMissing: false
        }
      ]);
    });
  });

});
