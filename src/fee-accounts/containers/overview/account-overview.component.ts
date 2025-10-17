import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
// TODO: Below is a bad way to import!
import { GovukTableColumnConfig } from 'projects/gov-ui/src/lib/components/govuk-table/govuk-table.component';
import { Observable, of, Subscription } from 'rxjs';

import * as fromRoot from '../../../app/store';
import * as fromAccountStore from '../../../fee-accounts/store';
import { OrganisationDetails } from '../../../models/organisation.model';
import * as fromOrgStore from '../../../organisation/store';
import { FeeAccount } from '../../models/pba-accounts';

@Component({
  selector: 'app-prd-fee-accounts-component',
  templateUrl: './account-overview.component.html',
  standalone: false
})
export class OrganisationAccountsComponent implements OnInit, OnDestroy {
  public columnConfig: GovukTableColumnConfig[];
  public tableRows: object[];
  public accounts$: Observable<FeeAccount[]>;
  public loading$: Observable<boolean>;
  public orgData: OrganisationDetails;
  public org$: Observable<OrganisationDetails>;
  public isOrgAccountAvailable$: Observable<boolean>;
  public organisationSubscription: Subscription;
  public dependanciesSubscription: Subscription;
  public oneOrMoreAccountMissing$: Observable<boolean>;
  public errorMessages$: Observable<string[]>;

  constructor(
    private readonly feeStore: Store<fromAccountStore.FeeAccountsState>,
    private readonly organisationStore: Store<fromOrgStore.OrganisationState>,
    private readonly actions$: Actions,
    private readonly routerStore: Store<fromRoot.State>
  ) {}

  public ngOnInit(): void {
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
      this.organisationSubscription = this.org$.subscribe((data) => {
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

  public ngOnDestroy(): void {
    if (this.organisationSubscription) {
      this.organisationSubscription.unsubscribe();
    }
    if (this.dependanciesSubscription) {
      this.dependanciesSubscription.unsubscribe();
    }
    this.dispatchAction(this.feeStore, new fromAccountStore.LoadFeeAccountResetState());
  }

  public dispatchLoadFeeAccount(organisation: OrganisationDetails): boolean {
    const anyAccountForOrg = organisation.paymentAccount.length > 0;
    if (anyAccountForOrg) {
      const paymentAccount: string[] = organisation.paymentAccount.map((pa) => pa.pbaNumber);
      this.dispatchAction(this.feeStore, new fromAccountStore.LoadFeeAccounts(paymentAccount));
    } else {
      this.dispatchAction(this.feeStore, new fromAccountStore.LoadFeeAccountsSuccess([]));
    }
    return anyAccountForOrg;
  }

  public dispatchAction(feeStore: Store<fromAccountStore.FeeAccountsState>, action: Action): void {
    feeStore.dispatch(action);
  }
}
