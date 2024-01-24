import { User } from '@hmcts/rpx-xui-common-lib';
import { Observable, of } from 'rxjs';
import { UserDetailsComponent } from './user-details.component';
import { Store } from '@ngrx/store';
import * as fromOrgStore from '../../../organisation/store';
import { Jurisdiction } from 'src/models';
import { OrganisationState } from '../../../organisation/store';

fdescribe('User Details Component', () => {
  let component: UserDetailsComponent;
  let userStoreSpyObject;
  let routerStoreSpyObject;
  let orgStoreSpyObject;
  let actionsObject;
  let activeRoute;

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
        params: of({})
      }
    };
    component = new UserDetailsComponent(userStoreSpyObject, routerStoreSpyObject, orgStoreSpyObject, actionsObject, activeRoute);
  });

  describe('ngOnInit', () => {
    it('should create subscriptions', () => {
      actionsObject.pipe.and.callFake(() => of({}));
      routerStoreSpyObject.pipe.and.returnValue(of({}));
      userStoreSpyObject.pipe.and.returnValue(of({}));
      component.ngOnInit();
      expect(component.userSubscription).toBeTruthy();
      expect(component.suspendSuccessSubscription).toBeTruthy();
    });
  });

  describe('getDependencyObservables', () => {
    it('should return Observable', () => {
      routerStoreSpyObject.pipe.and.returnValue(of({}));
      userStoreSpyObject.pipe.and.returnValue(of());
      component.getDependencyObservables(routerStoreSpyObject, userStoreSpyObject).subscribe(([route, users]) => {
        expect(users).toBe(false);
      });
    });
  });

  describe('isSuspended', () => {
    it('should return suspended state', () => {
      expect(component.isSuspended('Suspended')).toBe(true);
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
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from observables when subscribed', () => {
      component.userSubscription = new Observable().subscribe();
      component.suspendSuccessSubscription = new Observable().subscribe();
      const componentUserSubscriptionUnsubscribeSpy = spyOn(component.userSubscription, 'unsubscribe');
      const componentSuspendSuccessSubscriptionUnsubscribeSpy = spyOn(component.suspendSuccessSubscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(componentUserSubscriptionUnsubscribeSpy).toHaveBeenCalled();
      expect(componentSuspendSuccessSubscriptionUnsubscribeSpy).toHaveBeenCalled();
    });

    it('should not unsubscribe from observables when not subscribed', () => {
      component.userSubscription = new Observable().subscribe();
      component.suspendSuccessSubscription = new Observable().subscribe();
      const componentUserSubscriptionUnsubscribeSpy = spyOn(component.userSubscription, 'unsubscribe');
      const componentSuspendSuccessSubscriptionUnsubscribeSpy = spyOn(component.suspendSuccessSubscription, 'unsubscribe');
      component.userSubscription = undefined;
      component.suspendSuccessSubscription = undefined;
      component.ngOnDestroy();
      expect(componentUserSubscriptionUnsubscribeSpy).not.toHaveBeenCalled();
      expect(componentSuspendSuccessSubscriptionUnsubscribeSpy).not.toHaveBeenCalled();
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
      expect(userStoreSpyObject.dispatch).toHaveBeenCalled();
    });
  });
});
