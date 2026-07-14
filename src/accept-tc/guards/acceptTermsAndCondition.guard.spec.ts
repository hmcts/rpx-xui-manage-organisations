import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AcceptTermsAndConditionGuard } from './acceptTermsAndCondition.guard';
import * as fromRoot from '../../app/store';
import * as fromUserProfile from '../../user-profile/store';

describe('Accept terms guard', () => {
  let guard: AcceptTermsAndConditionGuard;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AcceptTermsAndConditionGuard,
        provideMockStore()
      ]
    });

    guard = TestBed.inject(AcceptTermsAndConditionGuard);
    mockStore = TestBed.inject(MockStore);
    spyOn(mockStore, 'dispatch');
  });

  afterEach(() => {
    mockStore.resetSelectors();
  });

  it('is Truthy', () => {
    expect(guard).toBeTruthy();
  });

  it('can activate when TC has been accepted', (done) => {
    guard.canActivate().subscribe((v) => {
      expect(v).toBeTruthy();
      done();
    });
  });

  it('should dispatch a load action when terms and conditions state is not loaded', (done) => {
    const selectedTc = mockStore.overrideSelector(fromUserProfile.getHasUserSelectedTC, {
      loaded: false,
      hasUserAccepted: 'false'
    });
    mockStore.overrideSelector(fromUserProfile.getUid, 'user-id-1');

    guard.checkStore().subscribe((loadedState) => {
      expect(loadedState).toEqual({ loaded: true, hasUserAccepted: 'false' });
      expect(mockStore.dispatch).toHaveBeenCalledWith(new fromUserProfile.LoadHasAcceptedTC('user-id-1'));
      done();
    });

    expect(mockStore.dispatch).toHaveBeenCalledWith(new fromUserProfile.LoadHasAcceptedTC('user-id-1'));
    selectedTc.setResult({
      loaded: true,
      hasUserAccepted: 'false'
    });
    mockStore.refreshState();
  });

  it('should route home when terms and conditions have already been accepted', (done) => {
    mockStore.overrideSelector(fromUserProfile.getHasUserSelectedTC, {
      loaded: true,
      hasUserAccepted: 'true'
    });

    guard.checkStore().subscribe(() => {
      expect(mockStore.dispatch).toHaveBeenCalledWith(new fromRoot.Go({ path: ['/home'] }));
      done();
    });
  });
});
