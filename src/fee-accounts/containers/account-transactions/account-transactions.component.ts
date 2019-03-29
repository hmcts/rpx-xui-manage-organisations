import {Component, OnDestroy, OnInit} from '@angular/core';
import * as fromfeatureStore from '../../store';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {map} from 'rxjs/internal/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-account-transactions',
  templateUrl: './account-transactions.component.html',
  styleUrls: ['./account-transactions.component.scss']
})
export class AccountTransactionsComponent implements OnInit, OnDestroy {
  accountTransactions$: any;
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
    { header: 'Payment reference', key: 'paymentReference' },
    { header: 'Case', key: 'case' },
    { header: 'Reference', key: 'reference' },
    { header: 'Submitted by', key: 'submittedBy' },
    { header: 'Status', key: 'status' },
    { header: 'Date created', key: 'dateCreated' },
    { header: 'Last updated', key: 'dateUpdated' },
    { header: 'Amount', key: 'amount' }
  ];
  loading$: Observable<boolean>;
  constructor(
    private activeRoute: ActivatedRoute,
    private store: Store<fromfeatureStore.FeeAccountsState>) { }

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromfeatureStore.pbaAccountTransactionsLoading));

    // TODO move to a guard - find more elegant solution
    this.activeRoute.parent.params.pipe(
      map(payload => {
        this.store.dispatch(new fromfeatureStore.LoadSingleFeeAccountTransactions({id: payload.id }));
      })
    ).subscribe();
    this.accountTransactions$ = this.store.pipe(select(fromfeatureStore.pbaAccountTransactions));

  }
  ngOnDestroy() {
    this.store.dispatch(new fromfeatureStore.ResetSingleFeeAccount({}));
  }
}
