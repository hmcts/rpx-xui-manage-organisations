import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { OrganisationDetails, PBANumberModel, PendingPaymentAccount } from '../../../models';
import { OrgManagerConstants } from '../../organisation-constants';
import { PBAService } from '../../services/pba.service';
import * as fromStore from '../../store';
import * as organisationActions from '../../store/actions';

export class ErrorMessage {
  public pbaNumber: string;
  public error: string;
  public headerError: string;
}
@Component({
  selector: 'app-prd-update-pba-numbers-check-component',
  templateUrl: './update-pba-numbers-check.component.html',
  styleUrls: ['./update-pba-numbers-check.component.scss']
})
export class UpdatePbaNumbersCheckComponent implements OnInit, OnDestroy {
  public readonly title: string = 'Check your PBA accounts';
  public organisationDetails: OrganisationDetails;
  public errors: ErrorMessage[] = [];


  public alreadyUsedError: string;
  private detailsSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly pbaService: PBAService,
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

  public ngOnDestroy(): void {
    if (this.detailsSubscription) {
      this.detailsSubscription.unsubscribe();
    }
  }

  public getError(pba: PBANumberModel): string {
    const errorFound = this.errors.filter(x => x.pbaNumber === pba.pbaNumber);
    return errorFound.length ? errorFound[0].error : '';
  }

  public onSubmitClicked(): void {
    this.errors = [];

    this.orgStore.dispatch(new organisationActions.OrganisationUpdatePBAs(this.pendingChanges));
  }

  public getErrorDuplicateHeaderMessage(pbaNumber: string) {
    return OrgManagerConstants.PBA_ERROR_ALREADY_USED_HEADER_MESSAGES[0].replace(OrgManagerConstants.PBA_MESSAGE_PLACEHOLDER, pbaNumber);
  }

  public getErrorDuplicateMessage(pbaNumber: string) {
    return OrgManagerConstants.PBA_ERROR_ALREADY_USED_MESSAGES[0].replace(OrgManagerConstants.PBA_MESSAGE_PLACEHOLDER, pbaNumber);
  }

  private getOrganisationDetailsFromStore(): void {
    this.detailsSubscription = this.orgStore.pipe(select(fromStore.getOrganisationSel)).subscribe(organisationDetails => {
      this.organisationDetails = organisationDetails;

      if (!this.hasPendingChanges) {
        this.router.navigate(['/organisation/update-pba-numbers']).then(() => {});
      }
    });
  }
}
