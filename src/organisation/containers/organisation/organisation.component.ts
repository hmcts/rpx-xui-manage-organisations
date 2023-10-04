import { Component, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DxAddress, OrganisationContactInformation, OrganisationDetails, PBANumberModel } from '../../../models';
import { Regulator, RegulatorType, RegulatoryType } from '../../../register-org/models';
import * as fromAuthStore from '../../../user-profile/store';
import * as fromStore from '../../store';
import { utils } from '../../utils';

@Component({
  selector: 'app-prd-organisation-component',
  templateUrl: './organisation.component.html'
})
export class OrganisationComponent implements OnDestroy {
  public organisationDetails: Partial<OrganisationDetails>;
  public organisationContactInformation: OrganisationContactInformation;
  public organisationDxAddress: DxAddress;
  public organisationPaymentAccount: PBANumberModel[];
  public organisationPendingPaymentAccount: string[];
  public showChangePbaNumberLink: boolean;
  public regulatorType = RegulatorType;
  public regulatoryTypeEnum = RegulatoryType;
  public companyRegistrationNumber: string;
  public organisationType: string;
  public regulators: Regulator[];

  private readonly untiDestroy = new Subject<void>();

  constructor(
    private readonly orgStore: Store<fromStore.OrganisationState>,
    private readonly authStore: Store<fromAuthStore.AuthState>
  ) {
    this.getOrganisationDetailsFromStore();
  }

  public ngOnDestroy(): void {
    this.untiDestroy.next();
    this.untiDestroy.complete();
  }

  public getOrganisationDetailsFromStore(): void {
    this.orgStore.pipe(select(fromStore.getOrganisationSel))
      .pipe(takeUntil(this.untiDestroy)).subscribe((organisationDetails) => {
        this.organisationContactInformation = utils.getContactInformation(organisationDetails);
        this.organisationPaymentAccount = utils.getPaymentAccount(organisationDetails);
        this.organisationPendingPaymentAccount = utils.getPendingPaymentAccount(organisationDetails);
        this.organisationDxAddress = utils.getDxAddress(this.organisationContactInformation);
        this.organisationDetails = organisationDetails;

        // TODO: Delete the below method call during the implementation of the below ticket
        // https://tools.hmcts.net/jira/browse/EUI-8869 which deals with the integration/mapping data
        // once the updated version of the API is available and provides the missing information
        this.mockMissingDataTillNewVersionOfApiIsReady();

        // TODO: Uncomment the below lines during the implementation of the below ticket
        // https://tools.hmcts.net/jira/browse/EUI-8869 which deals with the integration/mapping data
        // once the updated version of the API is available and provides the missing information
        // this.companyRegistrationNumber = utils.getCompanyRegistrationNumber(organisationDetails);
        // this.organisationType = utils.getOrganisationType(organisationDetails);
        // this.regulators = utils.getRegulators(organisationDetails);

        this.canShowChangePbaNumbersLink();
      });
  }

  public canShowChangePbaNumbersLink(): void {
    this.authStore.pipe(select(fromAuthStore.getIsUserPuiFinanceManager))
      .pipe(takeUntil(this.untiDestroy)).subscribe((userIsPuiFinanceManager: boolean) => {
        this.showChangePbaNumberLink = userIsPuiFinanceManager;
      });
  }

  // TODO: Delete the below method during the implementation of the below ticket
  // https://tools.hmcts.net/jira/browse/EUI-8869 which deals with the integration/mapping data
  // once the updated version of the API is available and provides the missing information
  private mockMissingDataTillNewVersionOfApiIsReady(): void {
    this.companyRegistrationNumber = '12345678';
    this.organisationType = 'IT and communications';
    this.regulators = [
      {
        regulatorType: 'Solicitor Regulation Authority (SRA)',
        organisationRegistrationNumber: '11223344'
      },
      {
        regulatorType: 'Other',
        regulatorName: 'Other regulatory organisation',
        organisationRegistrationNumber: '12341234'
      },
      {
        regulatorType: 'Charted Institute of Legal Executives',
        organisationRegistrationNumber: '43214321'
      }
    ];
  }
}
