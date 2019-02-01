import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as fromSingleFeeAccountEffects from './single-fee-account.effects';
import { SingleFeeAccountEffects } from './single-fee-account.effects';
import { LoadSingleFeeAccount, LoadSingleFeeAccountFail } from '../actions/single-fee-account.actions';
import { LoadSingleFeeAccountSuccess } from '../actions';
import { FeeAccountsService } from 'src/fee-accounts/services';

describe('Single fee account Effects', () => {
  let actions$;
  let effects: SingleFeeAccountEffects;
  const SingleFeeAccountServiceMock = jasmine.createSpyObj('FeeAccountsService', [
    'fetchSingleFeeAccount',
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
          {
            provide: FeeAccountsService,
            useValue: SingleFeeAccountServiceMock,
          },
          fromSingleFeeAccountEffects.SingleFeeAccountEffects,
          provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(SingleFeeAccountEffects);

  });
  describe('loadSingleFeeAccount$', () => {
    it('should return a collection from loadSingleFeeAccount$ - LoadSingleFeeAccountSuccess', () => {
      const payload = [{payload: 'something'}];
      SingleFeeAccountServiceMock.fetchSingleFeeAccount.and.returnValue(of(payload));
      const action = new LoadSingleFeeAccount({});
      const completion = new LoadSingleFeeAccountSuccess([{payload: 'something'}]);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadSingleFeeAccount$).toBeObservable(expected);
    });
  });

  describe('loadSingleFeeAccount$ error', () => {
    it('should return LoadSingleFeeAccountFail', () => {
      SingleFeeAccountServiceMock.fetchSingleFeeAccount.and.returnValue(throwError(new Error()));
      const action = new LoadSingleFeeAccount({});
      const completion = new LoadSingleFeeAccountFail(new Error);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadSingleFeeAccount$).toBeObservable(expected);
    });
  });

});
