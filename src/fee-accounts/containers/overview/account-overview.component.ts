import {Component, OnInit, OnDestroy} from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromFeeAccountsStore from '../../../fee-accounts/store';
import { GovukTableColumnConfig } from 'projects/gov-ui/src/lib/components/govuk-table/govuk-table.component';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-prd-fee-accounts-component',
  templateUrl: './account-overview.component.html',
})
export class AccountsOverviewComponent implements OnInit, OnDestroy {

  columnConfig: GovukTableColumnConfig[];
  tableRows: {}[];
  feeAccountsSubscription: Subscription;

  constructor(private store: Store<fromFeeAccountsStore.FeeAccountsState>) {}

  ngOnInit(): void {
    this.store.dispatch(new fromFeeAccountsStore.LoadFeeAccounts());

    this.feeAccountsSubscription = this.store.pipe(select(fromFeeAccountsStore.getFeeAccountsArray)).subscribe(feeAccountsData => {
      // TODO: needs to be in the selector apparently
      const mappedData: any[] = [];
      feeAccountsData.forEach(element => {
        element = {
          ...element,
          routerLink: `/fee-accounts/account/${element.accountNumber}/summary`
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

  ngOnDestroy() {
    this.feeAccountsSubscription.unsubscribe();
  }

}
