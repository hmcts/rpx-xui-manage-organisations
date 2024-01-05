import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import * as fromRoot from '../../../app/store';
import * as fromStore from '../../store';
import * as fromOrgStore from '../../../organisation/store'
import { User } from '@hmcts/rpx-xui-common-lib';
import { BasicAccessTypes } from '../../components/standard-user-permissions/standard-user-permissions.component';
import { CaseManagementPermissions } from '../../components/organisation-access-permissions/organisation-access-permissions.component';
import { Jurisdiction } from 'src/models';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html'
})
export class ManageUserComponent implements OnInit, OnDestroy {
  public backUrl: string;
  public userId: string;
  public user$: Observable<User>;
  public organisationAccessTypes$: Observable<Jurisdiction[]>;
  public summaryErrors: { isFromValid: boolean; items: { id: string; message: any; }[]; header: string };
  public user: User;
  private onDestory$ = new Subject<void>();
  private updatedUser: User;

  constructor(private readonly actions$: Actions, private readonly routerStore: Store<fromRoot.State>, private readonly userStore: Store<fromStore.UserState>, 
    private readonly orgStore: Store<fromOrgStore.OrganisationState>) {}

  ngOnInit(): void {
    // dispatch event to load user
    // select user from store
    this.organisationAccessTypes$ = this.orgStore.pipe(select(fromOrgStore.getAccessTypes));
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
