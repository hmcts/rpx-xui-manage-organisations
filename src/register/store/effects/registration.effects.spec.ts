import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { LoggerService } from '../../../shared/services/logger.service';
import { RegistrationFormService } from '../../services/registration-form.service';
import { LoadPageItemsSuccess } from '../actions';
import { LoadPageItems, LoadPageItemsFail, SubmitFormData, SubmitFormDataFail, SubmitFormDataSuccess } from '../actions/registration.actions';
import { RegistrationEffects } from './registration.effects';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Registration Effects', () => {
  let actions$;
  let effects: RegistrationEffects;
  let loggerService: LoggerService;

  const mockedRegistrationFormService = jasmine.createSpyObj('RegistrationFormService', [
    'getRegistrationForm',
    'submitRegistrationForm'
  ]);
  const mockedLoggerService = jasmine.createSpyObj('mockedLoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        {
            provide: RegistrationFormService,
            useValue: mockedRegistrationFormService
        },
        {
            provide: LoggerService,
            useValue: mockedLoggerService
        },
        RegistrationEffects,
        provideMockActions(() => actions$),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});

    effects = TestBed.inject(RegistrationEffects);
    loggerService = TestBed.inject(LoggerService);

    initTestScheduler();
    addMatchers();
  }));

  describe('loadRegistrationForm$', () => {
    it('should return a collection from loadRegistrationForm$ - LoadPageItemsSuccess', waitForAsync(() => {
      const pageId = 'something';
      mockedRegistrationFormService.getRegistrationForm.and.returnValue(of(pageId));
      const action = new LoadPageItems(pageId);
      const completion = new LoadPageItemsSuccess({ payload: 'something', pageId });
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadRegistrationForm$).toBeObservable(expected);
    }));
  });

  describe('loadRegistrationForm$ error', () => {
    it('should return LoadOrganisationFail', waitForAsync(() => {
      const pageId = 'something';
      mockedRegistrationFormService.getRegistrationForm.and.returnValue(throwError(new Error()));
      const action = new LoadPageItems(pageId);
      const completion = new LoadPageItemsFail(new Error());
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadRegistrationForm$).toBeObservable(expected);
      expect(loggerService.error).toHaveBeenCalled();
    }));
  });

  describe('postRegistrationFormData$', () => {
    it('should submit form data after and call LoadPageItemsSuccess', waitForAsync(() => {
      mockedRegistrationFormService.submitRegistrationForm.and.returnValue(of(true));
      const action = new SubmitFormData({ somedata: 'string' });
      const completion = new SubmitFormDataSuccess();
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.postRegistrationFormData$).toBeObservable(expected);
    }));

    describe('postRegistrationFormData$ error', () => {
      it('should submit form data after and call LoadPageItemsFail', waitForAsync(() => {
        mockedRegistrationFormService.submitRegistrationForm.and.returnValue(throwError(new Error()));
        const action = new SubmitFormData({ somedata: 'string' });
        const completion = new SubmitFormDataFail(new Error());
        actions$ = hot('-a', { a: action });
        const expected = cold('-b', { b: completion });
        expect(effects.postRegistrationFormData$).toBeObservable(expected);
        expect(loggerService.error).toHaveBeenCalled();
      }));
    });
  });
});
