import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';

import { ManageUserComponent } from './manage-user.component';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import * as fromRoot from '../../../app/store';
import * as fromStore from '../../store';
import * as fromOrgStore from '../../../organisation/store';
import { MemoizedSelector } from '@ngrx/store';
import { User, UserAccessType } from '@hmcts/rpx-xui-common-lib';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoggerService } from 'src/shared/services/logger.service';
import { OrganisationDetails } from 'src/models';
import { EditUserModel } from 'src/user-profile/models/editUser.model';

describe('ManageUserComponent', () => {
  let component: ManageUserComponent;
  let fixture: ComponentFixture<ManageUserComponent>;
  let mockRouterStore: MockStore<fromRoot.State>;
  let mockUserStore: MockStore<fromStore.UserState>;
  let mockOrganisationStore: MockStore<fromOrgStore.OrganisationState>;
  let mockedLoggerService = jasmine.createSpyObj('LoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);
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
        }
      ],
      declarations: [ManageUserComponent],
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
    defaultUser = {
      email: 'john@doe.com',
      firstName: 'John',
      lastName: 'Doe',
      idamStatus: 'Active',
      idamStatusCode: 'A',
      roles: ['pui-case-manager', 'pui-user-manager'],
      id: '123'
    };
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

  fdescribe('Update User', () => {
    const userWithAccessTypes: User = {
      email: 'john@doe.com',
      firstName: 'John',
      lastName: 'Doe',
      idamStatus: 'Active',
      idamStatusCode: 'A',
      roles: ['pui-case-manager', 'pui-user-manager', 'pui-caa'],
      id: '123',
      accessTypes: [{
        accessTypeId: '101',
        jurisdictionId: '6',
        organisationProfileId: 'SOLICITOR_PROFILE',
        enabled: false
      },
      {
        accessTypeId: '10',
        jurisdictionId: '6',
        organisationProfileId: 'SOLICITOR_PROFILE',
        enabled: true
      }]
    };
    const userWithUpdatedRoles: EditUserModel = {
      email: 'john@doe.com',
      firstName: 'John',
      lastName: 'Doe',
      idamStatus: 'Active',
      rolesAdd: [{ name: 'pui-finance-manager' }],
      rolesDelete: [{ name: 'pui-user-manager' }],
      id: '123',
      accessTypes: [{
        accessTypeId: '101',
        jurisdictionId: '6',
        organisationProfileId: 'SOLICITOR_PROFILE',
        enabled: false
      },
      {
        accessTypeId: '10',
        jurisdictionId: '6',
        organisationProfileId: 'SOLICITOR_PROFILE',
        enabled: true
      }]
    };
    /*
    const userWithUpdatedAccessTypes: EditUserModel = {
      email: 'john@doe.com',
      firstName: 'John',
      lastName: 'Doe',
      idamStatus: 'Active',
      rolesAdd: [],
      rolesDelete: [],
      id: '123',
      accessTypes: [{
        accessTypeId: '101',
        jurisdictionId: '6',
        organisationProfileId: 'SOLICITOR_PROFILE',
        enabled: true
      },
      {
        accessTypeId: '10',
        jurisdictionId: '6',
        organisationProfileId: 'SOLICITOR_PROFILE',
        enabled: false
      }]
    };
    const accessTypesUpdated: UserAccessType[] = [{
      accessTypeId: '101',
      jurisdictionId: '6',
      organisationProfileId: 'SOLICITOR_PROFILE',
      enabled: true
    },
    {
      accessTypeId: '10',
      jurisdictionId: '6',
      organisationProfileId: 'SOLICITOR_PROFILE',
      enabled: false
    }];
    */

    beforeEach(() => {
      mockGetSingleUserSelector.setResult(userWithAccessTypes);
      component.userId = userWithAccessTypes.id;
      component.user = userWithAccessTypes;
    });
    it('should save updated user details with new roles', fakeAsync(() => {
      component.onPersonalDetailsChange({
        email: userWithAccessTypes.email,
        firstName: userWithAccessTypes.firstName,
        lastName: userWithAccessTypes.lastName
      });

      component.onSelectedCaseManagamentPermissionsChange({
        manageCases: true,
        userAccessTypes: userWithAccessTypes.accessTypes
      });

      component.onStandardUserPermissionsChange({
        isCaseAccessAdmin: true,
        isPuiFinanceManager: true, // Should be added
        isPuiOrganisationManager: false,
        isPuiUserManager: false // Should be removed
      });

      expect(component).toBeTruthy();
      flushMicrotasks();
      expect(component.backUrl).toBe('/users/user/123');

      const dispatchSpy = spyOn(mockUserStore, 'dispatch');
      component.onSubmit();
      expect(dispatchSpy).toHaveBeenCalledWith(new fromStore.EditUser(userWithUpdatedRoles));
    }));
    /*
    it('should save updated user details with new access types', fakeAsync(() => {
      component.onPersonalDetailsChange({
        email: userWithAccessTypes.email,
        firstName: userWithAccessTypes.firstName,
        lastName: userWithAccessTypes.lastName
      });

      component.onSelectedCaseManagamentPermissionsChange({
        manageCases: true,
        userAccessTypes: accessTypesUpdated // Amended access types
      });

      component.onStandardUserPermissionsChange({
        isCaseAccessAdmin: true,
        isPuiFinanceManager: false,
        isPuiOrganisationManager: false,
        isPuiUserManager: true
      });

      expect(component).toBeTruthy();
      flushMicrotasks();
      expect(component.backUrl).toBe('/users/user/123');

      const dispatchSpy = spyOn(mockUserStore, 'dispatch');
      component.onSubmit();
      expect(dispatchSpy).toHaveBeenCalledWith(new fromStore.EditUser(userWithUpdatedAccessTypes));
    })); */
  });
});
