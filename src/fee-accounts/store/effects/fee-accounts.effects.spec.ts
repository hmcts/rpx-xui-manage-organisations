import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { FeeAccountsService } from '../../../fee-accounts/services';
import { LoggerService } from '../../../shared/services/logger.service';
import { LoadFeeAccountsSuccess } from '../actions';
import { LoadFeeAccounts, LoadFeeAccountsFail } from '../actions/fee-accounts.actions';
import { FeeAccountsEffects } from './fee-accounts.effects';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Fee accounts Effects', () => {
  let actions$;
  let effects: FeeAccountsEffects;
  let loggerService: LoggerService;

  const feeAccountsServiceMock = jasmine.createSpyObj('FeeAccountsService', [
    'fetchFeeAccounts'
  ]);

  const mockedLoggerService = jasmine.createSpyObj('mockedLoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: FeeAccountsService,
          useValue: feeAccountsServiceMock
        },
        {
          provide: LoggerService,
          useValue: mockedLoggerService
        },
        FeeAccountsEffects,
        provideMockActions(() => actions$),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });

    effects = TestBed.inject(FeeAccountsEffects);
    loggerService = TestBed.inject(LoggerService);

    initTestScheduler();
    addMatchers();
  }));

  describe('loadFeeAccounts$', () => {
    it('should return a collection from loadFeeAccounts$ - LoadFeeAccountsSuccess', () => {
      const payload = [{ payload: 'something' }];
      feeAccountsServiceMock.fetchFeeAccounts.and.returnValue(of(payload));
      const action = new LoadFeeAccounts(['account1', 'account2']);
      const completion = new LoadFeeAccountsSuccess([{ payload: 'something' }]);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadFeeAccounts$).toBeObservable(expected);
    });
  });

  describe('loadFeeAccounts$ error', () => {
    it('should return LoadFeeAccountsFail', () => {
      feeAccountsServiceMock.fetchFeeAccounts.and.returnValue(throwError(new Error()));
      const action = new LoadFeeAccounts(['account1', 'account2']);
      const completion = new LoadFeeAccountsFail(new Error());
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadFeeAccounts$).toBeObservable(expected);
      expect(loggerService.error).toHaveBeenCalled();
    });
  });
});
