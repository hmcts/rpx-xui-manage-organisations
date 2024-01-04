import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import * as fromRoot from '../../../app/store';
import * as fromStore from '../../store';
import { User } from '@hmcts/rpx-xui-common-lib';
import { CaseManagementPermissions } from '../../models/case-management-permissions.model';
import { BasicAccessTypes } from '../../models/basic-access-types.model';
import { PersonalDetails } from '../../models/personal-details.model';

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
  private onDestory$ = new Subject<void>();
  private updatedUser: User;

  constructor(private readonly actions$: Actions, private readonly routerStore: Store<fromRoot.State>, private readonly userStore: Store<fromStore.UserState>) {}

  ngOnInit(): void {
    // dispatch event to load user
    // select user from store
    this.routerStore.pipe(select(fromRoot.getRouterState)).pipe(takeUntil(this.onDestory$)).subscribe((route) => {
      this.userId = route.state.params.userId;
      this.user$ = this.userStore.pipe(select(fromStore.getGetSingleUser));
      this.backUrl = this.getBackurl(this.userId);
    });

    this.user$.pipe(takeUntil(this.onDestory$)).subscribe((user) => {
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
