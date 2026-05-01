import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import * as fromStore from '../store';

@Injectable()
export class OrganisationGuard {
  constructor(private readonly store: Store<fromStore.OrganisationState>) {}

  public canActivate(): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  public checkStore(): Observable<boolean> {
    return this.store.pipe(select(fromStore.getOrganisationSel),
      tap((organisation) => {
        if (!organisation?.organisationIdentifier) {
          this.store.dispatch(new fromStore.LoadOrganisation());
        }
      }),
      filter((organisation) => !!organisation?.organisationIdentifier),
      take(1),
      map(() => true)
    );
  }
}
