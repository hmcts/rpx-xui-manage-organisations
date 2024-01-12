import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MemoizedSelector } from '@ngrx/store';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { LoggerService } from '../../../shared/services/logger.service';
import { UsersService } from '../../services/users.service';
import { InviteNewUser, LoadAllUsersNoRoleData, LoadAllUsersNoRoleDataFail, LoadAllUsersNoRoleDataSuccess, LoadUserDetails, LoadUserDetailsSuccess, LoadUsers, LoadUsersFail, LoadUsersSuccess, SuspendUser, SuspendUserFail, SuspendUserSuccess } from '../actions/user.actions';
import * as orgActions from '../../../organisation/store/actions';
import * as fromRoot from '../../../app/store';
import * as fromUsersEffects from './users.effects';
import { RawPrdUser, RawPrdUserListWithoutRoles, RawPrdUserLite, RawPrdUsersList } from 'src/users/models/prd-users.model';

describe('Users Effects', () => {
  let actions$;
  let effects: fromUsersEffects.UsersEffects;
  const usersServiceMock: jasmine.SpyObj<UsersService> = jasmine.createSpyObj<UsersService>('UsersService', [
    'getListOfUsers', 'suspendUser', 'getUserDetailsWithPermission', 'getAllUsersList'
  ]);
  let loggerService: LoggerService;

  let mockGetOgdInviteUserFlowFeatureIsEnabledSelector: MemoizedSelector<fromRoot.State, boolean>;
  let mockRootStore: MockStore<fromRoot.State>;
  const mockedLoggerService = jasmine.createSpyObj('mockedLoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock
        },
        {
          provide: LoggerService,
          useValue: mockedLoggerService
        },
        fromUsersEffects.UsersEffects,
        provideMockActions(() => actions$),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(fromUsersEffects.UsersEffects);
    loggerService = TestBed.inject(LoggerService);
    mockRootStore = TestBed.inject(MockStore);
    mockGetOgdInviteUserFlowFeatureIsEnabledSelector = mockRootStore.overrideSelector(fromRoot.getOgdInviteUserFlowFeatureIsEnabled, false);
    initTestScheduler();
    addMatchers();
  }));

  afterEach(() => {
    mockRootStore.resetSelectors();
  });

  describe('loadUsers$', () => {
    it('should return a collection from loadUsers$ - LoadUsersSuccess', waitForAsync(() => {
      const prdUser: RawPrdUser = {
        email: 'madeup@test.com',
        firstName: 'John',
        lastName: 'Doe',
        idamStatus: 'Active',
        userIdentifier: '123'
      };
      const payload:RawPrdUsersList = {
        organisationIdentifier: 'ABC123',
        users: [prdUser]
      };
      usersServiceMock.getListOfUsers.and.returnValue(of(payload));
      const action = new LoadUsers();
      const orgUpdateProfileIdsActionCompletion = new orgActions.OrganisationUpdateUpdateProfileIds([]);
      const loadUserSuccessActionCompletion = new LoadUsersSuccess({
        users: [
          {
            ...prdUser,
            fullName: 'John Doe',
            routerLink: `user/${prdUser.userIdentifier}`,
            routerLinkTitle: 'User details for John Doe with id 123',
            accessTypes: []
          }
        ]
      });
      actions$ = hot('-a', { a: action });
      const expected = cold('-(bc)', { b: orgUpdateProfileIdsActionCompletion, c: loadUserSuccessActionCompletion });
      expect(effects.loadUsers$).toBeObservable(expected);
    }));

    it('should return a collection from loadUsers$ when status pending - LoadUsersSuccess', waitForAsync(() => {
      const prdUser: RawPrdUser = {
        email: 'madeup@test.com',
        firstName: 'John',
        lastName: 'Doe',
        idamStatus: 'PENDING',
        userIdentifier: '123'
      };
      const payload:RawPrdUsersList = {
        organisationIdentifier: 'ABC123',
        users: [prdUser]
      };
      usersServiceMock.getListOfUsers.and.returnValue(of(payload));
      const action = new LoadUsers();
      const orgUpdateProfileIdsActionCompletion = new orgActions.OrganisationUpdateUpdateProfileIds([]);
      const loadUserSuccessActionCompletion = new LoadUsersSuccess({
        users: [
          {
            ...prdUser,
            idamStatus: 'PENDING',
            fullName: 'John Doe',
            routerLink: `user/${prdUser.userIdentifier}`,
            routerLinkTitle: 'User details for John Doe with id 123',
            accessTypes: []
          }
        ]
      });
      actions$ = hot('-a', { a: action });
      const expected = cold('-(bc)', { b: orgUpdateProfileIdsActionCompletion, c: loadUserSuccessActionCompletion });
      expect(effects.loadUsers$).toBeObservable(expected);
    }));
  });

  it('should return a collection from loadUsers$ with accessTypes - LoadUsersSuccess', waitForAsync(() => {
    const prdUser: RawPrdUser = {
      email: 'madeup@test.com',
      firstName: 'John',
      lastName: 'Doe',
      idamStatus: 'PENDING',
      userIdentifier: '123',
      accessTypes: [{ organisationProfileId: 'orgProfileId', accessTypeId: '1234', enabled: true, jurisdictionId: '1234' }]
    };
    const payload:RawPrdUsersList = {
      organisationIdentifier: 'ABC123',
      users: [prdUser]
    };
    usersServiceMock.getListOfUsers.and.returnValue(of(payload));
    const action = new LoadUsers();
    const orgUpdateProfileIdsActionCompletion = new orgActions.OrganisationUpdateUpdateProfileIds(['orgProfileId']);
    const loadUserSuccessActionCompletion = new LoadUsersSuccess({
      users: [
        {
          ...prdUser,
          fullName: 'John Doe',
          routerLink: `user/${prdUser.userIdentifier}`,
          routerLinkTitle: 'User details for John Doe with id 123',
          accessTypes: [{ organisationProfileId: 'orgProfileId', accessTypeId: '1234', enabled: true, jurisdictionId: '1234' }]
        }
      ]
    });
    actions$ = hot('-a', { a: action });
    const expected = cold('-(bc)', { b: orgUpdateProfileIdsActionCompletion, c: loadUserSuccessActionCompletion });
    expect(effects.loadUsers$).toBeObservable(expected);
  }));

  describe('loadUsers$ error', () => {
    it('should return LoadUsersFail', waitForAsync(() => {
      usersServiceMock.getListOfUsers.and.returnValue(throwError(new Error()));
      const action = new LoadUsers();
      const completion = new LoadUsersFail(new Error());
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadUsers$).toBeObservable(expected);
      expect(loggerService.error).toHaveBeenCalled();
    }));
  });

  describe('suspendUser$', () => {
    it('should return a collection from suspendUser$ - SuspendUserSuccess', waitForAsync(() => {
      const user = {
        userIdentifier: 'cfeba78e-ff81-49d5-8a65-55fa2a9c2424',
        firstName: 'Humpty',
        lastName: 'Dumpty',
        email: 'aa@aa.com',
        idamStatus: 'Suspend',
        idamStatusCode: '',
        idamMessage: '19 No call made to SIDAM to get the user roles as user status is ‘Pending’',
        fullName: 'Humpty Dumpty',
        routerLink: 'user/cfeba78e-ff81-49d5-8a65-55fa2a9c2424',
        selected: false,
        status: 'Active'
      };
      usersServiceMock.suspendUser.and.returnValue(of({}));
      const action = new SuspendUser({ payload: user });
      const completion = new SuspendUserSuccess({ payload: user });
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.suspendUser$).toBeObservable(expected);
    }));
  });

  describe('suspendUser$ error', () => {
    it('should return SuspendUserFail', waitForAsync(() => {
      usersServiceMock.suspendUser.and.returnValue(throwError(new Error()));
      const action = new SuspendUser({});
      const completion = new SuspendUserFail(new Error());
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.suspendUser$).toBeObservable(expected);
    }));
  });

  describe('loadUserDetails$', () => {
    it('should return a details of the selected user - LoadUserDetails', () => {
      const payload = { users: [{ payload: 'something' }] };
      const users = { payload: 'something', fullName: 'undefined undefined', routerLink: 'user/undefined',
        routerLinkTitle: 'User details for undefined undefined with id undefined' };
      usersServiceMock.getUserDetailsWithPermission.and.returnValue(of(payload));
      const action = new LoadUserDetails(payload);
      const completion = new LoadUserDetailsSuccess(users);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadUserDetails$).toBeObservable(expected);
    });
  });

  describe('inviteNewUser$', () => {
    describe('inviteNewUser$ - OgdInviteUserFlowFeature disabled', () => {
      it('should return a Go object with the path to users/invite-user', () => {
        mockGetOgdInviteUserFlowFeatureIsEnabledSelector.setResult(false);
        const action = new InviteNewUser();
        const completion = new fromRoot.Go({ path: ['users/invite-user'] });
        actions$ = hot('-a', { a: action });
        const expected = cold('-b', { b: completion });
        expect(effects.inviteNewUser$).toBeObservable(expected);
      });
    });

    describe('inviteNewUser$ - OgdInviteUserFlowFeature enabled', () => {
      it('should return a Go object with the path to users/manage', () => {
        mockGetOgdInviteUserFlowFeatureIsEnabledSelector.setResult(true);
        const action = new InviteNewUser();
        const completion = new fromRoot.Go({ path: ['users/manage'] });
        actions$ = hot('-a', { a: action });
        const expected = cold('-b', { b: completion });
        expect(effects.inviteNewUser$).toBeObservable(expected);
      });
    });
  });

  describe('loadAllUsersNoRoleData$', () => {
    it('should return a collection from loadAllUsersNoRoleData$ - LoadAllUsersNoRoleDataSuccess', waitForAsync(() => {
      const prdUser: RawPrdUserLite = {
        email: 'madeup@test.com',
        firstName: 'John',
        lastName: 'Doe',
        idamStatus: 'ACTIVE',
        userIdentifier: '123'
      };
      const payload : RawPrdUserListWithoutRoles = {
        organisationIdentifier: 'ABC123',
        users: [prdUser]
      };
      usersServiceMock.getAllUsersList.and.returnValue(of(payload));
      const action = new LoadAllUsersNoRoleData();
      const orgUpdateProfileIdsActionCompletion = new orgActions.OrganisationUpdateUpdateProfileIds([]);
      const orgLoadOrgAccessTypesCompletion = new orgActions.LoadOrganisationAccessTypes([]);
      const loadUserSuccessActionCompletion = new LoadAllUsersNoRoleDataSuccess({
        users: [
          {
            ...prdUser,
            fullName: 'John Doe',
            routerLink: `user/${prdUser.userIdentifier}`,
            routerLinkTitle: 'User details for John Doe with id 123',
            accessTypes: []
          }
        ]
      });
      actions$ = hot('-a', { a: action });
      const expected = cold('-(bcd)', { b: orgUpdateProfileIdsActionCompletion, c: orgLoadOrgAccessTypesCompletion, d: loadUserSuccessActionCompletion });
      expect(effects.loadAllUsersNoRoleData$).toBeObservable(expected);
    }));

    it('should return a collection from loadAllUsersNoRoleData$ with accessTypes - LoadAllUsersNoRoleDataSuccess', waitForAsync(() => {
      const prdUser: RawPrdUserLite = {
        email: 'madeup@test.com',
        firstName: 'John',
        lastName: 'Doe',
        idamStatus: 'ACTIVE',
        userIdentifier: '123',
        accessTypes: [{ organisationProfileId: 'orgProfileId', accessTypeId: '1234', enabled: true, jurisdictionId: '1234' }]
      };
      const payload : RawPrdUserListWithoutRoles = {
        organisationIdentifier: 'ABC123',
        users: [prdUser]
      };
      usersServiceMock.getAllUsersList.and.returnValue(of(payload));
      const action = new LoadAllUsersNoRoleData();
      const orgUpdateProfileIdsActionCompletion = new orgActions.OrganisationUpdateUpdateProfileIds(['orgProfileId']);
      const orgLoadOrgAccessTypesCompletion = new orgActions.LoadOrganisationAccessTypes(['orgProfileId']);
      const loadUserSuccessActionCompletion = new LoadAllUsersNoRoleDataSuccess({
        users: [
          {
            ...prdUser,
            fullName: 'John Doe',
            routerLink: `user/${prdUser.userIdentifier}`,
            routerLinkTitle: 'User details for John Doe with id 123',
            accessTypes: [{ organisationProfileId: 'orgProfileId', accessTypeId: '1234', enabled: true, jurisdictionId: '1234' }]
          }
        ]
      });
      actions$ = hot('-a', { a: action });
      const expected = cold('-(bcd)', { b: orgUpdateProfileIdsActionCompletion, c: orgLoadOrgAccessTypesCompletion, d: loadUserSuccessActionCompletion });
      expect(effects.loadAllUsersNoRoleData$).toBeObservable(expected);
    }));
  });

  describe('loadAllUsersNoRoleData$ error', () => {
    it('should return LoadAllUsersNoRoleDataFail', waitForAsync(() => {
      usersServiceMock.getAllUsersList.and.returnValue(throwError(new Error()));
      const action = new LoadAllUsersNoRoleData();
      const completion = new LoadAllUsersNoRoleDataFail(new Error());
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadAllUsersNoRoleData$).toBeObservable(expected);
      expect(loggerService.error).toHaveBeenCalled();
    }));
  });
});
