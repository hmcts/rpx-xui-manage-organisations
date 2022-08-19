import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { OrganisationEffects } from '.';
import { OrganisationService } from '../../../organisation/services';
import { LoggerService } from '../../../shared/services/logger.service';
import { LoadOrganisation, LoadOrganisationFail, LoadOrganisationSuccess } from '../actions';
import * as fromOrganisationEffects from './organisation.effects';

describe('Organisation Effects', () => {
  let actions$;
  let effects: OrganisationEffects;
  let loggerService: LoggerService;

  const organisationServiceMock = jasmine.createSpyObj('OrganisationService', [
    'fetchOrganisation',
  ]);

  const mockedLoggerService = jasmine.createSpyObj('mockedLoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
          {
            provide: OrganisationService,
            useValue: organisationServiceMock,
          },
          {
            provide: LoggerService,
            useValue: mockedLoggerService
          },
          fromOrganisationEffects.OrganisationEffects,
          provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(OrganisationEffects);
    loggerService = TestBed.inject(LoggerService);

    initTestScheduler();
    addMatchers();
  }));

  describe('loadOrganisation$', () => {
    it('should return a collection from loadOrganisation$ - LoadOrganisationSuccess', waitForAsync(() => {
      // const payload = [{payload: 'something'}];
      const payload = {
        account_number: 'someNumber',
        account_name: 'someName',
        credit_limit: 0,
        available_balance: 0,
        status: 'someStatus',
        effective_date: 'someDate'
      };
      organisationServiceMock.fetchOrganisation.and.returnValue(of(payload));
      const action = new LoadOrganisation();
      const completion = new LoadOrganisationSuccess(payload);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadOrganisation$).toBeObservable(expected);
    }));
  });

  describe('loadOrganisation$ error', () => {
    it('should return LoadOrganisationFail', waitForAsync(() => {
      organisationServiceMock.fetchOrganisation.and.returnValue(throwError(new Error()));
      const action = new LoadOrganisation();
      const completion = new LoadOrganisationFail(new Error());
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadOrganisation$).toBeObservable(expected);
      expect(loggerService.error).toHaveBeenCalled();
    }));
  });

});
