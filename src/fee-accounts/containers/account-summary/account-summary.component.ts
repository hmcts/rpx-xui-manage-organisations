import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';

import { FeeAccount } from '../../../fee-accounts/models/pba-accounts';
import * as fromFeeAccountsStore from '../../../fee-accounts/store';
import * as fromfeatureStore from '../../store';

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.scss'],
  standalone: false
})
export class AccountSummaryComponent implements OnInit, OnDestroy {
  public accounts$: Observable<FeeAccount[]>;
  public accountName$: Observable<string>;
  public subscription: Subscription;
  public navItems = [
    {
      text: 'Summary',
      href: './',
      active: true
    },
    {
      text: 'Transactions',
      href: './transactions',
      active: false
    }
  ];

  public loading$: Observable<boolean>;

  constructor(
    private readonly activeRoute: ActivatedRoute,
    private readonly store: Store<fromfeatureStore.FeeAccountsState>
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(new fromFeeAccountsStore.LoadFeeAccounts([this.activeRoute.snapshot.params.id]));
    this.accounts$ = this.store.pipe(select(fromFeeAccountsStore.feeAccounts));
    this.subscription = this.accounts$.subscribe((acc) => {
      if (acc && acc[0]) {
        this.accountName$ = of(acc[0].account_name);
      }
    });
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new fromfeatureStore.ResetSingleFeeAccount({}));
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
