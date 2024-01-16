import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, combineLatest, takeUntil } from 'rxjs';

import * as fromRoot from '../../../app/store';
import * as fromStore from '../../store';
import * as fromOrgStore from '../../../organisation/store';
import { User, UserAccessType } from '@hmcts/rpx-xui-common-lib';
import { CaseManagementPermissions } from '../../models/case-management-permissions.model';
import { BasicAccessTypes } from '../../models/basic-access-types.model';
import { PersonalDetails } from '../../models/personal-details.model';

import { jurisdictionsExample, userAccessTypesExample } from './temp-data';
import { Jurisdiction } from '@hmcts/ccd-case-ui-toolkit';
import { OrganisationDetails } from 'src/models';
import { LoggerService } from 'src/shared/services/logger.service';

import { UserRolesUtil } from '../utils/user-roles-util';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html'
})
export class ManageUserComponent implements OnInit, OnDestroy {
  public backUrl: string;
  public userId: string;
  public summaryErrors: { isFromValid: boolean; items: { id: string; message: any; }[]; header: string };
  public permissionErrors: { isInvalid: boolean; messages: string[] };
  public user: User;

  // TODO: remove this when the GA-62 is complete and replace with selector
  public jurisdictions = JSON.parse(jurisdictionsExample) as Jurisdiction[];
  public organisationProfileIds:string[];

  private user$: Observable<User>;
  private organisation$: Observable<OrganisationDetails>;
  private updatedUser: User;
  private onDestory$ = new Subject<void>();

  constructor(private readonly actions$: Actions,
    private readonly routerStore: Store<fromRoot.State>,
    private readonly userStore: Store<fromStore.UserState>,
    private readonly orgStore: Store<fromOrgStore.OrganisationState>,
    private loggerService: LoggerService) {}

  ngOnInit(): void {
    this.routerStore.pipe(select(fromRoot.getRouterState)).pipe(takeUntil(this.onDestory$)).subscribe((route) => {
      this.userId = route.state.params.userId;
      this.user$ = this.userStore.pipe(select(fromStore.getGetSingleUser));
      this.organisation$ = this.orgStore.pipe(select(fromOrgStore.getOrganisationSel));
      this.backUrl = this.getBackurl(this.userId);
    });

    combineLatest([this.user$, this.organisation$]).pipe(takeUntil(this.onDestory$)).subscribe(([user, organisation]) => {
      // TODO this is temporary until access types are returned by the API. used to test the population of the form
      organisation = { ...organisation, organisationProfileIds: ['SOLICITOR_PROFILE'] };
      if (user){
        user = { ...user, accessTypes: JSON.parse(userAccessTypesExample) as UserAccessType };
        this.user = user;
      }
      this.organisationProfileIds = organisation.organisationProfileIds ?? [];
    });

    this.actions$.pipe(ofType(fromStore.EDIT_USER_SUCCESS)).subscribe(() => {
      this.routerStore.dispatch(new fromRoot.Go({ path: [`users/user/${this.userId}`] }));
    });
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
      updatedRoles = [...this.updatedUser.roles ?? [], caseAdminRole];
    } else {
      updatedRoles = this.updatedUser.roles.filter((role: string) => role !== caseAdminRole);
    }
    this.updatedUser = { ...this.updatedUser, roles: [...new Set(updatedRoles)] };
    // when manageCases is false then the roles property is an empty array, which will clear all the access types
    this.updatedUser = { ...this.updatedUser, accessTypes: $event.userAccessTypes };
    console.log('updated user', this.updatedUser);
    this.loggerService.debug('updatedUser', this.updatedUser);
  }

  onStandardUserPermissionsChange($event: BasicAccessTypes) {
    let roles: string[] = this.user.roles ?? [];

    roles = this.updateStandardPermission(roles, 'pui-user-manager', $event.isPuiUserManager);
    roles = this.updateStandardPermission(roles, 'pui-finance-manager', $event.isPuiFinanceManager);
    roles = this.updateStandardPermission(roles, 'pui-organisation-manager', $event.isPuiOrganisationManager);
    roles = this.updateStandardPermission(roles, 'pui-case-manager', $event.isCaseAccessAdmin);

    // CAA role now comes from access types component
    if (this.updatedUser?.roles?.includes('pui-caa')) {
      roles.push('pui-caa');
    }

    this.updatedUser = { ...this.updatedUser, roles: [...new Set(roles)] };
    console.log('updated user', this.updatedUser);
    this.loggerService.debug('updatedUser', this.updatedUser);
  }

  private updateStandardPermission(currentRoles: string[], roleName: string, enabled: boolean) {
    if (enabled) {
      currentRoles.push(roleName);
    } else {
      currentRoles = currentRoles.filter((value) => value !== roleName);
    }

    return currentRoles;
  }

  onSubmit() {
    if (this.userId) {
      this.updateUser();
    } else {
      this.inviteUser();
    }
  }

  private inviteUser() {
    // TODO: implement
  }

  private updateUser() {
    const permissions = this.updatedUser.roles;
    const rolesAdded = UserRolesUtil.getRolesAdded(this.user, permissions);
    const rolesDeleted = UserRolesUtil.getRolesDeleted(this.user, permissions);
    const editUserRolesObj = UserRolesUtil.mapEditUserRoles(this.user, this.userId, rolesAdded, rolesDeleted, this.updatedUser.accessTypes);

    console.log('ACCESS TYPES:');
    console.log(this.updatedUser.accessTypes);
    console.log(editUserRolesObj);

    if (rolesAdded.length > 0 || rolesDeleted.length > 0 || !UserRolesUtil.accessTypesMatch(this.user.accessTypes, this.updatedUser.accessTypes)) {
      this.userStore.dispatch(new fromStore.EditUser(editUserRolesObj));
    } else {
      this.summaryErrors = { isFromValid: false, items: [{ id: 'roles', message: 'You need to make a change before submitting. If you don\'t make a change, these permissions will stay the same' }],
        header: this.summaryErrors.header };
      this.permissionErrors = { isInvalid: true, messages: ['You need to make a change before submitting. If you don\'t make a change, these permissions will stay the same'] };
      return this.userStore.dispatch(new fromStore.EditUserFailure('You need to make a change before submitting. If you don\'t make a change, these permissions will stay the same'));
    }
  }

  private getBackurl(userId: string): string {
    return !!userId ? `/users/user/${userId}` : '/users';
  }
}