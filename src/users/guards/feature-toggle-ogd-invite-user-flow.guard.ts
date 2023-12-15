import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../../src/app/store';
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

@Injectable()
export class FeatureToggleOdgInviteUserFlowGuard implements CanActivate {
  constructor(private readonly appStore: Store<fromRoot.State>) {}

  public canActivate(): Observable<boolean> {
    return this.appStore.pipe(select(fromRoot.getOgdInviteUserFlowFeatureIsEnabled));
  }
}

export const featureToggleOdgInviteUserFlowGuard = (next: ActivatedRouteSnapshot) => {
  return inject(Store<fromRoot.State>).pipe(select(fromRoot.getOgdInviteUserFlowFeatureIsEnabled));
};
