import {Component, OnInit} from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromFeeAccountsStore from '../../../fee-accounts/store';

/**
 * Bootstraps the Fee Accounts Components
 */

@Component({
  selector: 'app-prd-fee-accounts-component',
  templateUrl: './fee-accounts.component.html',
})
export class FeeAccountsComponent implements OnInit {

  constructor(
    private store: Store<fromFeeAccountsStore.FeeAccountsState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new fromFeeAccountsStore.LoadFeeAccounts());
    this.store.pipe(select(fromFeeAccountsStore.getFeeAccountsState)).subscribe(feeAccountsData => {
      console.log(feeAccountsData);
    });
  }

}
