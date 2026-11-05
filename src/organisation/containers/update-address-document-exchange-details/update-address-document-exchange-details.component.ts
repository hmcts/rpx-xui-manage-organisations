import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DocumentExchangeDetails } from '../../../shared/components/document-exchange-details/document-exchange-details.component';
import * as fromStore from '../../store';

@Component({
  selector: 'app-update-address-document-exchange-details',
  templateUrl: './update-address-document-exchange-details.component.html',
  standalone: false
})
export class UpdateAddressDocumentExchangeDetailsComponent implements OnInit, OnDestroy {
  public dxNumber: string | null = null;
  public dxExchange: string | null = null;

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
    ).subscribe((draftAddress) => {
      this.dxNumber = draftAddress?.dxNumber ?? null;
      this.dxExchange = draftAddress?.dxExchange ?? null;
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onContinue(details: DocumentExchangeDetails): void {
    this.store.dispatch(new fromStore.UpdateOrganisationAddressDraft(details));
    this.router.navigate(['/organisation/update-address/check']);
  }

  public onBack(): void {
    this.router.navigate(['/organisation/update-address/document-exchange-reference']);
  }

  public onCancel(): void {
    this.store.dispatch(new fromStore.ClearOrganisationAddressUpdate());
    this.router.navigate(['/organisation']);
  }
}
