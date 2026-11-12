import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
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
    private readonly store: Store<fromStore.OrganisationState>,
    private readonly router: Router
  ) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
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
        map(() => route.firstChild?.routeConfig?.path
          ? this.router.createUrlTree(['/organisation/update-address'])
          : true)
      ))
    );
  }
}
