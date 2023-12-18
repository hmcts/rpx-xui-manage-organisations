import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { AppConstants } from './app.constants';
import * as fromApp from './store';
import * as fromSelectors from './store/selectors/app.selectors';

export function initApplication(store: Store<fromApp.State>): VoidFunction {
  return () => new Promise((resolve) => {
    store.dispatch(new fromApp.StartAppInitilizer());
    store.dispatch(new fromApp.LoadFeatureToggleConfig([AppConstants.FEATURE_NAMES.feeAccount,
      AppConstants.FEATURE_NAMES.editUserPermissions,
      AppConstants.FEATURE_NAMES.caaMenuItems,
      AppConstants.FEATURE_NAMES.newRegisterOrg,
      AppConstants.FEATURE_NAMES.ogdInviteUserFlow]));

    store.pipe(
      select(fromSelectors.getAppState),
      take(2)
    ).subscribe((appState) => {
      if (appState.featureFlags) {
        store.dispatch(new fromApp.FinishAppInitilizer());
        resolve(true);
      }
    });
  });
}
