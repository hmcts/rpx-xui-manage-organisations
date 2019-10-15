import {Component, OnDestroy, OnInit} from '@angular/core';
import * as fromfeatureStore from '../../store';
import {Observable, Subscription, of} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {map} from 'rxjs/internal/operators';
import {ActivatedRoute} from '@angular/router';
import { FeeAccount } from 'src/fee-accounts/models/pba-accounts';

@Component({
  selector: 'app-account-transactions',
  templateUrl: './account-transactions.component.html',
  styleUrls: ['./account-transactions.component.scss']
})
export class AccountTransactionsComponent implements OnInit, OnDestroy {
  backUrl: string;
  accountTransactions$: any;
  accounts$: Observable<Array<FeeAccount>>;
  subscription: Subscription;
  accounts: Array<FeeAccount>;
  navItems = [
    {
      text: 'Summary',
      href: `../`,
      active: false
    },
    {
      text: 'Transactions',
      href: `../transactions`,
      active: true
    }
  ];
  columnConfig = [
    { header: 'Payment reference', key: 'payment_reference' },
    { header: 'Case', key: 'ccd_case_number' },
    { header: 'Your reference', key: 'payment_reference' },
    { header: 'Status', key: 'status' },
    { header: 'Date created', key: 'date_created', type: 'date' },
    { header: 'Last updated', key: 'date_updated', type: 'date' },
    { header: 'Amount', key: 'amount' }
  ];
  loading$: Observable<boolean>;
  constructor(
    private activeRoute: ActivatedRoute,
    private store: Store<fromfeatureStore.FeeAccountsState>) { }

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromfeatureStore.pbaAccountTransactionsLoading));
    this.store.dispatch(new fromfeatureStore.LoadSingleFeeAccountTransactions({id: this.activeRoute.snapshot.params.id }));
    this.accountTransactions$ = this.store.pipe(select(fromfeatureStore.pbaAccountTransactions));
    this.backUrl = `/fee-accounts/account/${this.activeRoute.snapshot.params.id}`;

    this.store.dispatch(new fromfeatureStore.LoadFeeAccounts([this.activeRoute.snapshot.params.id]));
    this.accounts$ = this.store.pipe(select(fromfeatureStore.feeAccounts));
    this.subscription = this.accounts$.subscribe(acc => {
      if (acc && acc[0]) {
        this.accounts = acc;
      }
    });
  }
  ngOnDestroy() {
    this.store.dispatch(new fromfeatureStore.ResetSingleFeeAccount({}));
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
