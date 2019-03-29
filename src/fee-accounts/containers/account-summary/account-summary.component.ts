import {Component, OnDestroy, OnInit} from '@angular/core';
import * as fromfeatureStore from '../../store';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/internal/operators';

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.scss']
})
export class AccountSummaryComponent implements OnInit, OnDestroy {
  accountSummary$: Observable<any>;
  navItems = [
    {
      text: 'Summary',
      href: `/`,
      active: true
    },
    {
      text: 'Transactions',
      href: `./transactions`,
      active: false
    }
  ];
  loading$: Observable<boolean>;
  constructor(
    private activeRoute: ActivatedRoute,
    private store: Store<fromfeatureStore.FeeAccountsState>) { }

  ngOnInit() {
    //TODO move to a guard
    this.activeRoute.parent.params.pipe(
      map(payload => {
        this.store.dispatch(new fromfeatureStore.LoadSingleFeeAccount({id: payload.id }));
      })
    ).subscribe();
    this.accountSummary$ = this.store.pipe(select(fromfeatureStore.getSingleAccounOverview));
    this.loading$ = this.store.pipe(select(fromfeatureStore.pbaAccountSummaryLoading));
  }
  ngOnDestroy() {
    this.store.dispatch(new fromfeatureStore.ResetSingleFeeAccount({}));
  }
}
