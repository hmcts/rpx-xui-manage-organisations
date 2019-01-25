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

  tableHeaders: {}[];
  tableRows: {}[][];

  constructor(
    private store: Store<fromFeeAccountsStore.FeeAccountsState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new fromFeeAccountsStore.LoadFeeAccounts());
    this.store.pipe(select(fromFeeAccountsStore.getFeeAccountsArray)).subscribe(feeAccountsData => {
      this.tableRows = feeAccountsData;
    });

    this.tableHeaders = [
      { text: 'Account number' },
      { text: 'Account name' }
    ];
  }

}
