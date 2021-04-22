import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Organisation } from 'src/organisation/organisation.model';
import { OrganisationDetails } from '../../../models/organisation.model';
import * as fromStore from '../../store';

@Component({
  selector: 'app-prd-update-pba-numbers-component',
  templateUrl: './update-pba-numbers.component.html',
})
export class UpdatePbaNumbersComponent implements OnInit {

  public organisation: Organisation;

  constructor(private readonly orgStore: Store<fromStore.OrganisationState>) { }

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
      [] : organisationDetails.paymentAccount;
  }

  /**
   * Get Organisation Details from Store.
   *
   * Once we have the Organisation Details, we display them on the page.
   */
  private getOrganisationDetailsFromStore(): void {
    this.orgStore.pipe(select(fromStore.getOrganisationSel)).subscribe(organisationDetails => {
      this.organisation = organisationDetails;
    });
  }
}
