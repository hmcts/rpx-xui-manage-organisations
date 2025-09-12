import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../src/app/store';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { catchError, filter, first, Observable, of, timeout, TimeoutError } from 'rxjs';

@Injectable()
export class featureToggleOdgInviteUserFlowGuard implements CanActivate {
  constructor(private readonly appStore: Store<fromRoot.State>) {}

  public canActivate(): Observable<boolean> {
    // As the feature flags dont return their actual state first on refresh,
    // this code is needed to wait for a small time to allow the flag value to be its correct state
    return this.appStore.pipe(
      select(fromRoot.getOgdInviteUserFlowFeatureIsEnabled),
      filter((isEnabled) => isEnabled === true),
      first(),
      timeout(2000),
      catchError((error) => {
        if (error instanceof TimeoutError) {
          return of(false);
        }
      })
    );
  }
}
