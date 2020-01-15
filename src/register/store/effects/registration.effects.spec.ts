import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { hot, cold } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as fromRegistrationEffects from './registration.effects';
import {RegistrationFormService} from '../../services/registration-form.service';
import {RegistrationEffects} from './registration.effects';
import {LoadPageItems, SubmitFormData, SubmitFormDataSuccess, LoadPageItemsFail, SubmitFormDataFail} from '../actions/registration.actions';
import {LoadPageItemsSuccess} from '../actions';
import { LoggerService } from '../../../shared/services/logger.service';


describe('Registration Effects', () => {
  let actions$;
  let effects: RegistrationEffects;
  let loggerService: LoggerService;

  const mockedRegistrationFormService = jasmine.createSpyObj('RegistrationFormService', [
    'getRegistrationForm',
    'submitRegistrationForm'
  ]);
  const mockedLoggerService = jasmine.createSpyObj('mockedLoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
          {
            provide: RegistrationFormService,
            useValue: mockedRegistrationFormService,
          },
          {
            provide: LoggerService,
            useValue: mockedLoggerService
          },
          fromRegistrationEffects.RegistrationEffects,
          provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(RegistrationEffects);
    loggerService = TestBed.get(LoggerService);

  });
  describe('loadRegistrationForm$', () => {
    it('should return a collection from loadRegistrationForm$ - LoadPageItemsSuccess', () => {
      const pageId = 'something';
      mockedRegistrationFormService.getRegistrationForm.and.returnValue(of(pageId));
      const action = new LoadPageItems(pageId);
      const completion = new LoadPageItemsSuccess({payload: 'something', pageId});
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadRegistrationForm$).toBeObservable(expected);
    });
  });

  describe('loadRegistrationForm$ error', () => {
    it('should return LoadOrganisationFail', () => {
      const pageId = 'something';
      mockedRegistrationFormService.getRegistrationForm.and.returnValue(throwError(new Error()));
      const action = new LoadPageItems(pageId);
      const completion = new LoadPageItemsFail(new Error());
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadRegistrationForm$).toBeObservable(expected);
      expect(loggerService.error).toHaveBeenCalled();
    });
  });

  describe('postRegistrationFormData$', () => {
    it('should submit form data after and call LoadPageItemsSuccess', () => {
      mockedRegistrationFormService.submitRegistrationForm.and.returnValue(of(true));
      const action = new SubmitFormData({somedata: 'string'});
      const completion = new SubmitFormDataSuccess();
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.postRegistrationFormData$).toBeObservable(expected);
    });

    describe('postRegistrationFormData$ error', () => {
      it('should submit form data after and call LoadPageItemsFail', () => {
        mockedRegistrationFormService.submitRegistrationForm.and.returnValue(throwError(new Error()));
        const action = new SubmitFormData({somedata: 'string'});
        const completion = new SubmitFormDataFail(new Error());
        actions$ = hot('-a', { a: action });
        const expected = cold('-b', { b: completion });
        expect(effects.postRegistrationFormData$).toBeObservable(expected);
        expect(loggerService.error).toHaveBeenCalled();
      });
    });
  });

});
