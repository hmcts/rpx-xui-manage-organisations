import { Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { AppConstants } from './app.constants';
import { initApplication } from './app-initializer';
import * as fromApp from './store';

describe('App initializer', () => {
  let store: jasmine.SpyObj<Store<fromApp.State>>;

  beforeEach(() => {
    store = jasmine.createSpyObj<Store<fromApp.State>>('store', ['dispatch', 'pipe']);

    store.pipe.and.callFake(() =>
      of(
        { featureFlags: undefined } as any,
        { featureFlags: { any: true } } as any
      )
    );
  });

  it('dispatches start/load/success and then finish when feature flags are present', async () => {
    const fn = initApplication(store);
    expect(fn).toBeTruthy();

    await fn(); // await the Promise returned by the initializer

    expect(store.dispatch).toHaveBeenCalledTimes(3);

    const types = store.dispatch.calls.allArgs().map((args) => args[0].constructor.name);
    expect(types).toEqual([
      'StartAppInitilizer',
      'LoadFeatureToggleConfig',
      'FinishAppInitilizer'
    ]);
  });

  it('dispatches the expected feature toggle payload before finishing initialization', async () => {
    const fn = initApplication(store);

    await fn();

    const loadFeatureToggleAction = store.dispatch.calls.argsFor(1)[0] as unknown as fromApp.LoadFeatureToggleConfig;
    expect(loadFeatureToggleAction.payload).toEqual([
      AppConstants.FEATURE_NAMES.editUserPermissions,
      AppConstants.FEATURE_NAMES.caaMenuItems,
      AppConstants.FEATURE_NAMES.newCasesItems,
      AppConstants.FEATURE_NAMES.newRegisterOrg,
      AppConstants.FEATURE_NAMES.ogdInviteUserFlow,
      AppConstants.STATIC_FEATURE_FLAGS
    ]);
  });

  it('does not finish initialization until feature flags are available', async () => {
    const appState$ = new Subject<any>();
    store.pipe.and.returnValue(appState$.asObservable());

    const fn = initApplication(store);
    const promise = fn();

    appState$.next({ featureFlags: undefined });
    await Promise.resolve();

    let types = store.dispatch.calls.allArgs().map((args) => args[0].constructor.name);
    expect(types).toEqual([
      'StartAppInitilizer',
      'LoadFeatureToggleConfig'
    ]);

    appState$.next({ featureFlags: { any: true } });
    await promise;

    types = store.dispatch.calls.allArgs().map((args) => args[0].constructor.name);
    expect(types).toEqual([
      'StartAppInitilizer',
      'LoadFeatureToggleConfig',
      'FinishAppInitilizer'
    ]);
  });
});
