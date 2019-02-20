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
  accountTransactions$: Observable<any>;
  navItems = [
    {
      text: 'Summary',
      href: `../summary`,
      active: false
    },
    {
      text: 'Transactions',
      href: `../transactions`,
      active: true
    }
  ];
  constructor(
    private activeRoute: ActivatedRoute,
    private store: Store<fromfeatureStore.FeeAccountsState>) { }

  ngOnInit() {
    console.log('ac', this.activeRoute.snapshot.url[0].path)

    //TODO move to a guard
    this.activeRoute.parent.params.pipe(
      map(payload => {
        this.store.dispatch(new fromfeatureStore.LoadSingleFeeAccountTransactions({id: payload.id }));
      })
    ).subscribe();
    this.accountTransactions$ = this.store.pipe(select(fromfeatureStore.pbaAccounTransactions)).subscribe(data =>{
      console.log('data', data)
    })
  }
  ngOnDestroy() {
    this.store.dispatch(new fromfeatureStore.ResetSingleFeeAccount({}));
  }
}
