import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { provideMockActions } from '@ngrx/effects/testing';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { OrganisationEffects } from '.';
import { OrganisationDetails } from '../../../models/organisation.model';
import { LoggerService } from '../../../shared/services/logger.service';
import { OrganisationService } from '../../services';
import { LoadOrganisation, LoadOrganisationFail, LoadOrganisationSuccess } from '../actions';
import * as fromOrganisationEffects from './organisation.effects';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Organisation Effects', () => {
  let actions$;
  let effects: OrganisationEffects;
  let loggerService: LoggerService;

  const organisationServiceMock = jasmine.createSpyObj('OrganisationService', [
    'fetchOrganisation'
  ]);

  const mockedLoggerService = jasmine.createSpyObj('mockedLoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);

  const mockFeatureService = jasmine.createSpyObj('FeatureToggleService', [
    'getValue'
  ]);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: OrganisationService,
          useValue: organisationServiceMock
        },
        {
          provide: LoggerService,
          useValue: mockedLoggerService
        },
        {
          provide: FeatureToggleService,
          useValue: mockFeatureService
        },
        fromOrganisationEffects.OrganisationEffects,
        provideMockActions(() => actions$),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
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
      const payload: OrganisationDetails = {
        name: 'a@b.com',
        organisationIdentifier: 'A111111',
        organisationProfileIds: [
          'SOLICITOR_PROFILE'
        ],
        contactInformation: [{
          addressLine1: '10  oxford street',
          addressLine2: 'A Town',
          addressLine3: null,
          townCity: 'London',
          county: null,
          country: 'UK',
          postCode: 'W1',
          dxAddress: [{
            dxNumber: 'dx11111',
            dxExchange: 'dxExchange'
          }]
        }],
        status: '',
        sraId: '',
        sraRegulated: true,
        superUser: {
          firstName: 'James',
          lastName: 'Chris',
          email: 'James.Chris@test.com'
        },
        paymentAccount: [{ pbaNumber: 'PBA000000' }],
        pendingAddPaymentAccount: [],
        pendingRemovePaymentAccount: []
      };
      mockFeatureService.getValue.and.returnValue(of(true));
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
      mockFeatureService.getValue.and.returnValue(of(true));
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
