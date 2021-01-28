import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import * as fromRoot from '../../../app/store';
import { checkboxesBeCheckedValidator } from '../../../custom-validators/checkboxes-be-checked.validator';
import * as fromStore from '../../store';
import { UserRolesUtil } from '../utils/user-roles-util';
import {editUserFailureSelector} from '../../store/selectors';

@Component({
    selector: 'app-edit-user-permission',
    templateUrl: './edit-user-permission.component.html',
  })
  export class EditUserPermissionComponent  implements OnInit, OnDestroy {
    public editUserForm: FormGroup;
    public errorMessages = {
      header: 'There is a problem',
      roles: ['You must select at least one action'],
    };
    public user$: Observable<any>;
    public isLoading$: Observable<boolean>;
    public user: any;
    public isPuiCaseManager: boolean;
    public isPuiOrganisationManager: boolean;
    public isPuiUserManager: boolean;
    public isPuiFinanceManager: boolean;
    public isCaseAccessAdmin: boolean;
    public userId: string;

    public userSubscription: Subscription;
    public dependanciesSubscription: Subscription;
    public editPermissionSuccessSubscription: Subscription;
    public editPermissionServerErrorSubscription: Subscription;
    public backUrl: string;

    public summaryErrors: {isFromValid: boolean; items: { id: string; message: any; }[]; header: string};
    public permissionErrors: {isInvalid: boolean; messages: string[] };

    constructor(
      private readonly userStore: Store<fromStore.UserState>,
      private readonly routerStore: Store<fromRoot.State>,
      private readonly actions$: Actions
    ) { }

    public ngOnInit(): void {

      this.editPermissionSuccessSubscription = this.actions$.pipe(ofType(fromStore.EDIT_USER_SUCCESS)).subscribe(() => {
        this.routerStore.dispatch(new fromRoot.Go({ path: [`users/user/${this.userId}`] }));
      });

      this.editPermissionServerErrorSubscription = this.actions$.pipe(ofType(fromStore.EDIT_USER_SERVER_ERROR)).subscribe(() => {
        this.routerStore.dispatch(new fromRoot.Go({ path: [`service-down`] }));
      });

      this.userStore.select(editUserFailureSelector).subscribe(editUserFailure => {
        if (editUserFailure) {
          this.routerStore.dispatch(new fromRoot.Go({ path: [`users/user/${this.userId}/editpermission-failure`] }));
        }
      });

      this.isLoading$ = this.userStore.pipe(select(fromStore.getGetUserLoading));

      this.dependanciesSubscription = combineLatest([
      this.routerStore.pipe(select(fromRoot.getRouterState)),
      this.userStore.pipe(select(fromStore.getGetUserLoaded))
    ]).subscribe(([route, users]) => {
      if (!users) {
        this.userStore.dispatch(new fromStore.LoadUsers());
      }
      this.userId = route.state.params.userId;
      this.user$ = this.userStore.pipe(select(fromStore.getGetSingleUser, { userIdentifier: this.userId }));
      this.backUrl = this.getBackurl(this.userId);
    });

      this.userSubscription = this.user$.subscribe((user) => {
        this.user = user;
        this.isPuiCaseManager = this.getIsPuiCaseManager(user);
        this.isPuiOrganisationManager = this.getIsPuiOrganisationManager(user);
        this.isPuiUserManager = this.getIsPuiUserManager(user);
        this.isPuiFinanceManager = this.getIsPuiFinanceManager(user);
        this.isCaseAccessAdmin = this.getIsCaseAccessAdmin(user);

        this.editUserForm = this.getFormGroup(this.isPuiCaseManager,
          this.isPuiUserManager, this.isPuiOrganisationManager, this.isPuiFinanceManager, this.isCaseAccessAdmin,
          checkboxesBeCheckedValidator);
      });

    }

  public getBackurl(userId: string) {
    return `/users/user/${userId}`;
  }

  public getFormGroup(isPuiCaseManager, isPuiUserManager, isPuiOrganisationManager, isPuiFinanceManager, isCaseAccessAdmin, validator: any): FormGroup {
    return new FormGroup({
      roles: new FormGroup({
        'pui-case-manager': new FormControl(isPuiCaseManager),
        'pui-user-manager': new FormControl(isPuiUserManager),
        'pui-organisation-manager': new FormControl(isPuiOrganisationManager),
        'pui-finance-manager': new FormControl(isPuiFinanceManager),
        'pui-caa': new FormControl(isCaseAccessAdmin)
      }, checkboxesBeCheckedValidator())
    });
  }

  public getIsPuiCaseManager(user: any): boolean {
    return user && user.manageCases === 'Yes';
  }

  public getIsPuiOrganisationManager(user: any): boolean {
    return user && user.manageOrganisations === 'Yes';
  }

  public getIsPuiUserManager(user: any): boolean {
    return user && user.manageUsers === 'Yes';
  }

  public getIsCaseAccessAdmin(user: any): boolean {
    return user && user.roles && user.roles.includes('pui-caa');
  }

  public getIsPuiFinanceManager(user: any): boolean {
    return user && user.managePayments === 'Yes';
  }

  public unsubscribe(subscription: Subscription) {
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  public ngOnDestroy() {
    this.unsubscribe(this.userSubscription);
    this.unsubscribe(this.dependanciesSubscription);
  }

  public onSubmit() {
    if (!this.editUserForm.valid) {
      this.summaryErrors = { isFromValid: false, items: [{id: 'roles',
      message: this.errorMessages.roles[0] }], header: this.errorMessages.header};
      this.permissionErrors = { isInvalid: true, messages: [this.errorMessages.roles[0]]};
      return;
    }

    const {value} = this.editUserForm;
    const permissions = UserRolesUtil.mapPermissions(value);
    const rolesAdded = UserRolesUtil.getRolesAdded(this.user, permissions);
    const rolesDeleted = UserRolesUtil.getRolesDeleted(this.user, permissions);
    const editUserRolesObj = UserRolesUtil.mapEditUserRoles(this.user, rolesAdded, rolesDeleted);
    if (rolesAdded.length > 0 || rolesDeleted.length > 0) {
      this.userStore.dispatch(new fromStore.EditUser({editUserRolesObj, userId: this.userId}));
    } else {
     /* tslint:disable-next-line */
      this.summaryErrors = { isFromValid: false, items: [{id: 'roles', message: 'You need to make a change before submitting. If you don\'t make a change, these permissions will stay the same' }],
      header: this.errorMessages.header};
      /* tslint:disable-next-line */
      this.permissionErrors = { isInvalid: true, messages: ['You need to make a change before submitting. If you don\'t make a change, these permissions will stay the same' ]};
      /* tslint:disable-next-line */
      return this.userStore.dispatch(new fromStore.EditUserFailure('You need to make a change before submitting. If you don\'t make a change, these permissions will stay the same'));
    }
  }
}
