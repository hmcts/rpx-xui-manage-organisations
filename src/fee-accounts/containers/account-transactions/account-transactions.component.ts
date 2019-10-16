import {Component, OnDestroy, OnInit} from '@angular/core';
import * as fromfeatureStore from '../../store';
import {Observable, Subscription, of} from 'rxjs';
import {select, Store, MemoizedSelector} from '@ngrx/store';
import {ActivatedRoute} from '@angular/router';
import { FeeAccount } from 'src/fee-accounts/models/pba-accounts';
import { SingleAccountSummary } from 'src/fee-accounts/models/single-account-summary';

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
    this.loading$ = this.isTransactionLoading(fromfeatureStore.pbaAccountTransactionsLoading);
    this.dispatchAccountTransactions(this.activeRoute.snapshot.params.id);
    this.accountTransactions$ = this.getAccountTransactions(fromfeatureStore.pbaAccountTransactions);
    this.backUrl = this.getBackUrl(this.activeRoute.snapshot.params.id);

    this.dispatchLoadFeeAccounts(this.activeRoute.snapshot.params.id);
    this.accounts$ = this.getFeeAccounts(fromfeatureStore.feeAccounts);
    this.subscription = this.subscribeAccounts(this.accounts$);
  }

  subscribeAccounts(accounts$: Observable<FeeAccount[]>): Subscription {
    return accounts$.subscribe(acc => {
      if (acc && acc[0]) {
        this.accounts = acc;
      }
    });
  }

  getFeeAccounts(feeAccounts: MemoizedSelector<object, FeeAccount[]>): Observable<FeeAccount[]> {
    return this.store.pipe(select(feeAccounts));
  }

  dispatchLoadFeeAccounts(id: string) {
    this.store.dispatch(new fromfeatureStore.LoadFeeAccounts([id]));
  }

  getBackUrl(id: string): string {
    return `/fee-accounts/account/${id}`;
  }

  getAccountTransactions(pbaAccountTransactions: MemoizedSelector<object, {} | SingleAccountSummary>):
  Observable<{} | SingleAccountSummary> {
    return this.store.pipe(select(pbaAccountTransactions));
  }

  dispatchAccountTransactions(id: string) {
    this.store.dispatch(new fromfeatureStore.LoadSingleFeeAccountTransactions({ id }));
  }

  isTransactionLoading(isTransactionLoading: MemoizedSelector<object, boolean>) {
    return this.store.pipe(select(isTransactionLoading));
  }

  ngOnDestroy() {
    this.resetSingleFeeAccount();
    this.unsubscribe(this.subscription);
  }

  unsubscribe(subscription: Subscription) {
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  resetSingleFeeAccount() {
    this.store.dispatch(new fromfeatureStore.ResetSingleFeeAccount({}));
  }
}
