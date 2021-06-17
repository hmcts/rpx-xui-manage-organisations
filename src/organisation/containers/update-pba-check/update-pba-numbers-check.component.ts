import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { OrganisationDetails, PendingPaymentAccount } from '../../../models';
import * as fromStore from '../../store';

@Component({
  selector: 'app-prd-update-pba-numbers-check-component',
  templateUrl: './update-pba-numbers-check.component.html',
})
export class UpdatePbaNumbersCheckComponent implements OnInit {

  public readonly title: string = 'Check your PBA accounts';
  public organisationDetails: OrganisationDetails;

  constructor(
    private readonly router: Router,
    private readonly orgStore: Store<fromStore.OrganisationState>
  ) {}

  public ngOnInit(): void {
    this.getOrganisationDetailsFromStore();
  }

  /**
   * Get Organisation Details from Store.
   *
   * Once we have the Organisation Details, we display them on the page.
   */
  private getOrganisationDetailsFromStore(): void {
    this.orgStore.pipe(select(fromStore.getOrganisationSel)).subscribe(organisationDetails => {
      this.organisationDetails = organisationDetails;

      const noPendingChangesToCommit = (!this.organisationDetails.pendingAddPaymentAccount.length && !this.organisationDetails.pendingRemovePaymentAccount.length);

      if (noPendingChangesToCommit) {
        this.router.navigate(['/organisation/update-pba-numbers']).then(() => {});
      }
    });
  }

  public onSubmitClicked(): void {
    const pendingPaymentAccount: PendingPaymentAccount = {
      pendingAddPaymentAccount: this.organisationDetails.pendingAddPaymentAccount.map(pba => pba.pbaNumber),
      pendingRemovePaymentAccount: this.organisationDetails.pendingRemovePaymentAccount.map(pba => pba.pbaNumber)
    };
    this.orgStore.dispatch(new fromStore.OrganisationUpdatePBAs(pendingPaymentAccount));
  }
}
