import { Component, OnDestroy, OnInit } from '@angular/core';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DxAddress, OrganisationContactInformation, OrganisationDetails, PBANumberModel } from '../../../models';
import { Regulator, RegulatorType, RegulatoryType } from '../../../register-org/models';
import { AppConstants } from '../../../app/app.constants';
import * as fromAuthStore from '../../../user-profile/store';
import * as fromStore from '../../store';
import { utils } from '../../utils';

@Component({
  selector: 'app-prd-organisation-component',
  templateUrl: './organisation.component.html'
})
export class OrganisationComponent implements OnInit, OnDestroy {
  public organisationDetails: OrganisationDetails;
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
  public isFeatureEnabled$: Observable<boolean>;

  private readonly untiDestroy = new Subject<void>();

  constructor(
    private readonly orgStore: Store<fromStore.OrganisationState>,
    private readonly authStore: Store<fromAuthStore.AuthState>,
    private readonly featureToggleService: FeatureToggleService
  ) {
    this.getOrganisationDetailsFromStore();
  }

  ngOnInit(): void {
    this.isFeatureEnabled$ = this.featureToggleService.getValue(AppConstants.FEATURE_NAMES.newRegisterOrg, false);
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
        this.organisationType = utils.getOrganisationType(organisationDetails);
        this.regulators = utils.getRegulators(organisationDetails);
        this.organisationDxAddress = utils.getDxAddress(this.organisationContactInformation);
        this.organisationDetails = organisationDetails;
        this.canShowChangePbaNumbersLink();
      });
  }

  public canShowChangePbaNumbersLink(): void {
    this.authStore.pipe(select(fromAuthStore.getIsUserPuiFinanceManager))
      .pipe(takeUntil(this.untiDestroy)).subscribe((userIsPuiFinanceManager: boolean) => {
        this.showChangePbaNumberLink = userIsPuiFinanceManager;
      });
  }
}
