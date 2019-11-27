import { Component, OnDestroy, OnInit } from '@angular/core';
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

  user$: Observable<any>;
  isLoading$: Observable<boolean>;
  user: any;

  userSubscription: Subscription;
  dependanciesSubscription: Subscription;

  constructor(
    private userStore: Store<fromStore.UserState>,
    private routerStore: Store<fromRoot.State>,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.userStore.pipe(select(fromStore.getGetUserLoading));

    this.dependanciesSubscription = combineLatest([
      this.routerStore.pipe(select(fromRoot.getRouterState)),
      this.userStore.pipe(select(fromStore.getGetUserLoaded))
    ]).subscribe(([route, users]) => {
      if (users === false) {
        this.userStore.dispatch(new fromStore.LoadUsers());
      }
      const userId = route.state.params.userId;
      this.user$ = this.userStore.pipe(select(fromStore.getGetSingleUser, { userIdentifier: userId }));
    });

    this.userSubscription = this.user$.subscribe((user) => this.user = user);

  }

  ngOnDestroy() {

    if (this.dependanciesSubscription) {
      this.dependanciesSubscription.unsubscribe();
    }

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  isSuspended(status) {
    return status === 'Suspended';
  }

}

