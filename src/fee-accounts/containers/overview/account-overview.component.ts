import {Component, OnInit} from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromFeeAccountsStore from '../../../fee-accounts/store';
import { GovukTableColumnConfig } from 'projects/gov-ui/src/lib/components/govuk-table/govuk-table.component';
import {Observable, Subscription} from 'rxjs';
import {FeeAccount} from '../../models/pba-accounts';
import * as fromStore from '../../../organisation/store/index';
import { Organisation } from 'src/organisation/organisation.model';
@Component({
  selector: 'app-prd-fee-accounts-component',
  templateUrl: './account-overview.component.html',
})

export class OrganisationAccountsComponent implements OnInit {
  columnConfig: GovukTableColumnConfig[];
  tableRows: {}[];
  accounts$: Observable<Array<FeeAccount>>;
  loading$: Observable<boolean>;
  orgData: Organisation;
  organisationSubscription: Subscription;
  constructor(private store: Store<fromFeeAccountsStore.FeeAccountsState>,
              private organisationStore: Store<fromStore.OrganisationState>) {}

  ngOnInit(): void {
    this.organisationSubscription = this.store.pipe(select(fromStore.getOrganisationSel)).subscribe(( data) => {
      this.orgData = data;
      this.store.dispatch(new fromFeeAccountsStore.LoadFeeAccounts(data.paymentAccount));
    });
    this.accounts$ = this.store.pipe(select(fromFeeAccountsStore.feeAccounts));
    this.loading$ = this.store.pipe(select(fromFeeAccountsStore.feeAccountsLoading));
    this.columnConfig = [
      { header: 'Account number', key: 'account_number', type: 'link' },
      { header: 'Oraganisation Id', key: 'organisationId' }
    ];
  }

}
