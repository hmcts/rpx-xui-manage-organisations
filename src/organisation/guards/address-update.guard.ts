import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { utils } from '../utils';
import { OrganisationGuard } from './organisation.guard';
import * as fromStore from '../store';

@Injectable()
export class AddressUpdateGuard {
  constructor(
    private readonly organisationGuard: OrganisationGuard,
    private readonly store: Store<fromStore.OrganisationState>
  ) {}

  public canActivate(): Observable<boolean> {
    return this.organisationGuard.checkStore().pipe(
      switchMap(() => this.store.pipe(
        select(fromStore.getOrganisationSel),
        take(1),
        tap(() => {
          // Note: If needing to store current address details, we should do so here
          this.store.dispatch(new fromStore.InitialiseOrganisationAddressUpdate(
            utils.getEmptyAddressUpdateDraft()
          ));
        }),
        map(() => true)
      ))
    );
  }
}
