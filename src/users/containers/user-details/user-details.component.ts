import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromRoot from '../../../app/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-prd-user-details-component',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  user$: Observable<any>;
  isLoading$: Observable<boolean>;
  user: any;

  userSubscription: Subscription;
  dependanciesSubscription: Subscription;

  actionButtons: { name: string, class: string, action: () => {} }[] = [];

  suspendViewFlag: boolean = false;

  showSuspendView: () => {};
  hideSuspendView: () => {};

  suspendSuccessSubscription: Subscription;

  constructor(
    private userStore: Store<fromStore.UserState>,
    private routerStore: Store<fromRoot.State>,
    private actions$: Actions,
  ) { }

  ngOnInit(): void {
    this.user$ = new Observable();
    this.setSuspendViewFunctions();

    this.isLoading$ = this.userStore.pipe(select(fromStore.getGetUserLoading));

    this.dependanciesSubscription = this.getDependancyObservables(this.userStore, this.routerStore).subscribe(([route, users]) => {
      this.handleDependanciesSubscription(users, route);
    });

    this.userSubscription = this.user$.subscribe((user) => this.handleUserSubscription(user));

    this.suspendSuccessSubscription = this.actions$.pipe(ofType(fromStore.SUSPEND_USER_SUCCESS)).subscribe(() => {
      this.hideSuspendView();
    });
  }

  getDependancyObservables(routerStore: Store<fromStore.UserState>, userStore: Store<fromRoot.State>) {
    return combineLatest([
      routerStore.pipe(select(fromRoot.getRouterState)),
      userStore.pipe(select(fromStore.getGetUserLoaded))
    ]);
  }

  dispatchGetUsers(users, userStore) {
    if (!users) {
      userStore.dispatch(new fromStore.LoadUsers());
    }
  }

  getUserObservable(userId, userStore) {
    return userStore.pipe(select(fromStore.getGetSingleUser, { userIdentifier: userId }));
  }

  setSuspendViewFunctions() {
    this.hideSuspendView = () => this.suspendViewFlag = false;
    this.showSuspendView = () => this.suspendViewFlag = true;
  }

  handleUserSubscription(user) {
    this.user = user;
    if (this.user && this.user.status === 'Active') {

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
  }

  handleDependanciesSubscription(users, route) {
    this.dispatchGetUsers(users, this.userStore);
    this.user$ = this.getUserObservable(route.state.params.userId, this.userStore);
  }

  ngOnDestroy() {

    if (this.dependanciesSubscription) {
      this.dependanciesSubscription.unsubscribe();
    }

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    if (this.suspendSuccessSubscription) {
      this.suspendSuccessSubscription.unsubscribe();
    }
  }

  isSuspended(status) {
    return status === 'Suspended';
  }

  isSuspendView() {
    return this.suspendViewFlag;
  }

  suspendUser() {
    this.userStore.dispatch(new fromStore.SuspendUser(this.user));
  }

}
