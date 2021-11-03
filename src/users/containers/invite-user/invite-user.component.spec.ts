import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '@hmcts/rpx-xui-common-lib';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { InviteUserComponent } from './invite-user.component';
import * as fromAppStore from '../../../app/store';
import * as fromStore from '../../store';

describe('Invite User Component', () => {
    let component: InviteUserComponent;
    let mockStore: any;
    let fixture: ComponentFixture<InviteUserComponent>;
    let superNgOnDestroy: jasmine.Spy;

    const initialState = {
        users : {
            invitedUsers: {
                userList: [] as User[],
                loaded: false,
                loading: false,
                reinvitePendingUser: null,
                editUserFailure: false
              },
            inviteUser: {
                inviteUserFormData: {},
                errorMessages: { message: 'test error'},
                isFormValid: true,
                errorHeader: '',
                isUserConfirmed: false,
                invitedUserEmail: ''
              }
          }
    };

    beforeEach(() => {
        mockStore = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);
        const actions$ = of (
          [
            fromStore.INVITE_USER_FAIL_WITH_400, fromStore.INVITE_USER_FAIL_WITH_404,
            fromStore.INVITE_USER_FAIL_WITH_500, fromStore.INVITE_USER_FAIL_WITH_429,
            fromStore.INVITE_USER_FAIL_WITH_409, fromStore.INVITE_USER_FAIL,
            fromAppStore.LOAD_JURISDICTIONS_GLOBAL
          ]);
        TestBed.configureTestingModule({
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          imports: [
            RouterTestingModule,
          ],
          declarations: [InviteUserComponent],
          providers: [
            provideMockStore({initialState}),
            provideMockActions(() => actions$),
            {
              provide: ActivatedRoute,
              useValue: {
                snapshot: {
                    params: {
                        cid: '1234'
                    },
                }
              }
            }
          ]
        })
        .compileComponents();
        fixture = TestBed.createComponent(InviteUserComponent);
        component = fixture.componentInstance;
        superNgOnDestroy = spyOn(InviteUserComponent.prototype, 'ngOnDestroy');

        spyOn(component, 'initialiseUserForm').and.callThrough();
        spyOn(component, 'dispathAction').and.callThrough();
        fixture.detectChanges();
    });

    it('Is Truthy', () => {
        expect(component).toBeTruthy();
    });

    it('unsubscribe', () => {
        const mockSubscription = jasmine.createSpyObj('subscription', ['unsubscribe']);
        component.unSubscribe(mockSubscription);
        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('getBackLink', () => {
        let link = component.getBackLink(null);
        expect(link).toEqual('/users');

        const user = {
            routerLink: '',
            fullName: 'name',
            email: 'someemail',
            status: 'active',
            resendInvite: false,
            userIdentifier: 'id1234'
          };
        link = component.getBackLink(user);
        expect(link).toEqual('/users/user/id1234');
    });

    it('dispathAction', () => {
        const mockAction = jasmine.createSpyObj('action', ['payload']);
        mockStore = jasmine.createSpyObj('store', ['dispatch']);
        component.dispathAction(mockAction, mockStore);
        expect(mockStore.dispatch).toHaveBeenCalledWith(mockAction);
    });

    it('global error 400', () => {
        const globalError = component.getGlobalError(400);
        expect(globalError.header).toEqual('Sorry, there is a problem');
    });

    it('global error 404', () => {
        const globalError = component.getGlobalError(404);
        expect(globalError.header).toEqual('Sorry, there is a problem with this account');
    });

    it('global error 500', () => {
        const globalError = component.getGlobalError(500);
        expect(globalError.header).toEqual('Sorry, there is a problem with the service');
    });

    it('global error 999', () => {
        const globalError = component.getGlobalError(999);
        expect(globalError).toEqual(undefined);
    });

    it('should call initialiseUserForm', () => {
        expect(component.initialiseUserForm).toHaveBeenCalled();
    });

    it('should call dispathAction', () => {
        expect(component.dispathAction).toHaveBeenCalled();
    });

    afterEach(() => {
      fixture.destroy();
    });
});
