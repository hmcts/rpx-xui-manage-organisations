import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { hot, cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as fromRegistrationEffects from './registration.effects';
import {RegistrationFormService} from '../../services/registration-form.service';
import {RegistrationEffects} from './registration.effects';
import {LoadPageItems, SubmitFormData, SubmitFormDataSuccess} from '../actions/registration.actions';
import {LoadPageItemsSuccess} from '../actions';
import { LoggerService } from 'src/shared/services/logger.service';


describe('Registration Effects', () => {
  let actions$;
  let effects: RegistrationEffects;
  const RegistrationFormServiceMock = jasmine.createSpyObj('RegistrationFormService', [
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
            useValue: RegistrationFormServiceMock,
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

  });
  describe('loadRegistrationForm$', () => {
    it('should return a collection from loadRegistrationForm$ - LoadPageItemsSuccess', () => {
      const pageId = 'something';
      RegistrationFormServiceMock.getRegistrationForm.and.returnValue(of(pageId));
      const action = new LoadPageItems(pageId);
      const completion = new LoadPageItemsSuccess({payload: 'something', pageId});
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadRegistrationForm$).toBeObservable(expected);
    });
  });

  describe('postRegistrationFormData$', () => {
    it('should submit form data after and call LoadPageItemsSuccess', () => {
      RegistrationFormServiceMock.submitRegistrationForm.and.returnValue(of(true));
      const action = new SubmitFormData({somedata: 'string'});
      const completion = new SubmitFormDataSuccess();
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.postRegistrationFormData$).toBeObservable(expected);
    });
  });

});
