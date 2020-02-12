import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as fromSingleFeeAccountEffects from './single-fee-account.effects';
import { SingleFeeAccountEffects } from './single-fee-account.effects';
import {
  LoadSingleFeeAccount, LoadSingleFeeAccountFail, LoadSingleFeeAccountSuccess,
  LoadSingleFeeAccountTransactions, LoadSingleFeeAccountTransactionsFail, LoadSingleFeeAccountTransactionsSuccess
} from '../actions';
import { FeeAccountsService } from '../../../fee-accounts/services';
import { LoggerService } from '../../../shared/services/logger.service';

describe('Single fee account Effects', () => {
  let actions$;
  let effects: SingleFeeAccountEffects;
  let loggerService: LoggerService;

  const SingleFeeAccountServiceMock = jasmine.createSpyObj('FeeAccountsService', [
    'fetchSingleFeeAccount',
    'fetchPbAAccountTransactions'
  ]);
  const mockedLoggerService = jasmine.createSpyObj('mockedLoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
          {
            provide: FeeAccountsService,
            useValue: SingleFeeAccountServiceMock,
          },
          {
            provide: LoggerService,
            useValue: mockedLoggerService
          },
          fromSingleFeeAccountEffects.SingleFeeAccountEffects,
          provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(SingleFeeAccountEffects);
    loggerService = TestBed.get(LoggerService);

  });
  describe('loadSingleFeeAccount$', () => {
    it('should return a collection from loadSingleFeeAccount$ - LoadSingleFeeAccountSuccess', () => {
      // const payload = [{payload: 'something'}];
      const payload = {
        account_number: 'someNumber',
        account_name: 'someName',
        credit_limit: 0,
        available_balance: 0,
        status: 'someStatus',
        effective_date: 'someDate'
      };
      SingleFeeAccountServiceMock.fetchSingleFeeAccount.and.returnValue(of(payload));
      const action = new LoadSingleFeeAccount({});
      const completion = new LoadSingleFeeAccountSuccess(payload);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadSingleFeeAccount$).toBeObservable(expected);
    });
  });

  describe('loadSingleFeeAccount$ error', () => {
    it('should return LoadSingleFeeAccountFail', () => {
      SingleFeeAccountServiceMock.fetchSingleFeeAccount.and.returnValue(throwError(new Error()));
      const action = new LoadSingleFeeAccount({});
      const completion = new LoadSingleFeeAccountFail(new Error());
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadSingleFeeAccount$).toBeObservable(expected);
      expect(loggerService.error).toHaveBeenCalled();
    });
  });

  describe('loadSingleFeeAccountTransactions$', () => {
    it('should return a collection from loadSingleFeeAccountTransactions$ - loadSingleFeeAccountTransactionsSuccess', () => {
      // const payload = [{payload: 'something'}];
      const payload = [];
      SingleFeeAccountServiceMock.fetchPbAAccountTransactions.and.returnValue(of(payload));
      const action = new LoadSingleFeeAccountTransactions({});
      const completion = new LoadSingleFeeAccountTransactionsSuccess([]);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadSingleFeeAccountTransactions$).toBeObservable(expected);
    });
  });

  describe('loadSingleFeeAccountTransactions$ error', () => {
    it('should return loadSingleFeeAccountTransactionsFail', () => {
      SingleFeeAccountServiceMock.fetchPbAAccountTransactions.and.returnValue(throwError(new Error()));
      const action = new LoadSingleFeeAccountTransactions({});
      const completion = new LoadSingleFeeAccountTransactionsFail(new Error());
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadSingleFeeAccountTransactions$).toBeObservable(expected);
      expect(loggerService.error).toHaveBeenCalled();
    });
  });

});
