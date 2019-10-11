import {Component, OnInit, OnDestroy} from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromAccountStore from '../../../fee-accounts/store';
import { GovukTableColumnConfig } from 'projects/gov-ui/src/lib/components/govuk-table/govuk-table.component';
import {Observable, Subscription, combineLatest} from 'rxjs';
import {FeeAccount} from '../../models/pba-accounts';
import * as fromOrgStore from '../../../organisation/store/index';
import { Organisation } from 'src/organisation/organisation.model';
@Component({
  selector: 'app-prd-fee-accounts-component',
  templateUrl: './account-overview.component.html',
})

export class OrganisationAccountsComponent implements OnInit, OnDestroy {
  columnConfig: GovukTableColumnConfig[];
  tableRows: {}[];
  accounts$: Observable<Array<FeeAccount>>;
  loading$: Observable<boolean>;
  orgData: Organisation;
  org$: Observable<Organisation>;
  organisationSubscription: Subscription;
  dependanciesSubscription: Subscription;
  constructor(private feeStore: Store<fromAccountStore.FeeAccountsState>,
              private organisationStore: Store<fromOrgStore.OrganisationState>) {}

  ngOnInit(): void {
    const isOrgLoaded$ = this.organisationStore.pipe(select(fromOrgStore.getOrganisationLoaded));
    if (isOrgLoaded$) {
      this.dependanciesSubscription = isOrgLoaded$.subscribe((org) => {
        if (!org) {
          this.organisationStore.dispatch(new fromOrgStore.LoadOrganisation());
        }
        this.org$ = this.organisationStore.pipe(select(fromOrgStore.getOrganisationSel));
      });
    }
    if (this.org$) {
      this.organisationSubscription = this.org$.subscribe(( data) => {
        this.orgData = data;
        this.feeStore.dispatch(new fromAccountStore.LoadFeeAccounts(data.paymentAccount));
      });
    }
    this.accounts$ = this.feeStore.pipe(select(fromAccountStore.feeAccounts));
    this.loading$ = this.feeStore.pipe(select(fromAccountStore.feeAccountsLoading));
    this.columnConfig = [
      { header: 'Account number', key: 'account_number', type: 'link' },
      { header: 'Account name', key: 'account_name' }
    ];
  }
  ngOnDestroy(): void {
    if (this.organisationSubscription) {
      this.organisationSubscription.unsubscribe();
    }
    if (this.dependanciesSubscription) {
      this.dependanciesSubscription.unsubscribe();
    }
  }
}
