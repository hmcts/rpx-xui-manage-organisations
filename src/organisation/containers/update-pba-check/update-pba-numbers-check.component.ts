import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { OrganisationDetails, PBANumberModel, PendingPaymentAccount } from '../../../models';
import { ErrorMessage } from '../../organisation-constants';
import { PBAService } from '../../services/pba.service';
import * as fromStore from '../../store';
import * as organisationActions from '../../store/actions';

@Component({
  selector: 'app-prd-update-pba-numbers-check-component',
  templateUrl: './update-pba-numbers-check.component.html',
  styleUrls: ['./update-pba-numbers-check.component.scss'],
  standalone: false
})
export class UpdatePbaNumbersCheckComponent implements OnInit, OnDestroy {
  public readonly title: string = 'Check your PBA accounts';
  public organisationDetails: OrganisationDetails;
  public errors: ErrorMessage[] = [];
  public err$: Observable<any>;

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
      pendingAddPaymentAccount: this.organisationDetails.pendingAddPaymentAccount.map((pba) => pba.pbaNumber),
      pendingRemovePaymentAccount: this.organisationDetails.pendingRemovePaymentAccount.map((pba) => pba.pbaNumber)
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
    const errorFound = this.errors.filter((x) => x.pbaNumber === pba.pbaNumber);
    return errorFound.length ? errorFound[0].error : '';
  }

  public onSubmitClicked(): void {
    this.errors = [];
    this.orgStore.dispatch(new organisationActions.OrganisationUpdatePBAs(this.pendingChanges));
    this.err$ = this.orgStore.pipe(select(fromStore.getOrganisationError));
    this.err$.subscribe((err) => {
      if (err) {
        this.errors.push(err);
      }
    });
  }

  private getOrganisationDetailsFromStore(): void {
    this.detailsSubscription = this.orgStore.pipe(select(fromStore.getOrganisationSel)).subscribe((organisationDetails) => {
      this.organisationDetails = organisationDetails;

      if (!this.hasPendingChanges) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.router.navigate(['/organisation/update-pba-numbers']).then(() => {});
      }
    });
  }
}
