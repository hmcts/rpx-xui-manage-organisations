import { User } from '@hmcts/rpx-xui-common-lib';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserDetailsComponent } from './user-details.component';
import { Store } from '@ngrx/store';
import * as fromOrgStore from '../../../organisation/store';
import { Jurisdiction, OrganisationAccessType } from '../../../models';
import { OrganisationState } from '../../../organisation/store';
import { EnvironmentConfig } from '../../../models/environmentConfig.model';
import * as fromStore from '../../store';
import * as fromRoot from '../../../app/store';

describe('User Details Component', () => {
  let component: UserDetailsComponent;
  let userStoreSpyObject;
  let routerStoreSpyObject;
  let orgStoreSpyObject;
  let actionsObject;
  let activeRoute;
  const environmentConfig = {
    ogdUpdateRefreshUserEnabled: true
  } as EnvironmentConfig;

  beforeEach(() => {
    userStoreSpyObject = jasmine.createSpyObj('Store', ['pipe', 'select', 'dispatch']);
    routerStoreSpyObject = jasmine.createSpyObj('Store', ['pipe', 'select', 'dispatch']);
    orgStoreSpyObject = jasmine.createSpyObj<Store<fromOrgStore.OrganisationState>>('Store', ['pipe', 'select', 'dispatch']);

    orgStoreSpyObject.pipe.and.callFake(() => {
      return of({ organisation: { organisationJurisdications: [] } } as OrganisationState);
    });

    orgStoreSpyObject.pipe.and.callFake(() => {
      return of(([] as Jurisdiction[]));
    });

    actionsObject = jasmine.createSpyObj('Actions', ['pipe']);
    activeRoute = {
      snapshot: {
        params: { userId: 'user-1' }
      }
    };
    component = new UserDetailsComponent(userStoreSpyObject, routerStoreSpyObject, orgStoreSpyObject, actionsObject, activeRoute, environmentConfig);
  });

  describe('ngOnInit', () => {
    it('should create subscriptions', () => {
      actionsObject.pipe.and.callFake(() => of({}));
      routerStoreSpyObject.pipe.and.returnValue(of({}));
      userStoreSpyObject.pipe.and.returnValue(of({}));
      component.ngOnInit();
      expect(component.userSubscription).toBeTruthy();
      expect(component.suspendSuccessSubscription).toBeTruthy();
      expect(component.ogdUpdateRefreshUserEnabled).toBe(true);
      expect(userStoreSpyObject.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
        payload: jasmine.objectContaining({ currentTime: jasmine.any(Number) }),
        type: fromStore.CHECK_USER_LIST_LOADED
      }));
      expect(userStoreSpyObject.dispatch).toHaveBeenCalledWith(new fromStore.LoadUserDetails('user-1'));
      expect(routerStoreSpyObject.dispatch).toHaveBeenCalledWith(new fromRoot.Go({ path: ['service-down'] }));
    });

    it('should use the manage route and list mandatory and enabled access types', () => {
      const accessTypes: OrganisationAccessType[] = [
        createAccessType({ accessTypeId: 'mandatory', accessMandatory: true, display: false, description: 'Mandatory' }),
        createAccessType({ accessTypeId: 'enabled', display: true, description: 'Enabled' }),
        createAccessType({ accessTypeId: 'hidden', display: false, description: 'Hidden' }),
        createAccessType({ accessTypeId: 'disabled', display: true, description: 'Disabled' }),
        createAccessType({ accessTypeId: 'other-profile', organisationProfileId: 'profile-2', display: true, description: 'Other profile' })
      ];
      const jurisdictions: Jurisdiction[] = [{
        jurisdictionId: 'jurisdiction-1',
        jurisdictionName: 'Jurisdiction',
        accessTypes
      }];
      const user = {
        status: 'Active',
        roles: ['pui-case-manager'],
        userAccessTypes: [
          { jurisdictionId: 'jurisdiction-1', organisationProfileId: 'profile-1', accessTypeId: 'enabled', enabled: true },
          { jurisdictionId: 'jurisdiction-1', organisationProfileId: 'profile-1', accessTypeId: 'disabled', enabled: false },
          { jurisdictionId: 'jurisdiction-1', organisationProfileId: 'profile-1', accessTypeId: 'other-profile', enabled: true }
        ]
      };

      actionsObject.pipe.and.returnValue(of());
      routerStoreSpyObject.pipe.and.returnValues(of(true), of(true));
      userStoreSpyObject.pipe.and.returnValues(of(false), of(user));
      orgStoreSpyObject.pipe.and.returnValue(of(jurisdictions));

      component.ngOnInit();

      expect(component.editPermissionRouter).toBe('manage');
      expect(component.userAccessTypes).toEqual([
        'Jurisdiction - Mandatory',
        'Jurisdiction - Enabled'
      ]);
      expect(component.actionButtons.length).toBe(1);
      component.actionButtons[0].action();
      expect(component.isSuspendView()).toBeTrue();
    });

    it('should use the edit permission route when only the edit feature is enabled', () => {
      actionsObject.pipe.and.returnValue(of());
      routerStoreSpyObject.pipe.and.returnValues(of(true), of(false));
      userStoreSpyObject.pipe.and.returnValues(of(false), of({ status: 'Pending', roles: ['pui-case-manager'] }));

      component.ngOnInit();

      expect(component.editPermissionRouter).toBe('editpermission');
      expect(component.userAccessTypes).toEqual([]);
    });

    it('should leave the edit route empty and omit access types when features or roles are unavailable', () => {
      actionsObject.pipe.and.returnValue(of());
      routerStoreSpyObject.pipe.and.returnValues(of(false), of(false));
      userStoreSpyObject.pipe.and.returnValues(of(false), of({ status: 'Active' }));

      component.ngOnInit();

      expect(component.editPermissionRouter).toBe('');
      expect(component.userAccessTypes).toEqual([]);
    });

    it('should handle a case manager without configured user access types', () => {
      actionsObject.pipe.and.returnValue(of());
      routerStoreSpyObject.pipe.and.returnValues(of(false), of(true));
      userStoreSpyObject.pipe.and.returnValues(of(false), of({
        status: 'Active',
        roles: ['pui-case-manager']
      }));

      component.ngOnInit();

      expect(component.userAccessTypes).toEqual([]);
    });
  });

  describe('ngOnInit with store data', () => {
    const organisationAccessTypes = [
      {
        jurisdictionName: 'Civil',
        accessTypes: [
          { accessTypeId: 'mandatory', organisationProfileId: 'P1', accessMandatory: true, display: false, description: 'Mandatory access' },
          { accessTypeId: 'enabled', organisationProfileId: 'P1', accessMandatory: false, display: true, description: 'Enabled access' },
          { accessTypeId: 'disabled', organisationProfileId: 'P1', accessMandatory: false, display: true, description: 'Disabled access' },
          { accessTypeId: 'hidden', organisationProfileId: 'P1', accessMandatory: false, display: false, description: 'Hidden access' },
          { accessTypeId: 'enabled', organisationProfileId: 'OTHER', accessMandatory: false, display: true, description: 'Other profile' }
        ]
      },
      {
        jurisdictionName: 'Family',
        accessTypes: [
          { accessTypeId: 'family', organisationProfileId: 'P2', accessMandatory: false, display: true, description: 'Family access' }
        ]
      }
    ];

    const caseManager = {
      status: 'Active',
      roles: ['pui-case-manager'],
      userAccessTypes: [
        { accessTypeId: 'enabled', organisationProfileId: 'P1', enabled: true, jurisdictionId: 'CIVIL' },
        { accessTypeId: 'disabled', organisationProfileId: 'P1', enabled: false, jurisdictionId: 'CIVIL' },
        { accessTypeId: 'hidden', organisationProfileId: 'P1', enabled: true, jurisdictionId: 'CIVIL' },
        { accessTypeId: 'family', organisationProfileId: 'P2', enabled: true, jurisdictionId: 'FAMILY' }
      ]
    };

    function setupStores(options: { user: any, editEnabled?: boolean, ogdEnabled?: boolean, accessTypes?: any[], actions?: any[] }) {
      const { user, editEnabled = false, ogdEnabled = false, accessTypes = organisationAccessTypes, actions = [of(), of()] } = options;
      orgStoreSpyObject.pipe.and.returnValue(of(accessTypes));
      // order: getEditUserFeatureIsEnabled, getOgdInviteUserFlowFeatureIsEnabled
      routerStoreSpyObject.pipe.and.returnValues(of(editEnabled), of(ogdEnabled));
      // order: getGetUserLoading, getUserDetails
      userStoreSpyObject.pipe.and.returnValues(of(false), of(user));
      // order: SUSPEND_USER_SUCCESS, SUSPEND_USER_FAIL
      actionsObject.pipe.and.returnValues(...actions);
    }

    it('should dispatch CheckUserListLoaded and LoadUserDetails with route userId', () => {
      activeRoute.snapshot.params = { userId: 'user-123' };
      setupStores({ user: caseManager });
      component.ngOnInit();
      expect(userStoreSpyObject.dispatch).toHaveBeenCalledWith(new fromStore.CheckUserListLoaded());
      expect(userStoreSpyObject.dispatch).toHaveBeenCalledWith(new fromStore.LoadUserDetails('user-123'));
      expect(component.userId).toBe('user-123');
    });

    it('should list mandatory and enabled displayable access types for a case manager when OGD flow is enabled', () => {
      setupStores({ user: caseManager, ogdEnabled: true });
      component.ngOnInit();
      expect(component.userAccessTypes).toEqual([
        'Civil - Mandatory access',
        'Civil - Enabled access',
        'Family - Family access'
      ]);
    });

    it('should only list mandatory access types when user has no userAccessTypes', () => {
      setupStores({ user: { ...caseManager, userAccessTypes: undefined }, ogdEnabled: true });
      component.ngOnInit();
      expect(component.userAccessTypes).toEqual(['Civil - Mandatory access']);
    });

    it('should not list access types when OGD flow is disabled', () => {
      setupStores({ user: caseManager, ogdEnabled: false });
      component.ngOnInit();
      expect(component.userAccessTypes).toEqual([]);
    });

    it('should not list access types when user is not a case manager', () => {
      setupStores({ user: { ...caseManager, roles: ['pui-user-manager'] }, ogdEnabled: true });
      component.ngOnInit();
      expect(component.userAccessTypes).toEqual([]);
    });

    it('should not list access types when user has no roles', () => {
      setupStores({ user: { status: 'Active' }, ogdEnabled: true });
      component.ngOnInit();
      expect(component.userAccessTypes).toEqual([]);
    });

    it('should not list access types when user is null', () => {
      setupStores({ user: null, ogdEnabled: true });
      component.ngOnInit();
      expect(component.userAccessTypes).toEqual([]);
      expect(component.user).toBeUndefined();
    });

    it('should set editPermissionRouter to "manage" when OGD flow is enabled', () => {
      setupStores({ user: caseManager, editEnabled: true, ogdEnabled: true });
      component.ngOnInit();
      expect(component.editPermissionRouter).toBe('manage');
    });

    it('should set editPermissionRouter to "editpermission" when only edit user feature is enabled', () => {
      setupStores({ user: caseManager, editEnabled: true, ogdEnabled: false });
      component.ngOnInit();
      expect(component.editPermissionRouter).toBe('editpermission');
    });

    it('should set editPermissionRouter to empty when both features are disabled', () => {
      setupStores({ user: caseManager });
      component.ngOnInit();
      expect(component.editPermissionRouter).toBe('');
    });

    it('should set user and suspend action button for active user when edit feature is enabled', () => {
      setupStores({ user: caseManager, editEnabled: true });
      component.ngOnInit();
      expect(component.user.status).toBe('Active');
      expect(component.user.resendInvite).toBeFalse();
      expect(component.actionButtons.length).toBe(1);
      expect(component.actionButtons[0].name).toBe('Suspend account');
      expect(component.actionButtons[0].action).toBe(component.showSuspendView);
    });

    it('should hide suspend view on SUSPEND_USER_SUCCESS', () => {
      setupStores({ user: caseManager, actions: [of({ type: fromStore.SUSPEND_USER_SUCCESS }), of()] });
      component.suspendViewFlag = true;
      component.ngOnInit();
      expect(component.suspendViewFlag).toBeFalse();
    });

    it('should navigate to service-down on SUSPEND_USER_FAIL', () => {
      setupStores({ user: caseManager, actions: [of(), of({ type: fromStore.SUSPEND_USER_FAIL })] });
      component.ngOnInit();
      expect(routerStoreSpyObject.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
        payload: jasmine.objectContaining({ path: ['service-down'] })
      }));
    });

    it('should stop updating access types after ngOnDestroy', () => {
      const user$ = new BehaviorSubject<any>(caseManager);
      orgStoreSpyObject.pipe.and.returnValue(of(organisationAccessTypes));
      routerStoreSpyObject.pipe.and.returnValues(of(false), of(true));
      userStoreSpyObject.pipe.and.returnValues(of(false), user$);
      actionsObject.pipe.and.returnValues(of(), of());
      component.ngOnInit();
      expect(component.userAccessTypes.length).toBe(3);

      component.ngOnDestroy();
      user$.next({ ...caseManager, roles: [] });
      expect(component.userAccessTypes.length).toBe(3);
    });

    it('should set ogdUpdateRefreshUserEnabled to false when not configured', () => {
      component = new UserDetailsComponent(userStoreSpyObject, routerStoreSpyObject, orgStoreSpyObject, actionsObject, activeRoute, {} as EnvironmentConfig);
      setupStores({ user: caseManager });
      component.ngOnInit();
      expect(component.ogdUpdateRefreshUserEnabled).toBeFalse();
    });
  });

  describe('getDependencyObservables', () => {
    it('should return Observable', () => {
      routerStoreSpyObject.pipe.and.returnValue(of({}));
      userStoreSpyObject.pipe.and.returnValue(of(false));
      component.getDependencyObservables(routerStoreSpyObject, userStoreSpyObject).subscribe(([route, users]) => {
        expect(users).toBe(false);
        expect(route).not.toBeUndefined();
      });
    });
  });

  describe('isSuspended', () => {
    it('should return suspended state', () => {
      expect(component.isSuspended('Suspended')).toBe(true);
      expect(component.isSuspended('Active')).toBe(false);
    });
  });

  describe('isSuspendView', () => {
    it('should return state of suspended state flag', () => {
      expect(component.isSuspendView()).toBe(false);
    });
  });

  describe('hideSuspendView', () => {
    it('should set state of suspended state flag to false', () => {
      component.setSuspendViewFunctions();
      component.hideSuspendView();
      expect(component.suspendViewFlag).toBe(false);
    });
  });

  describe('showSuspendView', () => {
    it('should set state of suspended state flag to true', () => {
      component.setSuspendViewFunctions();
      component.showSuspendView();
      expect(component.suspendViewFlag).toBe(true);
      expect(component.isSuspendView()).toBe(true);
    });
  });

  describe('handleUserSubscription', () => {
    it('should set actionButtons when user is Active', () => {
      component.handleUserSubscription({ status: 'Active' }, of(true));
      const mockButtons = [
        {
          name: 'Suspend account',
          class: 'hmcts-button--secondary',
          action: undefined
        }
      ];
      expect(component.actionButtons).toEqual(mockButtons);
    });

    it('should not set actionButtons when user is Suspended', () => {
      component.handleUserSubscription({ status: 'Suspended' }, of(true));
      expect(component.actionButtons).toBeNull();
    });

    it('should clear actionButtons when the feature is disabled or the user is unavailable', () => {
      component.handleUserSubscription({ status: 'Active' }, of(false));
      expect(component.actionButtons).toBeNull();

      component.user = undefined;
      component.handleUserSubscription(undefined, of(true));
      expect(component.actionButtons).toBeNull();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from observables when subscribed', () => {
      component.userSubscription = new Observable().subscribe();
      component.suspendSuccessSubscription = new Observable().subscribe();
      component.suspendUserServerErrorSubscription = new Observable().subscribe();
      const componentUserSubscriptionUnsubscribeSpy = spyOn(component.userSubscription, 'unsubscribe');
      const componentSuspendSuccessSubscriptionUnsubscribeSpy = spyOn(component.suspendSuccessSubscription, 'unsubscribe');
      const componentSuspendErrorSubscriptionUnsubscribeSpy = spyOn(component.suspendUserServerErrorSubscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(componentUserSubscriptionUnsubscribeSpy).toHaveBeenCalled();
      expect(componentSuspendSuccessSubscriptionUnsubscribeSpy).toHaveBeenCalled();
      expect(componentSuspendErrorSubscriptionUnsubscribeSpy).toHaveBeenCalled();
    });

    it('should not unsubscribe from observables when not subscribed', () => {
      component.userSubscription = new Observable().subscribe();
      component.suspendSuccessSubscription = new Observable().subscribe();
      const componentUserSubscriptionUnsubscribeSpy = spyOn(component.userSubscription, 'unsubscribe');
      const componentSuspendSuccessSubscriptionUnsubscribeSpy = spyOn(component.suspendSuccessSubscription, 'unsubscribe');
      component.suspendUserServerErrorSubscription = new Observable().subscribe();
      const componentSuspendErrorSubscriptionUnsubscribeSpy = spyOn(component.suspendUserServerErrorSubscription, 'unsubscribe');
      component.userSubscription = undefined;
      component.suspendSuccessSubscription = undefined;
      component.suspendUserServerErrorSubscription = undefined;
      component.ngOnDestroy();
      expect(componentUserSubscriptionUnsubscribeSpy).not.toHaveBeenCalled();
      expect(componentSuspendSuccessSubscriptionUnsubscribeSpy).not.toHaveBeenCalled();
      expect(componentSuspendErrorSubscriptionUnsubscribeSpy).not.toHaveBeenCalled();
    });
  });

  describe('suspendUser', () => {
    it('should dispatch an action', () => {
      const mockUser: User = {
        routerLink: '',
        fullName: 'name',
        email: 'someemail',
        status: 'active',
        resendInvite: false,
        userIdentifier: ''
      };
      component.suspendUser(mockUser);
      expect(userStoreSpyObject.dispatch).toHaveBeenCalledWith(new fromStore.SuspendUser(mockUser));
    });
  });

  describe('status helpers', () => {
    it('should identify inactive and pending users', () => {
      expect(component.isInactive('Active')).toBeTrue();
      expect(component.isInactive('Suspended')).toBeFalse();
      expect(component.isInactive('Locked', ['Locked'])).toBeFalse();
      expect(component.isPending('Pending')).toBeTrue();
      expect(component.isPending('Active')).toBeFalse();
    });
  });

  describe('reinviteUser', () => {
    it('should dispatch reinvite pending user action', () => {
      const mockUser: User = {
        routerLink: '',
        fullName: 'name',
        email: 'someemail',
        status: 'Pending',
        resendInvite: true,
        userIdentifier: 'user-1'
      };

      component.reinviteUser(mockUser);

      expect(userStoreSpyObject.dispatch).toHaveBeenCalledWith(new fromStore.ReinvitePendingUser(mockUser));
    });
  });

  describe('handleUserSubscription', () => {
    it('should set resend invite when user is Pending', () => {
      component.handleUserSubscription({ status: 'Pending' }, of(false));

      expect(component.user.resendInvite).toBeTrue();
      expect(component.actionButtons).toBeNull();
    });
  });
});

function createAccessType(overrides: Partial<OrganisationAccessType> = {}): OrganisationAccessType {
  return {
    organisationProfileId: 'profile-1',
    accessTypeId: 'access-type-1',
    accessMandatory: false,
    accessDefault: false,
    display: false,
    description: 'Access type',
    hint: '',
    displayOrder: 1,
    ...overrides
  };
}
