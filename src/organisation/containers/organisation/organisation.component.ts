import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DxAddress, OrganisationContactInformation, OrganisationDetails, PBANumberModel } from '../../../models';
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

  private readonly untiDestroy = new Subject<void>();

  constructor(
    private readonly orgStore: Store<fromStore.OrganisationState>,
    private readonly authStore: Store<fromAuthStore.AuthState>,
    private readonly changeDetectorRef: ChangeDetectorRef
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
