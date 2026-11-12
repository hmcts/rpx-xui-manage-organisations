import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import * as fromStore from '../../store';

@Component({
  selector: 'app-update-address-document-exchange',
  templateUrl: './update-address-document-exchange.component.html',
  standalone: false
})
export class UpdateAddressDocumentExchangeComponent implements OnInit, OnDestroy {
  public hasDxReference: boolean = false;

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
    ).subscribe((draftAddress) => this.hasDxReference = draftAddress?.hasDxReference ?? false);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onContinue(hasDxReference: boolean): void {
    this.store.dispatch(new fromStore.UpdateOrganisationAddressDraft({
      hasDxReference,
      ...(hasDxReference ? {} : { dxNumber: null, dxExchange: null })
    }));

    const nextRoute = hasDxReference
      ? '/organisation/update-address/document-exchange-reference-details'
      : '/organisation/update-address/check';
    void this.router.navigate([nextRoute]);
  }

  public onBack(): void {
    void this.router.navigate(['/organisation/update-address']);
  }

  public onCancel(): void {
    this.store.dispatch(new fromStore.ClearOrganisationAddressUpdate());
    void this.router.navigate(['/organisation']);
  }
}
