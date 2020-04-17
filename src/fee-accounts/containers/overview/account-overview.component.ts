import {Component, OnDestroy, OnInit} from '@angular/core';
import { GovukTableColumnConfig } from '@hmcts/rpx-xui-common-lib/lib/gov-ui/components/gov-uk-table/gov-uk-table.component';
import { Actions, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import {combineLatest, Observable, of, Subscription} from 'rxjs';
import { Organisation } from 'src/organisation/organisation.model';
import * as fromRoot from '../../../app/store';
import * as fromAccountStore from '../../../fee-accounts/store';
import * as fromOrgStore from '../../../organisation/store/index';
import {FeeAccount} from '../../models/pba-accounts';
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
  isOrgAccountAvailable$: Observable<boolean>;
  organisationSubscription: Subscription;
  dependanciesSubscription: Subscription;
  oneOrMoreAccountMissing$: Observable<boolean>;
  errorMessages$: Observable<Array<string>>;
  constructor(private feeStore: Store<fromAccountStore.FeeAccountsState>,
              private organisationStore: Store<fromOrgStore.OrganisationState>,
              private actions$: Actions,
              private routerStore: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.errorMessages$ = this.feeStore.pipe(select(fromAccountStore.getErrorMessages));
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
        const anyAccountForOrg = this.dispatchLoadFeeAccount(data);
        this.isOrgAccountAvailable$ = of(anyAccountForOrg);
        this.oneOrMoreAccountMissing$ = this.feeStore.pipe(select(fromAccountStore.isOneOrMorefeeAccountsMissing));
      });
    }
    this.accounts$ = this.feeStore.pipe(select(fromAccountStore.feeAccounts));
    this.loading$ = this.feeStore.pipe(select(fromAccountStore.feeAccountsLoading));
    this.columnConfig = [
      { header: 'Account number', key: 'account_number', type: 'link' },
      { header: 'Account name', key: 'account_name' }
    ];
    this.actions$.pipe(ofType(fromAccountStore.LOAD_FEE_ACCOUNTS_FAIL)).subscribe(() => {
      this.routerStore.dispatch(new fromRoot.Go({ path: ['service-down'] }));
    });
  }
  dispatchLoadFeeAccount(organisation: Organisation): boolean {
    const anyAccountForOrg = organisation.paymentAccount.length > 0;
    anyAccountForOrg ? this.dispatchAction(this.feeStore, new fromAccountStore.LoadFeeAccounts(organisation.paymentAccount)) :
      this.dispatchAction(this.feeStore, new fromAccountStore.LoadFeeAccountsSuccess([]));
    return anyAccountForOrg;
  }

  dispatchAction(feeStore: Store<fromAccountStore.FeeAccountsState>, action: Action) {
    feeStore.dispatch(action);
  }

  ngOnDestroy(): void {
    if (this.organisationSubscription) {
      this.organisationSubscription.unsubscribe();
    }
    if (this.dependanciesSubscription) {
      this.dependanciesSubscription.unsubscribe();
    }
    this.dispatchAction(this.feeStore, new fromAccountStore.LoadFeeAccountResetState());
  }
}
