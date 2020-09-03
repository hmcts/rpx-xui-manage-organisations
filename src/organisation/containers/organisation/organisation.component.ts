import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';

@Component({
  selector: 'app-prd-organisation-component',
  templateUrl: './organisation.component.html',
})
export class OrganisationComponent implements OnInit, OnDestroy {

  private organisationDetails;
  private organisationContactInformation;
  private organisationDxAddress;
  private organisationPaymentAccount;

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
   * TODO: Add type
   * @see unit test
   *
   * TODO: Have a type for Contact information.
   */
  public getContactInformation(organisationDetails) {

    return organisationDetails.contactInformation[0];
  }

  /**
   * Get DX Address
   *
   * Note that we check for the length as an empty array is returned from PRD, and if there is nothing available in that array,
   * we should not show the 'DX number' field within the view at all.
   *
   * @param contactInformation - see unit test
   * @return [
   * {
   *  dxNumber: 'DX 4534234552',
   *  dxExchange: 'London',
   * }
   * ]
   *
   * TODO: Add type
   */
  public getDxAddress(contactInformation) {

    return (!contactInformation.hasOwnProperty('dxAddress') || !contactInformation.dxAddress.length) ?
      null : contactInformation.dxAddress[0];
  }

  public getPaymentAccount(organisationDetails) {

    return (!organisationDetails.hasOwnProperty('paymentAccount') || !organisationDetails.paymentAccount.length) ?
      null : organisationDetails.paymentAccount;
  }

  /**
   * Get Organisation Details from Store.
   *
   * Once we have the organisation details, we display these on the page.
   */
  public getOrganisationDetailsFromStore(): void {

    this.store.pipe(select(fromStore.getOrganisationSel)).subscribe(organisationDetails => {

      // const mockOrganisationDetails = {
      //   name: 'Luke Solicitors',
      //   organisationIdentifier: 'HAUN33E',
      //   contactInformation: [
      //     {
      //       addressLine1: '23',
      //       addressLine2: null,
      //       addressLine3: null,
      //       townCity: 'Aldgate East',
      //       county: 'London',
      //       country: null,
      //       postCode: 'AT54RT',
      //       dxAddress: [
      //         {
      //           dxNumber: 'DX 4534234552',
      //           dxExchange: 'London',
      //         }
      //       ]
      //     }
      //   ],
      //   status: 'ACTIVE',
      //   sraId: 'SRA1298455554',
      //   sraRegulated: false,
      //   superUser: {
      //     firstName: 'Lukddde',
      //     lastName: 'Wilsodddn',
      //     email: 'lukesuperusessrxui@mailnesia.com'
      //   },
      //   paymentAccount: [
      //     'PBA3344552',
      //     'PBA7843345',
      //   ]
      // };

      this.organisationContactInformation = this.getContactInformation(organisationDetails);
      this.organisationPaymentAccount = this.getPaymentAccount(organisationDetails);
      this.organisationDxAddress = this.getDxAddress(this.organisationContactInformation);

      console.log(this.organisationDxAddress);
      console.log(organisationDetails);
      this.organisationDetails = organisationDetails;
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
