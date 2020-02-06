import {Component, OnDestroy, OnInit} from '@angular/core';
import * as fromfeatureStore from '../../store';
import {select, Store} from '@ngrx/store';
import {Observable, Subscription, of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/internal/operators';
import * as fromStore from '../../../organisation/store/index';
import { Organisation } from 'src/organisation/organisation.model';
import { FeeAccount } from 'src/fee-accounts/models/pba-accounts';
import * as fromFeeAccountsStore from '../../../fee-accounts/store';

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.scss']
})
export class AccountSummaryComponent implements OnInit, OnDestroy {
  accounts$: Observable<Array<FeeAccount>>;
  accountName$: Observable<string>;
  subscription: Subscription;
  navItems = [
    {
      text: 'Summary',
      href: `./`,
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
    this.store.dispatch(new fromFeeAccountsStore.LoadFeeAccounts([this.activeRoute.snapshot.params.id]));
    this.accounts$ = this.store.pipe(select(fromFeeAccountsStore.feeAccounts));
    this.subscription = this.accounts$.subscribe(acc => {
      if (acc && acc[0]) {
        this.accountName$ = of(acc[0].account_name);
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
