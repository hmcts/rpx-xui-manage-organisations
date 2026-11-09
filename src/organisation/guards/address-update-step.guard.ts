import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AddressUpdateDraft } from '../models/address-update.model';
import * as fromStore from '../store';

export type AddressUpdateStep = 'document-exchange-reference' | 'document-exchange-reference-details' | 'check';

@Injectable()
export class AddressUpdateStepGuard {
  constructor(
    private readonly store: Store<fromStore.OrganisationState>,
    private readonly router: Router
  ) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const step = route.data.addressUpdateStep as AddressUpdateStep;

    return this.store.pipe(
      select(fromStore.getAddressUpdateDraft),
      take(1),
      map((draft) => this.canAccessStep(step, draft)
        ? true
        : this.router.createUrlTree(['/organisation/update-address']))
    );
  }

  private canAccessStep(step: AddressUpdateStep, draft: AddressUpdateDraft | null): boolean {
    if (!draft?.showExistingAddress) {
      return false;
    }

    if (step === 'document-exchange-reference') {
      return true;
    }

    if (step === 'document-exchange-reference-details') {
      return draft.hasDxReference === true;
    }

    return draft.hasDxReference === false || (
      draft.hasDxReference === true &&
      draft.dxNumber !== null &&
      draft.dxExchange !== null
    );
  }
}
