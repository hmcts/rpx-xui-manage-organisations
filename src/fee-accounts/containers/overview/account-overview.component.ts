import {Component, OnInit} from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromFeeAccountsStore from '../../../fee-accounts/store';
import { GovukTableColumnConfig } from 'projects/gov-ui/src/lib/components/govuk-table/govuk-table.component';
import {Observable} from 'rxjs';
import {PbaAccountsSummary} from '../../models/pba-accounts';
import {LoadFeeAccounts} from '../../../fee-accounts/store';
@Component({
  selector: 'app-prd-fee-accounts-component',
  templateUrl: './account-overview.component.html',
})

export class OrganisationAccountsComponent implements OnInit{
  columnConfig: GovukTableColumnConfig[];
  tableRows: {}[];
  accounts$: Observable<Array<PbaAccountsSummary>>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromFeeAccountsStore.FeeAccountsState>) {}

  ngOnInit(): void {
    this.store.dispatch(new fromFeeAccountsStore.LoadFeeAccounts());
    this.accounts$ = this.store.pipe(select(fromFeeAccountsStore.feeAccounts));
    this.loading$ = this.store.pipe(select(fromFeeAccountsStore.feeAccountsLoading));
    this.columnConfig = [
      { header: 'Account number', key: 'pbaNumber', type: 'link' },
      { header: 'Oraganisation Id', key: 'organisationId' }
    ];
  }

}
