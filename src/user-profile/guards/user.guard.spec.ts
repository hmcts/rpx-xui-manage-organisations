import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { throwError } from 'rxjs';
import { UserGuard } from './user.guard';
import * as fromStore from '../store';
import { GetUserDetails } from '../store/actions';

describe('UserGuard', () => {
  let guard: UserGuard;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserGuard,
        provideMockStore()
      ]
    });

    guard = TestBed.inject(UserGuard);
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should activate when the user is loaded', (done) => {
    store.overrideSelector(fromStore.userLoaded, true);

    guard.canActivate().subscribe((result) => {
      expect(result).toBeTrue();
      expect(store.dispatch).not.toHaveBeenCalled();
      done();
    });
  });

  it('should request user details when the user is not loaded yet', (done) => {
    const userLoadedSelector = store.overrideSelector(fromStore.userLoaded, false);

    guard.checkStore().subscribe((loaded) => {
      expect(loaded).toBeTrue();
      expect(store.dispatch).toHaveBeenCalledWith(new GetUserDetails());
      done();
    });

    expect(store.dispatch).toHaveBeenCalledWith(new GetUserDetails());
    userLoadedSelector.setResult(true);
    store.refreshState();
  });

  it('should not activate when checking the store errors', (done) => {
    spyOn(guard, 'checkStore').and.returnValue(throwError(() => new Error('store failure')));

    guard.canActivate().subscribe((result) => {
      expect(result).toBeFalse();
      done();
    });
  });
});
