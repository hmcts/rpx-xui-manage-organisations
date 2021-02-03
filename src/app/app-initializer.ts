import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { AppConstants } from './app.constants';
import * as fromApp from './store';

export function initApplication(store: Store<fromApp.State>): VoidFunction {
  return () => new Promise(resolve => {
    store.dispatch(new fromApp.StartAppInitilizer());
    store.dispatch(new fromApp.LoadFeatureToggleConfig([AppConstants.FEATURE_NAMES.feeAccount,
                                                        AppConstants.FEATURE_NAMES.editUserPermissions,
                                                        AppConstants.FEATURE_NAMES.unassignedCases]));
    store.pipe(
      select((state: fromApp.State) => state.appState),
      take(2)
    ).subscribe(appState => {
      if (appState.featureFlags) {
        store.dispatch(new fromApp.FinishAppInitilizer());
        resolve(true);
      }
    });
  });
}
