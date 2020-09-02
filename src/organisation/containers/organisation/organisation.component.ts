import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';
import {Observable, Subscription} from 'rxjs';
import {Organisation} from 'src/organisation/organisation.model';

@Component({
  selector: 'app-prd-organisation-component',
  templateUrl: './organisation.component.html',
})
export class OrganisationComponent implements OnInit, OnDestroy {

  private organisationDetails;
  private organisationContactInformation;
  // private organisationSubscription: Subscription;

  constructor(private store: Store<fromStore.OrganisationState>) {
  }

  /**
   * Get Contact Information
   *
   * Contact information comes in from PRD as an Array.
   *
   * After speaking to the EXUI BA:
   *
   * Only the first item of contactInformation will be used. It is a (far) future requirement
   * that multiply addresses will need to be considered. When this is a requirement the page will need
   * to be re-UX-designed, for multiple addresses. [2nd September 2020]
   *
   * @see unit test
   *
   * TODO: Have a type for Contact information.
   */
  public getContactInformation(organisationDetails) {

    return organisationDetails.contactInformation[0];
  }

  /**
   * Get Organisation Details from Store.
   *
   * Once we have the organisation details, we display these on the page.
   */
  public getOrganisationDetailsFromStore(): void {

    this.store.pipe(select(fromStore.getOrganisationSel)).subscribe(organisationDetails => {

      this.organisationContactInformation = this.getContactInformation(organisationDetails);

      const mockOrganisationDetails = {
        name: 'Luke Solicitors',
        organisationIdentifier: 'HAUN33E',
        contactInformation: [
          {
            addressLine1: '23',
            addressLine2: null,
            addressLine3: null,
            townCity: 'Aldgate East',
            county: 'London',
            country: null,
            postCode: 'AT54RT',
            dxAddress: [Array]
          }
        ],
        status: 'ACTIVE',
        sraId: 'SRA1298455554',
        sraRegulated: false,
        superUser: {
          firstName: 'Lukddde',
          lastName: 'Wilsodddn',
          email: 'lukesuperusessrxui@mailnesia.com'
        },
        paymentAccount: []
      };

      this.organisationDetails = mockOrganisationDetails;
    });
  }

  public getOrganisationDetails() {

    return this.organisationDetails;
  }

  public ngOnInit(): void {

    this.getOrganisationDetailsFromStore();
  }

  public ngOnDestroy(): void {

    // this.organisationSubscription.unsubscribe();
  }
}
