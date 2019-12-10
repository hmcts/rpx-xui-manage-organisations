import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromRoot from '../../../app/store';
import { Observable, Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-prd-user-details-component',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  user$: Observable<any>;
  isLoading$: Observable<boolean>;
  user: any;

  userSubscription: Subscription;
  routerSubscription: Subscription;

  constructor(
    private userStore: Store<fromStore.UserState>,
    private routerStore: Store<fromRoot.State>,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.userStore.pipe(select(fromStore.getSelectedUserLoading));
    this.userSubscription = this.userStore.pipe(select(fromStore.getSelectedUser)).subscribe((user) => {
      this.user = user;
    });

    this.routerSubscription = this.routerStore.pipe(select(fromRoot.getRouterState)).subscribe((route) => {
      const userId = route.state.params.userId;
      if (userId) {
        this.userStore.dispatch(new fromStore.LoadSelectedUser(userId));
      }
    });

  }

  ngOnDestroy() {

    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  isSuspended(status) {
    return status === 'Suspended';
  }

}

