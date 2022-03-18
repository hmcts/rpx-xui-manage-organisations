import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DxAddress, OrganisationContactInformation, OrganisationDetails, PBANumberModel } from '../../../models';
import * as fromAuthStore from '../../../user-profile/store';
import * as fromStore from '../../store';
import { utils } from '../../utils';

@Component({
  selector: 'app-prd-organisation-component',
  templateUrl: './organisation.component.html',
})
export class OrganisationComponent implements OnInit {

  public organisationDetails: Partial<OrganisationDetails>;
  public organisationContactInformation: OrganisationContactInformation;
  public organisationDxAddress: DxAddress;
  public organisationPaymentAccount: PBANumberModel[];
  public organisationPendingPaymentAccount: PBANumberModel[];
  public showChangePbaNumberLink: boolean;

  constructor(
    private readonly orgStore: Store<fromStore.OrganisationState>,
    private readonly authStore: Store<fromAuthStore.AuthState>) {
  }

  public ngOnInit(): void {
    this.getOrganisationDetailsFromStore();
  }

  /**
   * Get Organisation Details from Store.
   *
   * Once we have the Organisation Details, we display them on the page.
   */
  public getOrganisationDetailsFromStore(): void {
    this.orgStore.pipe(select(fromStore.getOrganisationSel)).subscribe(organisationDetails => {
      this.organisationContactInformation = utils.getContactInformation(organisationDetails);
      this.organisationPaymentAccount = utils.getPaymentAccount(organisationDetails);
      this.organisationPendingPaymentAccount = utils.getPendingPaymentAccount(organisationDetails);
      this.organisationDxAddress = utils.getDxAddress(this.organisationContactInformation);
      this.organisationDetails = organisationDetails;
      this.canShowChangePbaNumbersLink();
    });
  }

  public canShowChangePbaNumbersLink(): void {
      this.organisationDxAddress = utils.getDxAddress(this.organisationContactInformation);
      this.organisationDetails = organisationDetails;
      this.canShowChangePbaNumbersLink();
    });
  }

  public canShowChangePbaNumbersLink(): void {
    this.authStore.pipe(select(fromAuthStore.getIsUserPuiFinanceManager)).subscribe((userIsPuiFinanceManager: boolean) => {
      this.showChangePbaNumberLink = userIsPuiFinanceManager;
    });
  }

  public pbaNumberWithStatus(pba: PBANumberModel): string {
    if (pba.status) {
      return `${pba.pbaNumber} (${pba.status})`;
    }
    return pba.pbaNumber;
  }
}
