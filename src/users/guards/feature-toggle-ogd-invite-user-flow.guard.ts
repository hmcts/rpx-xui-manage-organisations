import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../src/app/store';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

export const featureToggleOdgInviteUserFlowGuard = (next: ActivatedRouteSnapshot) => {
  return inject(Store<fromRoot.State>).pipe(select(fromRoot.getOgdInviteUserFlowFeatureIsEnabled));
};
