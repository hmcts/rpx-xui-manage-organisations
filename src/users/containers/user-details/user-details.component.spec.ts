import { UserDetailsComponent } from './user-details.component';
import { Observable } from 'rxjs';

describe('User Details Component', () => {

    let component: UserDetailsComponent;
    let userStoreSpyObject;
    let routerStoreSpyObject;

    beforeEach(() => {
        userStoreSpyObject = jasmine.createSpyObj('Store', ['pipe', 'select', 'dispatch']);
        routerStoreSpyObject = jasmine.createSpyObj('Store', ['pipe', 'select', 'dispatch']);
        component = new UserDetailsComponent(userStoreSpyObject, routerStoreSpyObject);
    });

    describe('ngOnInit', () => {
        it('should create subscriptions', () => {
            component.ngOnInit();
            expect(component.dependanciesSubscription).toBeDefined();
            expect(component.userSubscription).toBeDefined();
        });
    });

    describe('dispatchGetUsers', () => {
        it('should load users when there are none', () => {
            component.dispatchGetUsers(false, userStoreSpyObject);
            expect(userStoreSpyObject.dispatch).toHaveBeenCalled();
        });

        it('should not load users when they exist', () => {
            component.dispatchGetUsers(true, userStoreSpyObject);
            expect(userStoreSpyObject.dispatch).not.toHaveBeenCalled();
        });
    });

    describe('getUserObservable', () => {
        it('should return user', () => {
            component.getUserObservable('user', userStoreSpyObject);
            expect(userStoreSpyObject.pipe).toHaveBeenCalled();
        });
    });

    describe('getDependancyObservables', () => {
        it('should return Observable', () => {
            component.getDependancyObservables(routerStoreSpyObject, userStoreSpyObject).subscribe(([route, users]) => {
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
            component.handleUserSubscription({ status: 'Active' });
            expect(component.actionButtons.length).toBe(1);
        });

        it('should not set actionButtons when user is Suspended', () => {
            component.handleUserSubscription({ status: 'Suspended' });
            expect(component.actionButtons.length).toBe(0);
        });
    });

    describe('handleDependanciesSubscription', () => {
        it('should load users when there are none', () => {
            component.handleDependanciesSubscription(false, { state: { params: { userId: 'user' } } });
            expect(userStoreSpyObject.dispatch).toHaveBeenCalled();
        });

        it('should not load users when they exist', () => {
            component.handleDependanciesSubscription(true, { state: { params: { userId: 'user' } } });
            expect(userStoreSpyObject.dispatch).not.toHaveBeenCalled();
        });
    });

    describe('ngOnDestroy', () => {
        it('should unsubscribe from observables when subscribed', () => {
            component.dependanciesSubscription = new Observable().subscribe();
            component.userSubscription = new Observable().subscribe();
            const componentDependanciesSubscriptionUnsubscribeSpy = spyOn(component.dependanciesSubscription, 'unsubscribe');
            const componentUserSubscriptionUnsubscribeSpy = spyOn(component.userSubscription, 'unsubscribe');
            component.ngOnDestroy();
            expect(componentDependanciesSubscriptionUnsubscribeSpy).toHaveBeenCalled();
            expect(componentUserSubscriptionUnsubscribeSpy).toHaveBeenCalled();
        });

        it('should not unsubscribe from observables when not subscribed', () => {
            component.dependanciesSubscription = new Observable().subscribe();
            component.userSubscription = new Observable().subscribe();
            const componentDependanciesSubscriptionUnsubscribeSpy = spyOn(component.dependanciesSubscription, 'unsubscribe');
            const componentUserSubscriptionUnsubscribeSpy = spyOn(component.userSubscription, 'unsubscribe');
            component.dependanciesSubscription = undefined;
            component.userSubscription = undefined;
            component.ngOnDestroy();
            expect(componentDependanciesSubscriptionUnsubscribeSpy).not.toHaveBeenCalled();
            expect(componentUserSubscriptionUnsubscribeSpy).not.toHaveBeenCalled();
        });
    });

});
