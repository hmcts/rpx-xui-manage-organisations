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

  public get hasPendingChanges(): boolean {
    if (this.organisationDetails) {
      const adding = this.organisationDetails.pendingAddPaymentAccount || [];
      const removing = this.organisationDetails.pendingRemovePaymentAccount || [];
      return adding.length + removing.length > 0;
    }
    return false;
  }

  public get pendingChanges(): PendingPaymentAccount {
    return {
      pendingAddPaymentAccount: this.organisationDetails.pendingAddPaymentAccount.map(pba => pba.pbaNumber),
      pendingRemovePaymentAccount: this.organisationDetails.pendingRemovePaymentAccount.map(pba => pba.pbaNumber)
    };
  }

  public ngOnInit(): void {
    this.getOrganisationDetailsFromStore();
  }

  public onSubmitClicked(): void {
    this.orgStore.dispatch(new fromStore.OrganisationUpdatePBAs(this.pendingChanges));
  }

  /**
   * Get Organisation Details from Store.
   *
   * Once we have the Organisation Details, we display them on the page.
   */
  private getOrganisationDetailsFromStore(): void {
    this.orgStore.pipe(select(fromStore.getOrganisationSel)).subscribe(organisationDetails => {
      this.organisationDetails = organisationDetails;

      if (!this.hasPendingChanges) {
        this.router.navigate(['/organisation/update-pba-numbers']).then(() => {});
      }
    });
  }
}
