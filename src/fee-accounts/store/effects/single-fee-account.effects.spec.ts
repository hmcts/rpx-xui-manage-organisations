import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { FeeAccountsService } from '../../../fee-accounts/services';
import { LoggerService } from '../../../shared/services/logger.service';
import {
  LoadSingleFeeAccount, LoadSingleFeeAccountFail, LoadSingleFeeAccountSuccess,
  LoadSingleFeeAccountTransactions, LoadSingleFeeAccountTransactionsFail, LoadSingleFeeAccountTransactionsSuccess
} from '../actions';
import * as fromSingleFeeAccountEffects from './single-fee-account.effects';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Single fee account Effects', () => {
  let actions$;
  let effects: fromSingleFeeAccountEffects.SingleFeeAccountEffects;
  let loggerService: LoggerService;

  const singleFeeAccountServiceMock = jasmine.createSpyObj('FeeAccountsService', [
    'fetchSingleFeeAccount',
    'fetchPbAAccountTransactions'
  ]);
  const mockedLoggerService = jasmine.createSpyObj('mockedLoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        {
            provide: FeeAccountsService,
            useValue: singleFeeAccountServiceMock
        },
        {
            provide: LoggerService,
            useValue: mockedLoggerService
        },
        fromSingleFeeAccountEffects.SingleFeeAccountEffects,
        provideMockActions(() => actions$),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});

    effects = TestBed.inject(fromSingleFeeAccountEffects.SingleFeeAccountEffects);
    loggerService = TestBed.inject(LoggerService);

    initTestScheduler();
    addMatchers();
  }));

  describe('loadSingleFeeAccount$', () => {
    it('should return a collection from loadSingleFeeAccount$ - LoadSingleFeeAccountSuccess', waitForAsync(() => {
      // const payload = [{payload: 'something'}];
      const payload = {
        account_number: 'someNumber',
        account_name: 'someName',
        credit_limit: 0,
        available_balance: 0,
        status: 'someStatus',
        effective_date: 'someDate'
      };
      singleFeeAccountServiceMock.fetchSingleFeeAccount.and.returnValue(of(payload));
      const action = new LoadSingleFeeAccount({});
      const completion = new LoadSingleFeeAccountSuccess(payload);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadSingleFeeAccount$).toBeObservable(expected);
    }));
  });

  describe('loadSingleFeeAccount$ error', () => {
    it('should return LoadSingleFeeAccountFail', waitForAsync(() => {
      singleFeeAccountServiceMock.fetchSingleFeeAccount.and.returnValue(throwError(new Error()));
      const action = new LoadSingleFeeAccount({});
      const completion = new LoadSingleFeeAccountFail(new Error());
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadSingleFeeAccount$).toBeObservable(expected);
      expect(loggerService.error).toHaveBeenCalled();
    }));
  });

  describe('loadSingleFeeAccountTransactions$', () => {
    it('should return a collection from loadSingleFeeAccountTransactions$ - loadSingleFeeAccountTransactionsSuccess', waitForAsync(() => {
      // const payload = [{payload: 'something'}];
      const payload = [];
      singleFeeAccountServiceMock.fetchPbAAccountTransactions.and.returnValue(of(payload));
      const action = new LoadSingleFeeAccountTransactions({});
      const completion = new LoadSingleFeeAccountTransactionsSuccess([]);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadSingleFeeAccountTransactions$).toBeObservable(expected);
    }));
  });

  describe('loadSingleFeeAccountTransactions$ error', () => {
    it('should return loadSingleFeeAccountTransactionsFail', waitForAsync(() => {
      singleFeeAccountServiceMock.fetchPbAAccountTransactions.and.returnValue(throwError(new Error()));
      const action = new LoadSingleFeeAccountTransactions({});
      const completion = new LoadSingleFeeAccountTransactionsFail(new Error());
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadSingleFeeAccountTransactions$).toBeObservable(expected);
      expect(loggerService.error).toHaveBeenCalled();
    }));
  });
});
