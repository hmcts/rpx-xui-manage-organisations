import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AcceptTcWrapperComponent } from './accept-tc-wrapper.component';

describe('Accept Tc Wrapper Component', () => {
    let component: AcceptTcWrapperComponent;
    let mockStore: any;
    let mockActions: any;

    class TestAction implements Action {
        type: string;
    }

    beforeEach(() => {
        mockStore = jasmine.createSpyObj('mockStore', ['unsubscribe', 'dispatch', 'pipe']);
        mockActions = jasmine.createSpyObj('mockActions', ['pipe']);
        component = new AcceptTcWrapperComponent(mockStore, mockActions);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should unsubscribe', () => {
        component.subscription = new Observable().subscribe();
        component.uidSubscription = new Observable().subscribe();
        spyOn(component.subscription, 'unsubscribe').and.callThrough();
        spyOn(component.uidSubscription, 'unsubscribe').and.callThrough();
        component.ngOnDestroy();
        expect(component.subscription.unsubscribe).toHaveBeenCalled();
        expect(component.uidSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('should dispatchAction', () => {
        const action = new TestAction();
        component.dispatchAction(mockStore, action);
        expect(mockStore.dispatch).toHaveBeenCalledWith(action);
    });

    it('should getObservable', () => {
        component.getObservable(mockActions, 'Some Action');
        expect(mockActions.pipe).toHaveBeenCalled();
    });

    it('should onAcceptTandC', () => {
        component.onAcceptTandC();
        expect(mockStore.dispatch).toHaveBeenCalled();
    });
});
