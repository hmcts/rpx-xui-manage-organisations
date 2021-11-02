import { EditUserPermissionComponent } from './edit-user-permission.component';
import * as fromStore from '../../store';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

describe('Edit User Permission Component Component', () => {
    let component: EditUserPermissionComponent;
    let userStoreSpyObject;
    let fixture: ComponentFixture<EditUserPermissionComponent>;

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
                userList,
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

    beforeEach(async () => {
        userStoreSpyObject = jasmine.createSpyObj('Store', ['pipe', 'select', 'dispatch']);
        const actions$ = of (
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
                provideMockStore({
                    initialState
                }),
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
        }).compileComponents();
        fixture = TestBed.createComponent(EditUserPermissionComponent);
        component = fixture.componentInstance;
        component.user$ = of(userList[0]);
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

        it('getbackUrl', () => {
            expect(component.getBackurl('userId1')).toEqual('/users/user/userId1');
        });

        it('getIsPuiCaseManager', () => {
            expect(component.getIsPuiCaseManager).toHaveBeenCalled();
        });

        it('getIsPuiOrganisationManager', () => {
            expect(component.getIsPuiOrganisationManager).toHaveBeenCalled();
        });

        it('getIsPuiUserManager', () => {
            expect(component.getIsPuiUserManager).toHaveBeenCalled();
        });
    });
});
