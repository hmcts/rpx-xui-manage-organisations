import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MemoizedSelector, select, Store} from '@ngrx/store';
import {Observable, of, Subscription} from 'rxjs';
import { FeeAccount } from 'src/fee-accounts/models/pba-accounts';
import { SingleAccountSummary } from 'src/fee-accounts/models/single-account-summary';
import { AppUtils } from '../../../../src/app/utils/app-utils';
import * as fromfeatureStore from '../../store';

@Component({
  selector: 'app-account-transactions',
  templateUrl: './account-transactions.component.html',
  styleUrls: ['./account-transactions.component.scss']
})
export class AccountTransactionsComponent implements OnInit, OnDestroy {
  public backUrl: string;
  public accountTransactions$: any;
  public accounts$: Observable<Array<FeeAccount>>;
  public subscription: Subscription;
  public accounts: Array<FeeAccount>;
  public navItems = [
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
  public columnConfig = [
    { header: 'Payment Reference', key: 'payment_reference' },
    { header: 'Case', key: 'ccd_case_number' },
    { header: 'Service', key: 'service_name' },
    { header: 'Status', key: 'status' },
    { header: 'Date created', key: 'date_created', type: 'dateAtTime' },
    { header: 'Amount', key: 'amount', type: 'money' }
  ];
  public loading$: Observable<boolean>;
  constructor(
    private activeRoute: ActivatedRoute,
    private store: Store<fromfeatureStore.FeeAccountsState>) { }

  public ngOnInit() {
    this.loading$ = this.isTransactionLoading(fromfeatureStore.pbaAccountTransactionsLoading);
    this.dispatchAccountTransactions(this.activeRoute.snapshot.params.id);
    this.accountTransactions$ = this.getAccountTransactions(fromfeatureStore.pbaAccountTransactions);
    this.backUrl = this.getBackUrl(this.activeRoute.snapshot.params.id);

    this.dispatchLoadFeeAccounts(this.activeRoute.snapshot.params.id);
    this.accounts$ = this.getFeeAccounts(fromfeatureStore.feeAccounts);
    this.subscription = this.subscribeAccounts(this.accounts$);
  }

  public subscribeAccounts(accounts$: Observable<FeeAccount[]>): Subscription {
    return accounts$.subscribe(acc => {
      if (acc && acc[0]) {
        this.accounts = acc;
      }
    });
  }

  public getFeeAccounts(feeAccounts: MemoizedSelector<object, FeeAccount[]>): Observable<FeeAccount[]> {
    return this.store.pipe(select(feeAccounts));
  }

  public dispatchLoadFeeAccounts(id: string) {
    this.store.dispatch(new fromfeatureStore.LoadFeeAccounts([id]));
  }

  public getBackUrl(id: string): string {
    return `/fee-accounts/account/${id}`;
  }

  public getAccountTransactions(pbaAccountTransactions: MemoizedSelector<object, {} | SingleAccountSummary>):
  Observable<{} | SingleAccountSummary> {
    return this.store.pipe(select(pbaAccountTransactions));
  }

  public dispatchAccountTransactions(id: string) {
    this.store.dispatch(new fromfeatureStore.LoadSingleFeeAccountTransactions({ id }));
  }

  public isTransactionLoading(isTransactionLoading: MemoizedSelector<object, boolean>) {
    return this.store.pipe(select(isTransactionLoading));
  }

  public ngOnDestroy() {
    this.resetSingleFeeAccount();
    this.unsubscribe(this.subscription);
  }

  public unsubscribe(subscription: Subscription) {
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  public resetSingleFeeAccount() {
    this.store.dispatch(new fromfeatureStore.ResetSingleFeeAccount({}));
  }

  public formatDateAtTime(date: Date): string {
    return AppUtils.formatDateAtTime(date, true);
  }
}
