import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { LoggerService } from '../../../shared/services/logger.service';
import { OrganisationService } from '../../services';
import {
  OrganisationUpdateAddress,
  OrganisationUpdateAddressError,
  OrganisationUpdateAddressSuccess
} from '../actions';
import { AddressEffects } from './address.effects';

describe('AddressEffects', () => {
  let actions$;
  let effects: AddressEffects;
  const organisationService = jasmine.createSpyObj('OrganisationService', ['updateAddress']);
  const router = jasmine.createSpyObj('Router', ['navigate']);
  const logger = jasmine.createSpyObj('LoggerService', ['error']);
  const contactInformation = {
    addressLine1: '1 High Street',
    addressLine2: null,
    addressLine3: null,
    townCity: 'London',
    county: null,
    country: 'UK',
    postCode: 'SW1A 1AA',
    dxAddress: []
  };

  beforeEach(() => {
    organisationService.updateAddress.calls.reset();
    router.navigate.calls.reset();
    logger.error.calls.reset();

    TestBed.configureTestingModule({
      providers: [
        AddressEffects,
        provideMockActions(() => actions$),
        { provide: OrganisationService, useValue: organisationService },
        { provide: Router, useValue: router },
        { provide: LoggerService, useValue: logger }
      ]
    });
    effects = TestBed.inject(AddressEffects);
    initTestScheduler();
    addMatchers();
  });

  it('should submit the address and return a success action', () => {
    organisationService.updateAddress.and.returnValue(of({}));
    actions$ = hot('-a', { a: new OrganisationUpdateAddress(contactInformation) });

    expect(effects.updateAddress$).toBeObservable(cold('-b', {
      b: new OrganisationUpdateAddressSuccess(contactInformation)
    }));
  });

  [401, 403, 502].forEach((status) => {
    it(`should retain the draft and return an error action for a ${status} response`, () => {
      const error = new HttpErrorResponse({ status, statusText: 'Update failed' });
      organisationService.updateAddress.and.returnValue(throwError(() => error));
      actions$ = hot('-a', { a: new OrganisationUpdateAddress(contactInformation) });

      expect(effects.updateAddress$).toBeObservable(cold('-b', {
        b: new OrganisationUpdateAddressError(error)
      }));
    });
  });

  it('should handle a non-HTTP submission error in the same way', () => {
    const error = new Error('failed');
    organisationService.updateAddress.and.returnValue(throwError(() => error));
    actions$ = hot('-a', { a: new OrganisationUpdateAddress(contactInformation) });

    expect(effects.updateAddress$).toBeObservable(cold('-b', {
      b: new OrganisationUpdateAddressError(error)
    }));
  });

  it('should not navigate when the address update fails', () => {
    actions$ = hot('-a|', { a: new OrganisationUpdateAddressError(new Error('failed')) });

    expect(effects.updateAddressAndNavigate$).toBeObservable(cold('--|'));
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
