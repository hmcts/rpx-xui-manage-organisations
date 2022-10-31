import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { FeeAccountsService } from '../../../fee-accounts/services';
import { LoggerService } from '../../../shared/services/logger.service';
import { LoadFeeAccountsSuccess } from '../actions';
import { LoadFeeAccounts, LoadFeeAccountsFail } from '../actions/fee-accounts.actions';
import * as fromFeeAccountsEffects from './fee-accounts.effects';
import { FeeAccountsEffects } from './fee-accounts.effects';

describe('Fee accounts Effects', () => {
  let actions$;
  let effects: FeeAccountsEffects;
  let loggerService: LoggerService;

  const FeeAccountsServiceMock = jasmine.createSpyObj('FeeAccountsService', [
    'fetchFeeAccounts',
  ]);
  const mockedLoggerService = jasmine.createSpyObj('mockedLoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
          {
            provide: FeeAccountsService,
            useValue: FeeAccountsServiceMock,
          },
          {
            provide: LoggerService,
            useValue: mockedLoggerService
          },
          fromFeeAccountsEffects.FeeAccountsEffects,
          provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(FeeAccountsEffects);
    loggerService = TestBed.get(LoggerService);

  });
  describe('loadFeeAccounts$', () => {
    it('should return a collection from loadFeeAccounts$ - LoadFeeAccountsSuccess', () => {
      const payload = [{payload: 'something'}];
      FeeAccountsServiceMock.fetchFeeAccounts.and.returnValue(of(payload));
      const action = new LoadFeeAccounts(['account1', 'account2']);
      const completion = new LoadFeeAccountsSuccess([{payload: 'something'}]);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadFeeAccounts$).toBeObservable(expected);
    });
  });

  describe('loadFeeAccounts$ error', () => {
    it('should return LoadFeeAccountsFail', () => {
      FeeAccountsServiceMock.fetchFeeAccounts.and.returnValue(throwError(new Error()));
      const action = new LoadFeeAccounts(['account1', 'account2']);
      const completion = new LoadFeeAccountsFail(new Error());
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadFeeAccounts$).toBeObservable(expected);
      expect(loggerService.error).toHaveBeenCalled();
    });
  });

});
