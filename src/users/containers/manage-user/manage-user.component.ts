import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import * as fromRoot from '../../../app/store';
import * as fromStore from '../../store';
import { User, UserAccessType } from '@hmcts/rpx-xui-common-lib';
import { CaseManagementPermissions } from '../../models/case-management-permissions.model';
import { BasicAccessTypes } from '../../models/basic-access-types.model';
import { PersonalDetails } from '../../models/personal-details.model';

import { jurisdictionsExample, userAccessTypesExample } from './temp-data';
import { Jurisdiction } from '@hmcts/ccd-case-ui-toolkit';
// import { UserRolesUtil } from '../utils/user-roles-util';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html'
})
export class ManageUserComponent implements OnInit, OnDestroy {
  public backUrl: string;
  public userId: string;
  public user$: Observable<User>;
  public summaryErrors: { isFromValid: boolean; items: { id: string; message: any; }[]; header: string };
  public user: User;

  // TODO: remove this when the GA-62 is complete and replace with selector
  public jurisdictions = JSON.parse(jurisdictionsExample) as Jurisdiction[];

  private onDestory$ = new Subject<void>();
  private updatedUser: User;

  constructor(private readonly actions$: Actions, private readonly routerStore: Store<fromRoot.State>, private readonly userStore: Store<fromStore.UserState>) {}

  ngOnInit(): void {
    this.routerStore.pipe(select(fromRoot.getRouterState)).pipe(takeUntil(this.onDestory$)).subscribe((route) => {
      this.userId = route.state.params.userId;
      this.user$ = this.userStore.pipe(select(fromStore.getGetSingleUser));
      this.backUrl = this.getBackurl(this.userId);
    });

    this.user$.pipe(takeUntil(this.onDestory$)).subscribe((user) => {
      // TODO this is temporary until access types are returned by the API. used to test the population of the form
      user = { ...user, accessTypes: JSON.parse(userAccessTypesExample) as UserAccessType };
      this.user = user;
    });

    this.actions$.pipe(ofType(fromStore.EDIT_USER_SUCCESS)).subscribe(() => {
      this.routerStore.dispatch(new fromRoot.Go({ path: [`users/user/${this.userId}`] }));
    });
  }

  ngOnDestroy(): void {
    this.onDestory$.next();
    this.onDestory$.complete();
  }

  public onSubmit(): void {
/*     // BJ-TODO: Add check here to see if there are any access types to submit
    const { value } = this.editUserForm;
    const permissions = UserRolesUtil.mapPermissions(value);
    const rolesAdded = UserRolesUtil.getRolesAdded(this.user, permissions);
    const rolesDeleted = UserRolesUtil.getRolesDeleted(this.user, permissions);
    // BJ-TODO: Add access types to 'mapEditUserRoles' method
    const editUserRolesObj = UserRolesUtil.mapEditUserRoles(this.user, this.userId, rolesAdded, rolesDeleted);
    // BJ-TODO: Change IF statement to include access types as a potential change
    if (rolesAdded.length > 0 || rolesDeleted.length > 0) {
      this.userStore.dispatch(new fromStore.EditUser(editUserRolesObj));
    } else {
      this.summaryErrors = { isFromValid: false, items: [{ id: 'roles', message: 'You need to make a change before submitting. If you don\'t make a change, these permissions will stay the same' }],
        header: this.summaryErrors.header };
      this.permissionErrors = { isInvalid: true, messages: ['You need to make a change before submitting. If you don\'t make a change, these permissions will stay the same'] };
      return this.userStore.dispatch(new fromStore.EditUserFailure('You need to make a change before submitting. If you don\'t make a change, these permissions will stay the same'));
    } */
  }

  onPersonalDetailsChange($event: PersonalDetails){
    this.updatedUser = { ...this.user, firstName: $event.firstName, lastName: $event.lastName, email: $event.email };
  }

  onSelectedCaseManagamentPermissionsChange($event: CaseManagementPermissions) {
    // todo: when $event.manageCases is true, add add the pui-case-manager roles field to the user else remove it from the roles field
    this.updatedUser = { ...this.user, accessTypes: $event.userAccessTypes };
  }

  onStandardUserPermissionsChange($event: BasicAccessTypes) {
    // todo: map each property to their respective role
    const roles: string[] = [];
    if ($event.isPuiUserManager) {
      roles.push('pui-user-manager');
    }
    if ($event.isPuiFinanceManager) {
      roles.push('pui-finance-manager');
    }
    if ($event.isPuiOrganisationManager) {
      roles.push('pui-organisation-manager');
    }
    if ($event.isCaseAccessAdmin) {
      roles.push('pui-case-manager');
    }
    this.updatedUser = { ...this.user, roles };
  }

  private getBackurl(userId: string): string {
    return `/users/user/${userId}`;
  }
}
