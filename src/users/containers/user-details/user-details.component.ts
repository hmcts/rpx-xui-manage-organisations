import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@hmcts/rpx-xui-common-lib';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import * as fromRoot from '../../../app/store';
import * as fromStore from '../../store';

@Component({
  selector: 'app-prd-user-details-component',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  public editPermissionRouter: string;
  public user$: Observable<User>;
  public isLoading$: Observable<boolean>;
  public user: any;

  public userSubscription: Subscription;
  public dependanciesSubscription: Subscription;
  public suspendUserServerErrorSubscription: Subscription;

  public actionButtons: { name: string, class: string, action(): {} }[] = [];

  public suspendViewFlag: boolean = false;

  public showSuspendView: () => {};
  public hideSuspendView: () => {};

  public suspendSuccessSubscription: Subscription;

  constructor(
    private readonly userStore: Store<fromStore.UserState>,
    private readonly routerStore: Store<fromRoot.State>,
    private readonly actions$: Actions,
  ) { }

  public ngOnInit(): void {
    this.user$ = new Observable();

    const isfeatureEnabled$ = this.routerStore.pipe(select(fromRoot.getEditUserFeatureIsEnabled));

    isfeatureEnabled$.subscribe(isFeatureEnabled => {
      this.editPermissionRouter = isFeatureEnabled ? 'editpermission' : '';
    });

    this.setSuspendViewFunctions();

    this.isLoading$ = this.userStore.pipe(select(fromStore.getGetUserLoading));

    this.dependanciesSubscription = this.getDependancyObservables(this.userStore, this.routerStore).subscribe(([route, users]) => {
      this.handleDependanciesSubscription(users, route);
    });


    this.userSubscription = this.user$.subscribe((user) => this.handleUserSubscription(user, isfeatureEnabled$));

    this.suspendSuccessSubscription = this.actions$.pipe(ofType(fromStore.SUSPEND_USER_SUCCESS)).subscribe(() => {
      this.hideSuspendView();
    });

    this.suspendUserServerErrorSubscription = this.actions$.pipe(ofType(fromStore.SUSPEND_USER_FAIL)).subscribe(() => {
      this.routerStore.dispatch(new fromRoot.Go({ path: [`service-down`] }));
    });
  }

  public getDependancyObservables(routerStore: Store<fromStore.UserState>, userStore: Store<fromRoot.State>) {
    return combineLatest([
      routerStore.pipe(select(fromRoot.getRouterState)),
      userStore.pipe(select(fromStore.getGetUserLoaded))
    ]);
  }

  public dispatchGetUsers(users, userStore) {
    if (!users) {
      userStore.dispatch(new fromStore.LoadUsers());
    }
  }

  public getUserObservable(userId, userStore) {
    return userStore.pipe(select(fromStore.getGetSingleUser, { userIdentifier: userId }));
  }

  public setSuspendViewFunctions() {
    this.hideSuspendView = () => this.suspendViewFlag = false;
    this.showSuspendView = () => this.suspendViewFlag = true;
  }

  public handleUserSubscription(user, isFeatureEnabled$: Observable<boolean>) {
    this.user = user;
    isFeatureEnabled$.subscribe(isFeatureEnabled => {
      if (isFeatureEnabled && this.user && this.user.status === 'Active') {

        this.actionButtons = [
          {
            name: 'Suspend account',
            class: 'hmcts-button--secondary',
            action: this.showSuspendView
          }
        ];
      } else {
        this.actionButtons = null;
      }
    });
  }

  public handleDependanciesSubscription(users, route) {
    this.dispatchGetUsers(users, this.userStore);
    this.user$ = this.getUserObservable(route.state.params.userId, this.userStore);
  }

  public ngOnDestroy() {

    if (this.dependanciesSubscription) {
      this.dependanciesSubscription.unsubscribe();
    }

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    if (this.suspendSuccessSubscription) {
      this.suspendSuccessSubscription.unsubscribe();
    }

    if (this.suspendUserServerErrorSubscription) {
      this.suspendUserServerErrorSubscription.unsubscribe();
    }
  }

  public isSuspendedOrPending(status) {
    return status === 'Suspended' || status === 'Pending';
  }

  public isSuspended(status) {
    return status === 'Suspended';
  }

  public isPending(status) {
    return status === 'Pending';
  }


  public isSuspendView() {
    return this.suspendViewFlag;
  }

  public suspendUser(suspendUser: User) {
    this.userStore.dispatch(new fromStore.SuspendUser(suspendUser));
  }

  public reinviteUser(user: User) {
    console.log('REINVITE USER');
    console.log(user);
    this.userStore.dispatch(new fromStore.ReinvitePendingUser(user));
  }

}
