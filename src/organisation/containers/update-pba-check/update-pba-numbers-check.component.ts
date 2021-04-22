import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Organisation } from 'src/organisation/organisation.model';
import { OrganisationDetails } from '../../../models/organisation.model';
import * as fromStore from '../../store';

@Component({
  selector: 'app-prd-update-pba-numbers-check-component',
  templateUrl: './update-pba-numbers-check.component.html',
})
export class UpdatePbaNumbersCheckComponent implements OnInit {

  public readonly title: string = 'Check your PBA accounts';
  public organisation: Organisation;

  constructor(
    private readonly router: Router,
    private readonly orgStore: Store<fromStore.OrganisationState>) { }

  public ngOnInit() {
    this.getOrganisationDetailsFromStore();
  }

  /**
   * Get Payment Account
   *
   * Get the PBA numbers for the Organisation.
   *
   * @param organisationDetails - See unit test.
   * @return ['PBA3344542','PBA7843342']
   */
  public getPaymentAccount(organisationDetails: Partial<OrganisationDetails>): string[] {
    return (!organisationDetails.hasOwnProperty('paymentAccount') || !organisationDetails.paymentAccount.length) ?
      null : organisationDetails.paymentAccount;
  }

  /**
   * Get Organisation Details from Store.
   *
   * Once we have the Organisation Details, we display them on the page.
   */
  private getOrganisationDetailsFromStore(): void {
    this.orgStore.pipe(select(fromStore.getOrganisationSel)).subscribe(organisationDetails => {
      this.organisation = organisationDetails;

      const noPendingChangesToCommit = (!this.organisation.pendingAddPaymentAccount.length && !this.organisation.pendingRemovePaymentAccount.length);

      if (noPendingChangesToCommit) {
        this.router.navigate(['/organisation/update-pba-numbers']);
      }
    });
  }

  public onSubmitClicked(): void {}
}
