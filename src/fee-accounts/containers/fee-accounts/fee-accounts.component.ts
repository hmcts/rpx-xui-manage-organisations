import {Component, OnInit, OnDestroy} from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromFeeAccountsStore from '../../../fee-accounts/store';
import { GovukTableColumnConfig } from 'projects/gov-ui/src/lib/components/govuk-table/govuk-table.component';
import { Subscription } from 'rxjs';
import {HttpClient, HttpClientModule} from '@angular/common/http';

/**
 * Bootstraps the Fee Accounts Components
 */

@Component({
  selector: 'app-prd-fee-accounts-component',
  templateUrl: './fee-accounts.component.html',
})
export class FeeAccountsComponent implements OnInit, OnDestroy {

  columnConfig: GovukTableColumnConfig[];
  tableRows: {}[];
  feeAccountsSubscription: Subscription;

  constructor(

    private http: HttpClient,
    private store: Store<fromFeeAccountsStore.FeeAccountsState>
  ) {


  }

  ngOnInit(): void {

    // this.http.post('http://localhost:3001/api/account-fee/payments/summary',{name: 'sss'}).subscribe(data =>{
    //   console.log('Called data', data)
    // });

    this.store.dispatch(new fromFeeAccountsStore.LoadFeeAccounts());
    // this.feeAccountsSubscription = this.store.pipe(select(fromFeeAccountsStore.getFeeAccountsArray)).subscribe(feeAccountsData => {
    //   // TODO: needs to be in the selector apparently
    //   const mappedData: any[] = [];
    //   feeAccountsData.forEach(element => {
    //     element = {
    //       ...element,
    //       routerLink: `account/${element.accountNumber}/summary`
    //     };
    //     mappedData.push(element);
    //   });
    //   this.tableRows = mappedData;
    // });

    this.columnConfig = [
      { header: 'Account number', key: 'accountNumber', type: 'link' },
      { header: 'Account name', key: 'accountName' }
    ];
  }

  ngOnDestroy() {
    this.feeAccountsSubscription.unsubscribe();
  }

}
