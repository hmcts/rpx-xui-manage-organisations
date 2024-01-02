import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import * as fromRoot from '../../../app/store';
import * as fromStore from '../../store';
import { User } from '@hmcts/rpx-xui-common-lib';
import { JurisdictionPermissionViewModel } from '../../components/organisation-access-permissions/organisation-access-permissions.component';
import { UserPermissionViewModel } from '../../components/static-user-permissions/static-user-permissions.component';

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

  onSelectedOrganisationPermissions($event: JurisdictionPermissionViewModel[]) {
    this.updatedUser = { ...this.user, jurisdictions: $event };
    console.log('updatedUser', this.updatedUser);
  }

  onSelectedUserPermissionsChange($event: UserPermissionViewModel) {
    this.updatedUser = { ...this.user, ...$event };
    console.log('updatedUser', this.updatedUser);
  }

  private getBackurl(userId: string): string {
    return `/users/user/${userId}`;
  }
}
