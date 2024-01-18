import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';

import { ManageUserComponent } from './manage-user.component';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import * as fromRoot from '../../../app/store';
import * as fromStore from '../../store';
import * as fromOrgStore from '../../../organisation/store';
import { MemoizedSelector } from '@ngrx/store';
import { User } from '@hmcts/rpx-xui-common-lib';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoggerService } from 'src/shared/services/logger.service';
import { OrganisationDetails } from 'src/models';
import { AppConstants } from 'src/app/app.constants';
import { RpxTranslatePipe, RpxTranslationService } from 'rpx-xui-translation';

describe('ManageUserComponent', () => {
  let component: ManageUserComponent;
  let fixture: ComponentFixture<ManageUserComponent>;
  let mockRouterStore: MockStore<fromRoot.State>;
  let mockUserStore: MockStore<fromStore.UserState>;
  let mockOrganisationStore: MockStore<fromOrgStore.OrganisationState>;
  let mockedLoggerService = jasmine.createSpyObj('LoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);
  const translationMockService = jasmine.createSpyObj('translationMockService', ['translate', 'getTranslation$']);
  let actions$: Observable<any>;

  let defaultUser: User;
  let defaultOrganisationState: OrganisationDetails;
  let defaultRouterStateUrl;
  let mockGetSingleUserSelector: MemoizedSelector<fromStore.UserState, User>;
  let mockGetRouterState;

  beforeEach(async () => {
    mockedLoggerService = jasmine.createSpyObj('mockedLoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);
    await TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        provideMockActions(() => actions$),
        {
          provide: LoggerService,
          useValue: mockedLoggerService
        },
        { provide: RpxTranslationService, useValue: translationMockService }
      ],
      declarations: [ManageUserComponent, RpxTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ManageUserComponent);

    mockRouterStore = TestBed.inject(MockStore);
    mockUserStore = TestBed.inject(MockStore);
    mockOrganisationStore = TestBed.inject(MockStore);

    defaultRouterStateUrl = {
      state: {
        params: { userId: '123' },
        url: '',
        queryParams: {}
      },
      navigationId: 0
    };
    defaultUser = { email: 'john@doe.com', firstName: 'John', lastName: 'Doe', idamStatus: 'Active', idamStatusCode: 'A', roles: ['pui-case-manager', 'pui-user-manager'], id: '123' };
    defaultOrganisationState = {
      name: 'Organisation Name',
      organisationProfileIds: ['SOLICITOR_PROFILE'],
      organisationIdentifier: '123',
      status: 'ACTIVE',
      sraId: 'sraId',
      sraRegulated: true,
      superUser: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com'
      },
      contactInformation: [], // Add this line
      paymentAccount: [],
      pendingPaymentAccount: [],
      pendingAddPaymentAccount: [],
      pendingRemovePaymentAccount: []
    };
    mockGetRouterState = mockRouterStore.overrideSelector(fromRoot.getRouterState, defaultRouterStateUrl);
    mockGetSingleUserSelector = mockUserStore.overrideSelector(fromStore.getGetSingleUser, of(defaultUser));
    mockOrganisationStore.overrideSelector(fromOrgStore.getOrganisationSel, defaultOrganisationState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    mockRouterStore.resetSelectors();
    mockUserStore.resetSelectors();
    mockOrganisationStore.resetSelectors();
  });

  describe('ngOnInit - user id found in route', () => {
    beforeEach(() => {
      mockGetRouterState.setResult(defaultRouterStateUrl);
      mockGetSingleUserSelector.setResult(defaultUser);
    });

    it('should retrieve user and setup subscribers', fakeAsync(() => {
      expect(component).toBeTruthy();
      flushMicrotasks();
      expect(component.backUrl).toBe('/users/user/123');
    }));
  });

  describe('inviteUser', () => {
    it('should dispatch SendInviteUser action with correct payload', () => {
      const updatedUser: any = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        roles: ['pui-case-manager']
      };
      component.updatedUser = updatedUser;
      component.resendInvite = true;

      const expectedPayload = {
        ...updatedUser,
        roles: [...updatedUser.roles, ...AppConstants.CCD_ROLES],
        resendInvite: component.resendInvite
      };

      const action = new fromStore.SendInviteUser(expectedPayload);
      const spy = spyOn(mockUserStore, 'dispatch');

      component.inviteUser();

      expect(spy).toHaveBeenCalledWith(action);
    });

    it('should dispatch AddGlobalError and Go actions when globalError is present', () => {
      const errorNumber = 400;
      const expectedGlobalError = component.getGlobalError(errorNumber);
      const spyStoreDispatch = spyOn(mockUserStore, 'dispatch');

      component.handleError(mockUserStore, errorNumber);

      expect(spyStoreDispatch).toHaveBeenCalledWith(new fromRoot.AddGlobalError(expectedGlobalError));
      expect(spyStoreDispatch).toHaveBeenCalledWith(new fromRoot.Go({ path: ['service-down'] }));
    });

    it('should return correct global error object for error 400', () => {
      const error = 400;
      const expectedGlobalError = {
        header: 'Sorry, there is a problem',
        errors: [{
          bodyText: 'to check the status of the user',
          urlText: 'Refresh and go back',
          url: '/users'
        }]
      };
      const globalError = component.getGlobalError(error);
      expect(globalError).toEqual(expectedGlobalError);
    });

    it('should return correct global error object for error 404', () => {
      const error = 404;
      const expectedGlobalError = {
        header: 'Sorry, there is a problem with this account',
        errors: [{
          bodyText: 'to reactivate this account',
          urlText: 'Get help',
          url: '/get-help',
          newTab: true
        }, {
          bodyText: null,
          urlText: 'Go back to manage users',
          url: '/users'
        }]
      };
      const globalError = component.getGlobalError(error);
      expect(globalError).toEqual(expectedGlobalError);
    });

    it('should return correct global error object for error 500', () => {
      const error = 500;
      const expectedGlobalError = {
        header: 'Sorry, there is a problem with the service',
        errors: [{
          bodyText: 'Try again later.',
          urlText: null,
          url: null
        }, {
          bodyText: null,
          urlText: 'Go back to manage users',
          url: '/users'
        }]
      };
      const globalError = component.getGlobalError(error);
      expect(globalError).toEqual(expectedGlobalError);
    });

    it('should return undefined for an unknown error code', () => {
      const error = 999;
      const expectedGlobalError = {
        header: 'Sorry, there is a problem with the service',
        errors: [{
          bodyText: 'Try again later.',
          urlText: null,
          url: null
        }, {
          bodyText: null,
          urlText: 'Go back to manage users',
          url: '/users'
        }]
      };
      const globalError = component.getGlobalError(error);
      expect(globalError).toEqual(expectedGlobalError);
    });
  });
});
