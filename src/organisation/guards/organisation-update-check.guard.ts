import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import * as fromStore from '../store';
import { OrganisationDetailsUpdateType } from './organisation-details-update.guard';

@Injectable()
export class OrganisationUpdateCheckGuard {
  constructor(
    private readonly store: Store<fromStore.OrganisationState>,
    private readonly router: Router
  ) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const updateType = route.data.updateType as OrganisationDetailsUpdateType;
    const completedSelector = updateType === 'name'
      ? fromStore.getNameUpdateDraftCompleted
      : fromStore.getSraUpdateDraftCompleted;

    return this.store.pipe(
      select(completedSelector),
      take(1),
      map((draftCompleted) => draftCompleted
        ? true
        : this.router.createUrlTree([`/organisation/update-${updateType === 'name' ? 'org-name' : 'sra'}`]))
    );
  }
}
