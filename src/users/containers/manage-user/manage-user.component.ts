import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, combineLatest, map, takeUntil } from 'rxjs';

import * as fromRoot from '../../../app/store';
import * as fromStore from '../../store';
import * as fromOrgStore from '../../../organisation/store';
import { User } from '@hmcts/rpx-xui-common-lib';
import { CaseManagementPermissions } from '../../models/case-management-permissions.model';
import { BasicAccessTypes } from '../../models/basic-access-types.model';
import { PersonalDetails } from '../../models/personal-details.model';

import { Jurisdiction, OrganisationDetails } from 'src/models';
import { LoggerService } from 'src/shared/services/logger.service';
import { AppConstants } from '../../../app/app.constants';
import { GlobalError } from '../../../app/store/reducers/app.reducer';
import { StandardUserPermissionsComponent, UserPersonalDetailsComponent } from 'src/users/components';
import { InviteUserService } from 'src/users/services';

import { UserRolesUtil } from '../utils/user-roles-util';
import { editUserFailureSelector } from '../../store';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html'
})
export class ManageUserComponent implements OnInit, OnDestroy {
  @ViewChild('userPersonalDetails')userPersonalDetails: UserPersonalDetailsComponent;
  @ViewChild('standardPermission')standardPermission: StandardUserPermissionsComponent;

  public backUrl: string;
  public userId: string;
  public organisationAccessTypes$: Observable<Jurisdiction[]>;
  public summaryErrorsSubject = new Subject<{ isFromValid: boolean; items: { id: string; message: any; }[]; header: string }>();
  public summaryErrors$ = this.summaryErrorsSubject.asObservable();
  public errorsArray$: Observable<{ isFromValid: boolean; items: { id: string; message: any; } []}>;
  public permissionErrors: { isInvalid: boolean; messages: string[] };
  public user: User;
  public showWarningMessage: boolean = false;
  public resendInvite: boolean = false;
  public combinedErrors$: Observable<{
    isFromValid: boolean;
    items: { id: string; message: any; }[];
    header: string;
  }>;

  public jurisdictions:Jurisdiction[] = [];
  public organisationProfileIds:string[];

  private user$: Observable<User>;
  private organisation$: Observable<OrganisationDetails>;
  public updatedUser: User;
  private onDestory$ = new Subject<void>();

  constructor(private readonly actions$: Actions,
    private readonly routerStore: Store<fromRoot.State>,
    private readonly userStore: Store<fromStore.UserState>,
    private readonly orgStore: Store<fromOrgStore.OrganisationState>,
    private loggerService: LoggerService,
    private inviteUserSvc: InviteUserService) {}

  ngOnInit(): void {
    this.organisationAccessTypes$ = this.orgStore.pipe(select(fromOrgStore.getAccessTypes));
    this.errorsArray$ = this.userStore.pipe(select(fromStore.getGetInviteUserErrorsArray));
    this.combinedErrors$ = combineLatest([
      this.summaryErrors$,
      this.errorsArray$
    ]).pipe(
      map(([summaryErrors, errorsArray]) => {
        return {
          isFromValid: summaryErrors.isFromValid && errorsArray.isFromValid,
          items: [...summaryErrors.items, ...errorsArray.items],
          header: summaryErrors.header
        };
      })
    );
    this.routerStore.pipe(select(fromRoot.getRouterState)).pipe(takeUntil(this.onDestory$)).subscribe((route) => {
      this.userId = route.state.params.userId;
      this.user$ = this.userStore.pipe(select(fromStore.getGetSingleUser));
      this.organisation$ = this.orgStore.pipe(select(fromOrgStore.getOrganisationSel));
      this.backUrl = this.getBackurl(this.userId);
    });

    combineLatest([this.user$, this.organisation$, this.organisationAccessTypes$]).pipe(takeUntil(this.onDestory$)).subscribe(([user, organisation, organisationAccessTypes]) => {
      this.user = user;
      this.organisationProfileIds = organisation.organisationProfileIds ?? [];
      this.resendInvite = user?.status === 'Pending';
      this.jurisdictions = organisationAccessTypes;
    });

    this.actions$.pipe(ofType(fromStore.EDIT_USER_SUCCESS)).subscribe(() => {
      this.routerStore.dispatch(new fromRoot.Go({ path: ['users/updated-user-success'] }));
    });

    this.actions$.pipe(ofType(fromStore.EDIT_USER_SERVER_ERROR)).subscribe(() => {
      this.routerStore.dispatch(new fromRoot.Go({ path: ['service-down'] }));
    });

    this.userStore.select(editUserFailureSelector).subscribe((editUserFailure) => {
      if (editUserFailure) {
        // BJ-TODO: Work out what this path should be
        // Error messages for 501 errors will need to be passed through and displayed? See GA-24
        this.routerStore.dispatch(new fromRoot.Go({ path: [`users/user/${this.userId}/editpermission-failure`] }));
      }
    });

    this.actions$.pipe(ofType(fromStore.REFRESH_USER_FAIL)).subscribe(() => {
      this.summaryErrorsSubject.next({
        isFromValid: false,
        items: [
          {
            id: null,
            message: 'There was a problem refreshing the user. Please wait for the batch process for changes to be made.'
          }
        ],
        header: 'There was a problem' });
    });

    if (!this.userId){
      this.actions$.pipe(ofType(fromStore.INVITE_USER_FAIL_WITH_400), takeUntil(this.onDestory$)).subscribe(() => {
        this.handleError(this.userStore, 400);
      });
      this.actions$.pipe(ofType(fromStore.INVITE_USER_FAIL_WITH_404), takeUntil(this.onDestory$)).subscribe(() => {
        this.handleError(this.userStore, 404);
      });
      this.actions$.pipe(ofType(fromStore.INVITE_USER_FAIL_WITH_500), takeUntil(this.onDestory$)).subscribe(() => {
        this.handleError(this.userStore, 500);
      });
      this.actions$.pipe(ofType(fromStore.INVITE_USER_FAIL_WITH_429), takeUntil(this.onDestory$)).subscribe(() => {
        this.showWarningMessage = true;
      });
      this.actions$.pipe(ofType(fromStore.INVITE_USER_FAIL_WITH_409), takeUntil(this.onDestory$)).subscribe(() => {
        this.showWarningMessage = true;
      });
      this.actions$.pipe(ofType(fromStore.INVITE_USER_FAIL), takeUntil(this.onDestory$)).subscribe(() => {
        this.routerStore.dispatch(new fromRoot.Go({ path: ['service-down'] }));
      });
    }
  }

  ngOnDestroy(): void {
    this.onDestory$.next();
    this.onDestory$.complete();
  }

  onPersonalDetailsChange($event: PersonalDetails){
    this.updatedUser = { ...this.updatedUser, firstName: $event.firstName, lastName: $event.lastName, email: $event.email };
    this.loggerService.debug('updatedUser', this.updatedUser);
  }

  onSelectedCaseManagamentPermissionsChange($event: CaseManagementPermissions) {
    // when manageCases is true, add add the pui-case-manager roles field to the user else remove it from the roles field
    const caseAdminRole = 'pui-caa';
    let updatedRoles: string[];
    if ($event.manageCases){
      updatedRoles = [...this.updatedUser?.roles ?? [], caseAdminRole];
    } else {
      updatedRoles = this.updatedUser?.roles?.filter((role: string) => role !== caseAdminRole) ?? [];
    }
    this.updatedUser = { ...this.updatedUser, roles: [...new Set(updatedRoles)] };
    // when manageCases is false then the roles property is an empty array, which will clear all the access types
    this.updatedUser = { ...this.updatedUser, accessTypes: $event.userAccessTypes };
    this.loggerService.debug('updatedUser', this.updatedUser);
  }

  onStandardUserPermissionsChange($event: BasicAccessTypes) {
    let roles: string[] = this.user?.roles ?? [];

    roles = this.updateStandardPermission(roles, 'pui-user-manager', $event.isPuiUserManager);
    roles = this.updateStandardPermission(roles, 'pui-finance-manager', $event.isPuiFinanceManager);
    roles = this.updateStandardPermission(roles, 'pui-organisation-manager', $event.isPuiOrganisationManager);
    roles = this.updateStandardPermission(roles, 'pui-case-manager', $event.isCaseAccessAdmin);

    // CAA role now comes from access types component
    if (this.updatedUser?.roles?.includes('pui-caa')) {
      roles.push('pui-caa');
    }

    this.updatedUser = { ...this.updatedUser, roles: [...new Set(roles)] };
    this.loggerService.debug('updatedUser', this.updatedUser);
  }

  private updateStandardPermission(currentRoles: string[], roleName: string, enabled: boolean) {
    if (enabled) {
      currentRoles = [...currentRoles, roleName];
    } else {
      currentRoles = currentRoles.filter((value) => value !== roleName);
    }

    return currentRoles;
  }

  onSubmit() {
    this.showWarningMessage = false;
    this.userPersonalDetails.personalDetailForm.markAllAsTouched();
    this.userPersonalDetails.updateCurrentErrors();
    this.standardPermission.permissionsForm.markAllAsTouched();
    this.standardPermission.updateCurrentErrors();

    const errorItems = this.getFormErrors();
    this.summaryErrorsSubject.next({
      isFromValid: errorItems.length === 0,
      items: errorItems,
      header: 'There is a problem'
    });

    if (errorItems.length > 0){
      return;
    }

    if (this.userId && !this.resendInvite) {
      this.updateUser();
    } else {
      this.inviteUser();
    }
  }

  private getFormErrors() {
    this.userPersonalDetails.personalDetailForm.markAllAsTouched();
    this.userPersonalDetails.updateCurrentErrors();
    this.standardPermission.permissionsForm.markAllAsTouched();
    this.standardPermission.updateCurrentErrors();

    const errorItems: {id: string; message: string[];}[] = [];
    if (!this.userId){
      Object.keys(this.userPersonalDetails.errors).forEach((key) => {
        if (this.userPersonalDetails.errors[key].length > 0) {
          errorItems.push({ id: key, message: this.userPersonalDetails.errors[key] });
        }
      });
    }
    if (this.standardPermission.errors.basicPermissions.length > 0){
      errorItems.push({ id: 'isCaseAccessAdmin', message: this.standardPermission.errors.basicPermissions });
    }

    return errorItems;
  }

  public inviteUser(): void {
    const value:any = {
      ...this.updatedUser,
      resendInvite: this.resendInvite
    };
    if (value.roles.includes('pui-case-manager')) {
      value.roles = [...value.roles, ...AppConstants.CCD_ROLES];
    }
    if (this.resendInvite) {
      Object.assign(value, {
        email: this.user.email,
        firstName: this.user.firstName,
        lastName: this.user.lastName
      });
    }
    // Check if the user has selected GA options - dont need to compare the access types if they arent posting with GA role
    if (value.roles.includes('pui-caa')) {
      // TODO: provide the organisationProfileIds in param 2
      this.inviteUserSvc.compareAccessTypes(value, []).subscribe((comparedUserSelection) => {
        this.userStore.dispatch(new fromStore.SendInviteUser(comparedUserSelection));
      });
    } else {
      this.userStore.dispatch(new fromStore.SendInviteUser(value));
    }
  }

  private updateUser() {
    const permissions = this.updatedUser.roles;
    const rolesAdded = [...new Set(UserRolesUtil.getRolesAdded(this.user, permissions))];
    const rolesDeleted = [...new Set(UserRolesUtil.getRolesDeleted(this.user, permissions))];
    const editUserRolesObj = UserRolesUtil.mapEditUserRoles(this.user, this.userId, rolesAdded, rolesDeleted, this.updatedUser.accessTypes);
    const hasChanges = (rolesAdded.length > 0 || rolesDeleted.length > 0 || !UserRolesUtil.accessTypesMatch(this.user.accessTypes, this.updatedUser.accessTypes));

    if (hasChanges) {
      this.userStore.dispatch(new fromStore.EditUser(editUserRolesObj));
    } else {
      this.summaryErrorsSubject.next({ isFromValid: false, items: [{ id: 'roles', message: 'You need to make a change before submitting. If you don\'t make a change, these permissions will stay the same' }], header: 'There is a problem' });
      this.permissionErrors = { isInvalid: true, messages: ['You need to make a change before submitting. If you don\'t make a change, these permissions will stay the same'] };
      return this.userStore.dispatch(new fromStore.EditUserFailure('You need to make a change before submitting. If you don\'t make a change, these permissions will stay the same'));
    }
  }

  private getBackurl(userId: string): string {
    return !!userId ? `/users/user/${userId}` : '/users';
  }

  public handleError(store: Store<any>, errorNumber: number): void {
    const globalError = this.getGlobalError(errorNumber);
    if (globalError) {
      store.dispatch(new fromRoot.AddGlobalError(globalError));
      store.dispatch(new fromRoot.Go({ path: ['service-down'] }));
    }
  }

  public getGlobalError(error: number): GlobalError {
    const errorMessages = this.getErrorMessages(error);
    const globalError = {
      header: this.getErrorHeader(error),
      errors: errorMessages
    };
    return globalError;
  }

  private getErrorMessages(error: number) {
    switch (error) {
      case 400:
        return [{
          bodyText: 'to check the status of the user',
          urlText: 'Refresh and go back',
          url: '/users'
        }];
      case 404:
        return [{
          bodyText: 'to reactivate this account',
          urlText: 'Get help',
          url: '/get-help',
          newTab: true
        }, {
          bodyText: null,
          urlText: 'Go back to manage users',
          url: '/users'
        }];
      case 500:
      default:
        return [{
          bodyText: 'Try again later.',
          urlText: null,
          url: null
        }, {
          bodyText: null,
          urlText: 'Go back to manage users',
          url: '/users'
        }];
    }
  }

  private getErrorHeader(error: number): string {
    switch (error) {
      case 400:
        return 'Sorry, there is a problem';
      case 404:
        return 'Sorry, there is a problem with this account';
      case 500:
      default:
        return 'Sorry, there is a problem with the service';
    }
  }
}
