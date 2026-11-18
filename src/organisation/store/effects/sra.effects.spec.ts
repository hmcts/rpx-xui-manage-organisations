import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { LoggerService } from '../../../shared/services/logger.service';
import { OrganisationService } from '../../services';
import {
  OrganisationUpdateSra,
  OrganisationUpdateSraError,
  OrganisationUpdateSraSuccess
} from '../actions';
import { SraEffects } from './sra.effects';

describe('SraEffects', () => {
  let actions$;
  let effects: SraEffects;
  const organisationService = jasmine.createSpyObj('OrganisationService', ['updateSra']);
  const router = jasmine.createSpyObj('Router', ['navigate']);
  const logger = jasmine.createSpyObj('LoggerService', ['error']);

  beforeEach(() => {
    organisationService.updateSra.calls.reset();
    router.navigate.calls.reset();
    logger.error.calls.reset();

    TestBed.configureTestingModule({
      providers: [
        SraEffects,
        provideMockActions(() => actions$),
        { provide: OrganisationService, useValue: organisationService },
        { provide: Router, useValue: router },
        { provide: LoggerService, useValue: logger }
      ]
    });
    effects = TestBed.inject(SraEffects);
    initTestScheduler();
    addMatchers();
  });

  it('should submit the SRA ID and return a success action', () => {
    organisationService.updateSra.and.returnValue(of({}));
    actions$ = hot('-a', { a: new OrganisationUpdateSra('SRA654321') });

    expect(effects.updateSra$).toBeObservable(cold('-b', {
      b: new OrganisationUpdateSraSuccess('SRA654321')
    }));
  });

  it('should retain the draft and return an error action when submission fails', () => {
    const error = new HttpErrorResponse({ status: 500, statusText: 'Update failed' });
    organisationService.updateSra.and.returnValue(throwError(() => error));
    actions$ = hot('-a', { a: new OrganisationUpdateSra('SRA654321') });

    expect(effects.updateSra$).toBeObservable(cold('-b', {
      b: new OrganisationUpdateSraError(error)
    }));
  });

  it('should navigate to the organisation after a successful update', () => {
    actions$ = of(new OrganisationUpdateSraSuccess('SRA654321'));

    effects.updateSraAndNavigate$.subscribe();

    expect(router.navigate).toHaveBeenCalledWith(['/organisation']);
  });
});
