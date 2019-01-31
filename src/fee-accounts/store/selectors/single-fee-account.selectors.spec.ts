import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { SingleFeeAccountState } from '../reducers/single-fee-account.reducer';
import { getSingleFeeAccountState, getSingleFeeAccountArray } from './single-fee-account.selectors';
import { reducers } from '../index';
import { LoadSingleFeeAccountSuccess } from '../actions';

describe('Single fee account selectors', () => {
  let store: Store<SingleFeeAccountState>;
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

  describe('getSingleFeeAccountState', () => {
    it('should return single fee account state', () => {
      let result;
      store.pipe(select(getSingleFeeAccountState)).subscribe(value => {
        result = value;

      });
      expect(result).toEqual({ singleFeeAccount: [], loaded: false, loading: false });
    });
  });


  describe('getSingleFeeAccountArray', () => {
    it('should return single fee account array', () => {
      let result;
      store.pipe(select(getSingleFeeAccountArray)).subscribe(value => {
        result = value;

      });
      expect(result).toEqual([]);
      store.dispatch(new LoadSingleFeeAccountSuccess([{ payload: 'something' }]));
      expect(result).toEqual([
        { payload: 'something' }
      ]);
    });
  });

});
