import { EditUserPermissionComponent } from './edit-user-permission.component';
import { Observable, of } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { select, Store, StoreModule } from '@ngrx/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as fromStore from '../../store';
import { User } from '@hmcts/rpx-xui-common-lib';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersListState } from 'src/users/store/reducers/users.reducer';

fdescribe('Edit User Permission Component Component', () => {

    let component: EditUserPermissionComponent;
    let userStoreSpyObject;
    let routerStoreSpyObject;
    let actionsObject;
    let mockStore: any;

    let fixture: ComponentFixture<EditUserPermissionComponent>;
    let superNgOnDestroy: jasmine.Spy;
    let store: Store<UsersListState>;
    const userList = [
        {
            firstName: 'Test1firstname',
            lastName: 'Test1lastname',
            email: 'somthing1@something',
            status: 'active',
            roles: 'pui-caa',
            userIdentifier: 'userId1',
            manageOrganisations: true,
            manageUsers: true,
            manageCases: true,
        },
        {
            firstName: 'Test2fggftfirstname',
            lastName: 'Test2gfgtlastname',
            email: 'somthing2@somffgething',
            status: 'active',
            roles: 'blabfgfgla',
            userIdentifier: 'userId2',
            manageOrganisations: false,
            manageUsers: false,
            manageCases: false,
        }
    ];

    const initialState = {
        users : {
            invitedUsers: {
                userList: userList,
                loaded: false,
                loading: false,
                reinvitePendingUser: null,  
                editUserFailure: false,
              },
            inviteUser: {
                inviteUserFormData: {},
                errorMessages: { message: 'test error'},
                isFormValid: true,
                errorHeader: '',
                isUserConfirmed: false,
                invitedUserEmail: '',
              }
          }
    };

    beforeEach(() => {
       // mockStore = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);
         userStoreSpyObject = jasmine.createSpyObj('Store', ['pipe', 'select', 'dispatch']);
        // routerStoreSpyObject = jasmine.createSpyObj('Store', ['pipe', 'select', 'dispatch']);
        // actionsObject = jasmine.createSpyObj('Actions', ['pipe']);
       // component = new EditUserPermissionComponent(userStoreSpyObject, routerStoreSpyObject, actionsObject);
    
        let actions$ = of (
        [
            fromStore.EDIT_USER_SUCCESS, fromStore.EDIT_USER_SERVER_ERROR
        ]);
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                RouterTestingModule, ReactiveFormsModule
            ],
            declarations: [EditUserPermissionComponent],
            providers: [
            // provideMockStore({                    
            //     initialState
            // }),
            {
                provide: Store,
                useValue: userStoreSpyObject
            },
            provideMockActions(() => actions$),
            {
                provide: ActivatedRoute,
                useValue: {
                    snapshot: {
                        params: {
                            userId: 'userId1'
                        },
                    }
                }
            }]  
        })
        .compileComponents();
        userStoreSpyObject = TestBed.get(Store);
        userStoreSpyObject.select.and.returnValue(
           of({
            users : {
                invitedUsers: {
                    userList: userList,
                    loaded: false,
                    loading: false,
                    reinvitePendingUser: null,  
                    editUserFailure: false,
                  },
                inviteUser: {
                    inviteUserFormData: {},
                    errorMessages: { message: 'test error'},
                    isFormValid: true,
                    errorHeader: '',
                    isUserConfirmed: false,
                    invitedUserEmail: '',
                  }
              }
           }));

        fixture = TestBed.createComponent(EditUserPermissionComponent);
        component = fixture.componentInstance;
        
        superNgOnDestroy = spyOn(EditUserPermissionComponent.prototype, 'ngOnDestroy');
        
        spyOn(component, 'getFormGroup').and.returnValue(true);
        spyOn(component, 'getIsPuiCaseManager').and.returnValue(true);
        spyOn(component, 'getIsPuiOrganisationManager').and.returnValue(true);
        spyOn(component, 'getIsPuiUserManager').and.returnValue(true);
        spyOn(component, 'getIsPuiFinanceManager').and.returnValue(true);
        spyOn(component, 'getIsCaseAccessAdmin').and.returnValue(true);
        fixture.detectChanges();
    });
      

    describe('EditUserPermissionComponent is Truthy', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });
    });

    // describe('EditUserPermissionComponent', () => {
    //     it('getbackUrl', () => {
    //         expect(component.getBackurl('userId1')).toEqual('/users/user/userId1');
    //     });
    // });

    // describe('EditUserPermissionComponent', () => {
    //     it('getIsPuiCaseManager', () => {
    //         const user = {manageCases: 'Yes'};
    //         expect(component.getIsPuiCaseManager(user)).toEqual(true);
    //     });
    // });

    // describe('EditUserPermissionComponent', () => {
    //     it('getIsPuiOrganisationManager', () => {
    //         const user = {manageOrganisations: 'Yes'};
    //         expect(component.getIsPuiOrganisationManager(user)).toEqual(true);
    //     });
    // });

    // describe('EditUserPermissionComponent', () => {
    //     it('getIsPuiUserManager', () => {
    //         const user = {manageUsers: 'Yes'};
    //         expect(component.getIsPuiUserManager(user)).toEqual(true);
    //     });
    // });

    // describe('EditUserPermissionComponent', () => {
    //     it('unsubscribe', () => {
    //         const subscription = jasmine.createSpyObj('subscription', ['unsubscribe']);
    //         expect(component.unsubscribe(subscription));
    //         expect(subscription.unsubscribe).toHaveBeenCalled();
    //     });
    // });
});
