import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AddressEntryResult } from '../../../shared/components/address-entry/address-entry.component';
import { AddressUpdateDraft } from '../../models/address-update.model';
import * as fromStore from '../../store';

@Component({
  selector: 'app-update-address',
  templateUrl: './update-address.component.html',
  standalone: false
})
export class UpdateAddressComponent implements OnInit, OnDestroy {
  public draftAddress: AddressUpdateDraft | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    public readonly router: Router,
    private readonly store: Store<fromStore.OrganisationState>
  ) {}

  public ngOnInit(): void {
    this.store.pipe(
      select(fromStore.getAddressUpdateDraft),
      filter((draftAddress) => Boolean(draftAddress)),
      takeUntil(this.destroy$)
    ).subscribe((draftAddress) => this.draftAddress = draftAddress);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onContinue(result: AddressEntryResult): void {
    this.store.dispatch(new fromStore.UpdateOrganisationAddressDraft({
      address: result.address,
      inInternationalMode: result.inInternationalMode,
      showExistingAddress: true
    }));
    void this.router.navigate(['/organisation/update-address/document-exchange-reference']);
  }

  public onCancel(): void {
    this.store.dispatch(new fromStore.ClearOrganisationAddressUpdate());
    void this.router.navigate(['/organisation']);
  }

  public onBack(resetAddressEntry: boolean): void {
    if (!resetAddressEntry) {
      void this.router.navigate(['/organisation']);
    }
  }
}
