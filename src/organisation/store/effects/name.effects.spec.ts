import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { LoggerService } from '../../../shared/services/logger.service';
import { OrganisationService } from '../../services';
import {
  OrganisationUpdateName,
  OrganisationUpdateNameError,
  OrganisationUpdateNameSuccess
} from '../actions';
import { NameEffects } from './name.effects';

describe('NameEffects', () => {
  let actions$;
  let effects: NameEffects;
  const organisationService = jasmine.createSpyObj('OrganisationService', ['updateName']);
  const router = jasmine.createSpyObj('Router', ['navigate']);
  const logger = jasmine.createSpyObj('LoggerService', ['error']);

  beforeEach(() => {
    organisationService.updateName.calls.reset();
    router.navigate.calls.reset();
    logger.error.calls.reset();

    TestBed.configureTestingModule({
      providers: [
        NameEffects,
        provideMockActions(() => actions$),
        { provide: OrganisationService, useValue: organisationService },
        { provide: Router, useValue: router },
        { provide: LoggerService, useValue: logger }
      ]
    });
    effects = TestBed.inject(NameEffects);
    initTestScheduler();
    addMatchers();
  });

  it('should submit the name and return a success action', () => {
    organisationService.updateName.and.returnValue(of({}));
    actions$ = hot('-a', { a: new OrganisationUpdateName('Updated organisation') });

    expect(effects.updateName$).toBeObservable(cold('-b', {
      b: new OrganisationUpdateNameSuccess('Updated organisation')
    }));
  });

  it('should retain the draft and return an error action when submission fails', () => {
    const error = new HttpErrorResponse({ status: 500, statusText: 'Update failed' });
    organisationService.updateName.and.returnValue(throwError(() => error));
    actions$ = hot('-a', { a: new OrganisationUpdateName('Updated organisation') });

    expect(effects.updateName$).toBeObservable(cold('-b', {
      b: new OrganisationUpdateNameError(error)
    }));
  });

  it('should navigate to the organisation after a successful update', () => {
    actions$ = of(new OrganisationUpdateNameSuccess('Updated organisation'));

    effects.updateNameAndNavigate$.subscribe();

    expect(router.navigate).toHaveBeenCalledWith(['/organisation']);
  });
});
