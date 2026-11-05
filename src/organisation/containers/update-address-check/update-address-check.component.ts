import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AddressUpdateDraft } from '../../models/address-update.model';
import { utils } from '../../utils';
import * as fromStore from '../../store';

@Component({
  selector: 'app-update-address-check',
  templateUrl: './update-address-check.component.html',
  standalone: false
})
export class UpdateAddressCheckComponent implements OnInit, OnDestroy {
  public draftAddress: AddressUpdateDraft | null = null;
  public isSubmitting = false;
  public validationErrors: { id: string, message: string }[] = [];
  public readonly apiErrorMessage = 'Sorry, there is a problem with the service. Try again later';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly store: Store<fromStore.OrganisationState>
  ) {}

  public ngOnInit(): void {
    this.store.pipe(
      select(fromStore.getAddressUpdateDraft),
      filter((draftAddress) => Boolean(draftAddress)),
      takeUntil(this.destroy$)
    ).subscribe((draftAddress) => this.draftAddress = draftAddress);

    this.store.pipe(
      select(fromStore.getAddressUpdating),
      takeUntil(this.destroy$)
    ).subscribe((isSubmitting) => this.isSubmitting = isSubmitting);

    this.store.pipe(
      select(fromStore.getAddressUpdateError),
      takeUntil(this.destroy$)
    ).subscribe((error) => {
      this.validationErrors = error
        ? [{ id: 'submit-address-update', message: this.apiErrorMessage }]
        : [];
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onSubmit(): void {
    if (!this.draftAddress || this.isSubmitting) {
      return;
    }
    this.store.dispatch(new fromStore.OrganisationUpdateAddress(
      utils.getContactInformationFromAddressUpdate(this.draftAddress)
    ));
  }

  public onBack(): void {
    const backRoute = this.draftAddress?.hasDxReference
      ? '/organisation/update-address/document-exchange-reference-details'
      : '/organisation/update-address/document-exchange-reference';
    void this.router.navigate([backRoute]);
  }

  public onCancel(): void {
    this.store.dispatch(new fromStore.ClearOrganisationAddressUpdate());
    void this.router.navigate(['/organisation']);
  }
}
