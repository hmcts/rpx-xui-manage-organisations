import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { AppConstants } from './app.constants';
import * as fromApp from './store';
import * as fromSelectors from './store/selectors/app.selectors';

export function initApplication(store: Store<fromApp.State>): VoidFunction {
  return () => new Promise((resolve) => {
    store.dispatch(new fromApp.StartAppInitilizer());
    store.dispatch(new fromApp.LoadFeatureToggleConfig([
      AppConstants.FEATURE_NAMES.editUserPermissions,
      AppConstants.FEATURE_NAMES.newRegisterOrg
    ]));

    // Immediately inject static flags (your 3 hard-coded ones)
    store.dispatch(new fromApp.LoadFeatureToggleConfigSuccess(AppConstants.STATIC_FEATURE_FLAGS));

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
