import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as fromFeeAccountsEffects from './fee-accounts.effects';
import { FeeAccountsEffects } from './fee-accounts.effects';
import { LoadFeeAccounts, LoadFeeAccountsFail } from '../actions/fee-accounts.actions';
import { LoadFeeAccountsSuccess } from '../actions';
import { FeeAccountsService } from 'src/fee-accounts/services';

describe('Fee accounts Effects', () => {
  let actions$;
  let effects: FeeAccountsEffects;
  const FeeAccountsServiceMock = jasmine.createSpyObj('FeeAccountsService', [
    'fetchFeeAccounts',
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
          {
            provide: FeeAccountsService,
            useValue: FeeAccountsServiceMock,
          },
          fromFeeAccountsEffects.FeeAccountsEffects,
          provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(FeeAccountsEffects);

  });
  describe('loadFeeAccounts$', () => {
    it('should return a collection from loadFeeAccounts$ - LoadFeeAccountsSuccess', () => {
      const payload = [{payload: 'something'}];
      FeeAccountsServiceMock.fetchFeeAccounts.and.returnValue(of(payload));
      const action = new LoadFeeAccounts();
      const completion = new LoadFeeAccountsSuccess([{payload: 'something'}]);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadFeeAccounts$).toBeObservable(expected);
    });
  });

  describe('loadFeeAccounts$ error', () => {
    it('should return LoadFeeAccountsFail', () => {
      FeeAccountsServiceMock.fetchFeeAccounts.and.returnValue(throwError(new Error()));
      const action = new LoadFeeAccounts();
      const completion = new LoadFeeAccountsFail(new Error);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadFeeAccounts$).toBeObservable(expected);
    });
  });

});
