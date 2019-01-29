import {Component, OnInit} from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromFeeAccountsStore from '../../../fee-accounts/store';
import { GovukTableColumnConfig } from 'src/app/components/govuk-table/govuk-table.component';

/**
 * Bootstraps the Fee Accounts Components
 */

@Component({
  selector: 'app-prd-fee-accounts-component',
  templateUrl: './fee-accounts.component.html',
})
export class FeeAccountsComponent implements OnInit {

  columnConfig: GovukTableColumnConfig[];
  tableRows: {}[];

  constructor(
    private store: Store<fromFeeAccountsStore.FeeAccountsState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new fromFeeAccountsStore.LoadFeeAccounts());
    this.store.pipe(select(fromFeeAccountsStore.getFeeAccountsArray)).subscribe(feeAccountsData => {
      const mappedData: any[] = [];
      feeAccountsData.forEach(element => {
        element = {
          ...element,
          routerLink: `account/${element.accountNumber}/summary`
        };
        mappedData.push(element);
      });
      this.tableRows = mappedData;
    });

    this.columnConfig = [
      { header: 'Account number', key: 'accountNumber', type: 'link' },
      { header: 'Account name', key: 'accountName' }
    ];
  }

}
