import { Store } from '@ngrx/store';
import { of } from 'rxjs';
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

    expect(store.dispatch).toHaveBeenCalledTimes(4);

    // (optional) assert dispatch types/order more strictly
    const types = store.dispatch.calls.allArgs().map((args) => args[0].constructor.name);
    expect(types).toEqual([
      'StartAppInitilizer',
      'LoadFeatureToggleConfig',
      'LoadFeatureToggleConfigSuccess',
      'FinishAppInitilizer'
    ]);
  });
});
