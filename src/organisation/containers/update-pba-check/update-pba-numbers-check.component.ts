import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { OrganisationDetails, PendingPaymentAccount } from '../../../models';
import * as fromStore from '../../store';

@Component({
  selector: 'app-prd-update-pba-numbers-check-component',
  templateUrl: './update-pba-numbers-check.component.html',
  styleUrls: ['./update-pba-numbers-check.component.scss']
})
export class UpdatePbaNumbersCheckComponent implements OnInit, OnDestroy {
  public readonly title: string = 'Check your PBA accounts';
  public organisationDetails: OrganisationDetails;
  public summaryErrors: {
    header: string;
    isFromValid: boolean;
    items: {
      id: string;
      message: any;
    }[]
  };
  public alreadyUsedError: string;

  private detailsSubscription: Subscription;
  private errorSubscription: Subscription;

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
    this.summaryErrors = null;
  }

  public ngOnDestroy(): void {
    if (this.detailsSubscription) {
      this.detailsSubscription.unsubscribe();
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

  public onSubmitClicked(): void {
    this.orgStore.dispatch(new fromStore.OrganisationUpdatePBAError(null));
    this.watchForErrors();
    this.orgStore.dispatch(new fromStore.OrganisationUpdatePBAs(this.pendingChanges));
  }

  /**
   * Get Organisation Details from Store.
   *
   * Once we have the Organisation Details, we display them on the page.
   */
  private getOrganisationDetailsFromStore(): void {
    this.detailsSubscription = this.orgStore.pipe(select(fromStore.getOrganisationSel)).subscribe(organisationDetails => {
      this.organisationDetails = organisationDetails;

      if (!this.hasPendingChanges) {
        this.router.navigate(['/organisation/update-pba-numbers']).then(() => {});
      }
    });
  }

  private watchForErrors(): void {
    this.errorSubscription = this.orgStore.pipe(select(fromStore.getOrganisationError)).subscribe(error => {
      if (error) {
        if (error.status === 500) {
          this.router.navigate(['/service-down']);
        } else {
          this.summaryErrors = {
            isFromValid: false,
            header: 'There is a problem',
            items: [{
              id: 'change-pending-add-pba-numbers__link',
              message: error.message
            }]
          };
          this.alreadyUsedError = error.status === 409 ? error.message : null;
        }
      } else {
        this.summaryErrors = null;
        this.alreadyUsedError = null;
      }
    });
  }
}
